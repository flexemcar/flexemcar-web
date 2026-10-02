import { fallbackReelUrls, toReel, type Reel } from "@/app/data/reels";
import { createClient } from "@/app/lib/supabase/server";
import { getTiktokOembed } from "@/app/lib/tiktokOembed";

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

export type ReelRow = { id: string; video_url: string; position: number };

// Videos guardados desde el panel, en su orden. null si la base de datos falla
// (o si aun no existe la tabla): quien llama decide el respaldo.
export async function getReelRows(): Promise<ReelRow[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reels")
      .select("id, video_url, position")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as ReelRow[];
  } catch (err) {
    console.error("getReelRows failed", err);
    return null;
  }
}

export async function getReels(): Promise<Reel[]> {
  const rows = await getReelRows();
  const base =
    rows && rows.length > 0
      ? rows.map((r) => toReel(r.video_url, r.id))
      : fallbackReelUrls.map((url, i) => toReel(url, `reel-${i + 1}`));

  return Promise.all(
    base.map(async (reel) => {
      const oembed = await getTiktokOembed(reel.videoUrl);
      if (!oembed) return reel;
      return {
        ...reel,
        coverImage: oembed.thumbnailUrl,
        caption: oembed.title ? truncate(oembed.title, 90) : reel.caption,
      };
    })
  );
}
