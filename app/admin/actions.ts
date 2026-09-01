"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import type { VehicleStatus } from "@/app/lib/vehicles";

const BUCKET = "vehicle-photos";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function readVehicleFields(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();
  const cashPriceRaw = String(formData.get("cash_price") ?? "").trim();
  if (!priceRaw && !cashPriceRaw) {
    throw new Error("Indica al menos un precio (financiado o al contado).");
  }

  const powerCvRaw = String(formData.get("power_cv") ?? "").trim();
  const seatsRaw = String(formData.get("seats") ?? "").trim();

  return {
    brand: String(formData.get("brand") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    year: Number(formData.get("year")),
    km: Number(formData.get("km")),
    fuel: String(formData.get("fuel") ?? "").trim(),
    transmission: String(formData.get("transmission") ?? "").trim(),
    price: priceRaw ? Number(priceRaw) : null,
    cash_price: cashPriceRaw ? Number(cashPriceRaw) : null,
    warranty_months: Number(formData.get("warranty_months") ?? 12),
    equipment: formData.getAll("equipment").map(String),
    status: String(formData.get("status") ?? "available") as VehicleStatus,
    description: (formData.get("description") as string | null)?.trim() || null,
    engine: (formData.get("engine") as string | null)?.trim() || null,
    power_cv: powerCvRaw ? Number(powerCvRaw) : null,
    body_config: (formData.get("body_config") as string | null)?.trim() || null,
    seats: seatsRaw ? Number(seatsRaw) : null,
    eco_label: (formData.get("eco_label") as string | null)?.trim() || null,
  };
}

async function uploadPhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  vehicleId: string,
  files: File[],
  startPosition: number
) {
  let position = startPosition;
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${vehicleId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || undefined });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("vehicle_photos").insert({
      vehicle_id: vehicleId,
      storage_path: path,
      position,
    });
    if (insertError) throw insertError;

    position += 1;
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const fields = readVehicleFields(formData);

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .insert(fields)
    .select("id")
    .single();
  if (error) throw error;

  const files = formData.getAll("photos") as File[];
  await uploadPhotos(supabase, vehicle.id, files, 0);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateVehicleAction(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const fields = readVehicleFields(formData);

  const { error } = await supabase.from("vehicles").update(fields).eq("id", id);
  if (error) throw error;

  const files = (formData.getAll("photos") as File[]).filter((f) => f.size > 0);
  if (files.length > 0) {
    const { data: existing, error: existingError } = await supabase
      .from("vehicle_photos")
      .select("position")
      .eq("vehicle_id", id)
      .order("position", { ascending: false })
      .limit(1);
    if (existingError) throw existingError;

    const nextPosition = existing.length > 0 ? existing[0].position + 1 : 0;
    await uploadPhotos(supabase, id, files, nextPosition);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/vehicles/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteVehicleAction(id: string) {
  const supabase = await requireAdmin();

  const { data: photos, error: photosError } = await supabase
    .from("vehicle_photos")
    .select("storage_path")
    .eq("vehicle_id", id);
  if (photosError) throw photosError;

  if (photos.length > 0) {
    await supabase.storage
      .from(BUCKET)
      .remove(photos.map((p) => p.storage_path));
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePhotoAction(
  photoId: string,
  storagePath: string,
  vehicleId: string
) {
  const supabase = await requireAdmin();

  await supabase.storage.from(BUCKET).remove([storagePath]);
  const { error } = await supabase.from("vehicle_photos").delete().eq("id", photoId);
  if (error) throw error;

  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePath("/");
}

export async function reorderPhotosAction(
  vehicleId: string,
  orderedPhotoIds: string[]
) {
  const supabase = await requireAdmin();

  await Promise.all(
    orderedPhotoIds.map((photoId, position) =>
      supabase.from("vehicle_photos").update({ position }).eq("id", photoId)
    )
  );

  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePath("/");
}
