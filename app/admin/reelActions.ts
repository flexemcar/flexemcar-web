"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/app/lib/admin";
import { createClient } from "@/app/lib/supabase/server";
import { getTiktokOembed } from "@/app/lib/tiktokOembed";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) redirect("/admin/login");
  return supabase;
}

const VIDEO_RE = /tiktok\.com\/(@[\w.-]+)\/video\/(\d+)/i;

// Acepta el enlace largo (tiktok.com/@flexemcar/video/123...) y los cortos que
// da el boton "Compartir" de la app (vm.tiktok.com/..., tiktok.com/t/...),
// y lo deja siempre en la forma larga, sin parametros.
async function normalizeTiktokUrl(input: string): Promise<string | null> {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  let match = url.match(VIDEO_RE);
  if (!match && /(^|\.)tiktok\.com/i.test(new URL(url).hostname)) {
    try {
      const res = await fetch(url, { redirect: "follow", cache: "no-store" });
      match = res.url.match(VIDEO_RE);
    } catch {
      return null;
    }
  }
  return match ? `https://www.tiktok.com/${match[1]}/video/${match[2]}` : null;
}

export type ReelFormState = { error: string | null; ok: boolean };

export async function addReelAction(
  _prev: ReelFormState,
  formData: FormData
): Promise<ReelFormState> {
  const supabase = await requireAdmin();
  const raw = String(formData.get("video_url") ?? "").trim();
  if (!raw) return { error: "Pega el enlace del vídeo de TikTok.", ok: false };

  let videoUrl: string | null = null;
  try {
    videoUrl = await normalizeTiktokUrl(raw);
  } catch {
    videoUrl = null;
  }
  if (!videoUrl) {
    return {
      error:
        "Ese enlace no es de un vídeo de TikTok. En TikTok pulsa «Compartir» → «Copiar enlace» y pégalo aquí.",
      ok: false,
    };
  }

  const oembed = await getTiktokOembed(videoUrl);
  if (!oembed) {
    return {
      error: "TikTok no encuentra ese vídeo. Comprueba que sea público y que el enlace esté completo.",
      ok: false,
    };
  }

  // Por defecto el nuevo va el primero: es lo mas reciente.
  const { data: first } = await supabase
    .from("reels")
    .select("position")
    .order("position", { ascending: true })
    .limit(1);
  const top = first && first.length > 0 ? first[0].position - 1 : 0;

  const { error } = await supabase.from("reels").insert({ video_url: videoUrl, position: top });
  if (error) {
    if (error.code === "23505") return { error: "Ese vídeo ya está en la web.", ok: false };
    return { error: "No se ha podido guardar. Inténtalo de nuevo.", ok: false };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/");
  return { error: null, ok: true };
}

export async function deleteReelAction(id: string) {
  const supabase = await requireAdmin();
  const { count } = await supabase.from("reels").select("*", { count: "exact", head: true });
  // Se deja siempre al menos uno para que la seccion de la home no quede vacia.
  if ((count ?? 0) <= 1) return;
  const { error } = await supabase.from("reels").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/videos");
  revalidatePath("/");
}

// Intercambia la posicion con el vecino de arriba o de abajo. Antes reescribe
// las posiciones 0..n-1 para que no haya empates.
export async function moveReelAction(id: string, direction: "up" | "down") {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("reels")
    .select("id")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;

  const ids = data.map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  await Promise.all(
    ids.map((reelId, position) => supabase.from("reels").update({ position }).eq("id", reelId))
  );
  revalidatePath("/admin/videos");
  revalidatePath("/");
}
