// Comprime una foto en el navegador antes de subirla. Vercel corta cualquier
// envio de mas de ~4,5 MB (413 FUNCTION_PAYLOAD_TOO_LARGE) y las fotos viajan
// dentro del formulario del panel, asi que una foto de movil sin comprimir
// (3-8 MB) bastaria para que fallase el guardado.
// Si el navegador no puede leer la imagen (p. ej. HEIC en Chrome de escritorio)
// se devuelve el archivo original tal cual.
export const MAX_PHOTOS_BYTES = 4 * 1024 * 1024;

export async function compressImage(
  file: File,
  maxSide = 1600,
  quality = 0.8
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // fondo blanco por si es un PNG con transparencia
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

export function formatMb(bytes: number) {
  return (bytes / 1024 / 1024).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + " MB";
}
