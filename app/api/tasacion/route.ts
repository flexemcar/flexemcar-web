import { NextResponse } from "next/server";
import { links } from "@/app/lib/links";

// Envío del formulario "Pide tu tasación gratis" por correo con Resend
// (https://resend.com). Variables de entorno, ver .env.local.example:
//   RESEND_API_KEY  clave de Resend (solo permite enviar correos)
//   TASACION_TO     destinatario; por defecto el correo de la empresa
//   TASACION_FROM   remitente; por defecto el de pruebas de Resend hasta
//                   verificar el dominio de Flexemcar en Resend

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Flexemcar Web <onboarding@resend.dev>";

// Límite sencillo por IP. En Vercel cada instancia tiene su propia memoria,
// así que frena abusos básicos pero no es un límite estricto.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooManyRequests(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Solicitud no válida.");
  }

  // Campo trampa: las personas no lo ven; los bots lo rellenan. Se responde
  // que todo fue bien sin enviar nada.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 100);
  const phone = text(body.phone, 30);
  const email = text(body.email, 150);
  const vehicle = text(body.vehicle, 120);
  const year = text(body.year, 4);
  const km = text(body.km, 12).replace(/[.\s]/g, "");
  const comments = text(body.comments, 1500);
  const consent = body.consent === "on" || body.consent === true;

  if (!name || !phone || !email || !vehicle || !year || !km) {
    return fail("Rellena todos los campos obligatorios.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return fail("El correo electrónico no parece válido.");
  }
  if (!/^\+?[0-9 ().-]{9,20}$/.test(phone) || phone.replace(/\D/g, "").length < 9) {
    return fail("El teléfono no parece válido.");
  }
  const yearNumber = Number(year);
  if (!/^\d{4}$/.test(year) || yearNumber < 1970 || yearNumber > new Date().getFullYear() + 1) {
    return fail("El año no parece válido.");
  }
  if (!/^\d{1,7}$/.test(km)) {
    return fail("Los kilómetros deben ser un número.");
  }
  if (!consent) {
    return fail("Necesitamos que aceptes la política de privacidad para enviar la solicitud.");
  }

  // El límite solo cuenta solicitudes válidas: equivocarse al rellenar el
  // formulario no debe bloquear a nadie.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooManyRequests(ip)) {
    return fail("Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos.", 429);
  }

  const message = [
    "Nueva solicitud de tasación desde la web",
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Correo: ${email}`,
    `Vehículo: ${vehicle}`,
    `Año: ${year}`,
    `Kilómetros: ${Number(km).toLocaleString("es-ES")} km`,
    `Comentarios: ${comments || "(sin comentarios)"}`,
    "",
    "El cliente ha aceptado la política de privacidad al enviar el formulario.",
    "Puedes responder a este correo: la respuesta va directa al cliente.",
  ].join("\n");

  const subject = `Tasación: ${vehicle} (${year}) - ${name}`.replace(/[\r\n]+/g, " ");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      // En desarrollo sin clave: se muestra el correo en la terminal.
      console.log(`\n[tasacion] RESEND_API_KEY sin configurar. Correo simulado:\nAsunto: ${subject}\n${message}\n`);
      return NextResponse.json({ ok: true, simulated: true });
    }
    console.error("[tasacion] Falta RESEND_API_KEY en el entorno.");
    return fail("Ahora mismo no podemos recibir solicitudes por aquí. Escríbenos por WhatsApp o llámanos.", 503);
  }

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.TASACION_FROM || DEFAULT_FROM,
        to: [process.env.TASACION_TO || links.email],
        reply_to: email,
        subject,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error("[tasacion] Resend respondió", response.status, await response.text());
      return fail("No hemos podido enviar tu solicitud. Escríbenos por WhatsApp o llámanos.", 502);
    }
  } catch (error) {
    console.error("[tasacion] Error al llamar a Resend:", error);
    return fail("No hemos podido enviar tu solicitud. Escríbenos por WhatsApp o llámanos.", 502);
  }

  return NextResponse.json({ ok: true });
}
