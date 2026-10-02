// Alta de un vehiculo desde el ordenador (sin pasar por el panel).
// Uso: node --env-file=.env.local scripts/alta-vehiculo.mjs ruta/ficha.json [--dry-run]
// ficha.json: { "vehicle": { columnas de public.vehicles }, "photos": ["ruta1.jpg", ...] }
// Las fotos se suben en ese orden (la primera es la portada), reducidas a
// 1600 px y JPEG 80 %, igual que hace el panel. Necesita SUPABASE_SERVICE_ROLE_KEY.
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const [file, flag] = process.argv.slice(2);
const dryRun = flag === "--dry-run";
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!file || !URL_ || !KEY) throw new Error("Falta la ficha o las variables de entorno.");

const spec = JSON.parse(readFileSync(file, "utf8"));
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function rest(path, init = {}) {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation", ...init.headers },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

const photos = [];
for (const p of spec.photos) {
  const buf = await sharp(readFileSync(p)).rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  photos.push({ src: p, buf });
}
console.log(`${spec.vehicle.brand} ${spec.vehicle.model}: ${photos.length} fotos, ` +
  `${(photos.reduce((s, f) => s + f.buf.length, 0) / 1048576).toFixed(1)} MB tras reducir`);
if (dryRun) { console.log(JSON.stringify(spec.vehicle, null, 2)); process.exit(0); }

const [vehicle] = await rest("vehicles", { method: "POST", body: JSON.stringify(spec.vehicle) });
const uploaded = [];
try {
  for (const [position, photo] of photos.entries()) {
    const path = `${vehicle.id}/${randomUUID()}.jpg`;
    const res = await fetch(`${URL_}/storage/v1/object/vehicle-photos/${path}`, {
      method: "POST", headers: { ...headers, "Content-Type": "image/jpeg" }, body: photo.buf,
    });
    if (!res.ok) throw new Error(`Subida ${photo.src}: ${res.status} ${await res.text()}`);
    uploaded.push(path);
    await rest("vehicle_photos", {
      method: "POST",
      body: JSON.stringify({ vehicle_id: vehicle.id, storage_path: path, position }),
    });
  }
} catch (err) {
  console.error("Fallo, deshaciendo el alta:", err.message);
  if (uploaded.length) {
    await fetch(`${URL_}/storage/v1/object/vehicle-photos`, {
      method: "DELETE", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: uploaded }),
    });
  }
  await rest(`vehicles?id=eq.${vehicle.id}`, { method: "DELETE" });
  process.exit(1);
}
console.log(`Creado ${vehicle.id} con ${uploaded.length} fotos.`);
