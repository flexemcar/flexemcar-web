import { createClient } from "@/app/lib/supabase/server";
import type { Vehicle, VehiclePhoto, VehicleStatus } from "@/app/lib/vehicles";

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  price: number | null;
  cash_price: number | null;
  warranty_months: number;
  equipment: string[] | null;
  status: VehicleStatus;
  description: string | null;
  engine: string | null;
  power_cv: number | null;
  body_config: string | null;
  seats: number | null;
  eco_label: string | null;
  vehicle_type: string | null;
  vehicle_photos: { id: string; storage_path: string; position: number }[];
};

function mapVehicleRow(
  row: VehicleRow,
  getPublicUrl: (path: string) => string
): Vehicle {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    km: row.km,
    fuel: row.fuel,
    transmission: row.transmission,
    price: row.price !== null ? Number(row.price) : null,
    cashPrice: row.cash_price !== null ? Number(row.cash_price) : null,
    warrantyMonths: row.warranty_months,
    equipment: row.equipment ?? [],
    status: row.status,
    description: row.description,
    engine: row.engine,
    powerCv: row.power_cv,
    bodyConfig: row.body_config,
    seats: row.seats,
    ecoLabel: row.eco_label,
    vehicleType: row.vehicle_type,
    photos: mapPhotos(row.vehicle_photos, getPublicUrl),
  };
}

function mapPhotos(
  rows: VehicleRow["vehicle_photos"],
  getPublicUrl: (path: string) => string
): VehiclePhoto[] {
  return [...rows]
    .sort((a, b) => a.position - b.position)
    .map((p) => ({
      id: p.id,
      storagePath: p.storage_path,
      position: p.position,
      url: getPublicUrl(p.storage_path),
    }));
}

// Trae todos los vehiculos con sus fotos, ordenados por mas recientes.
// `includeSold` controla si se incluyen los ya vendidos (el admin los ve
// todos; la web publica solo disponibles/reservados).
// Si Supabase falla (mal configurado o caido) devuelve lista vacia en vez de
// tumbar la home publica: el admin sí necesita ver el error, ver getVehicleById.
export async function getVehicles({
  includeSold = true,
}: { includeSold?: boolean } = {}): Promise<Vehicle[]> {
  try {
    const supabase = await createClient();
    const getPublicUrl = (path: string) =>
      supabase.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;

    let query = supabase
      .from("vehicles")
      .select("*, vehicle_photos(id, storage_path, position)")
      .order("created_at", { ascending: false });

    if (!includeSold) {
      query = query.neq("status", "sold");
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data as VehicleRow[]).map((row) => mapVehicleRow(row, getPublicUrl));
  } catch (err) {
    console.error("getVehicles failed", err);
    return [];
  }
}

// Cuenta rapida sin traer fotos, para las estadisticas de la home.
export async function getVehicleCount({
  includeSold = false,
}: { includeSold?: boolean } = {}): Promise<number> {
  try {
    const supabase = await createClient();
    let query = supabase.from("vehicles").select("*", { count: "exact", head: true });
    if (!includeSold) {
      query = query.neq("status", "sold");
    }
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  } catch (err) {
    console.error("getVehicleCount failed", err);
    return 0;
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const getPublicUrl = (path: string) =>
    supabase.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;

  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_photos(id, storage_path, position)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapVehicleRow(data as VehicleRow, getPublicUrl);
}
