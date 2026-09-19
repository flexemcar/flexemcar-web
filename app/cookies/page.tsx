import type { Metadata } from "next";
import Link from "next/link";
import CookieSettingsLink from "@/app/components/CookieSettingsLink";
import LegalLayout, { A, H2, P, UL } from "@/app/components/LegalLayout";
import { legal, metaLinks } from "@/app/lib/legal";

export const metadata: Metadata = {
  title: "Política de cookies | Flexemcar",
  description:
    "Qué cookies usa la web de Flexemcar, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu elección.",
};

type CookieInfo = {
  name: string;
  purpose: string;
  type: string;
  provider: string;
  duration: string;
};

const cookies: CookieInfo[] = [
  {
    name: "flexemcar-cookies",
    purpose:
      "Guarda si has aceptado o rechazado las cookies de publicidad. Se guarda en el almacenamiento local de tu navegador.",
    type: "Técnica (necesaria)",
    provider: "Flexemcar",
    duration: "Hasta que la borres",
  },
  {
    name: "_fbp",
    purpose:
      "Identifica tu navegador para medir el resultado de los anuncios de Facebook e Instagram y mostrártelos.",
    type: "Publicidad y medición (requiere consentimiento)",
    provider: "Meta Platforms Ireland Limited",
    duration: "3 meses",
  },
  {
    name: "_fbc",
    purpose:
      "Guarda el anuncio de Meta en el que pulsaste antes de llegar a la web. Solo aparece si vienes desde un anuncio.",
    type: "Publicidad y medición (requiere consentimiento)",
    provider: "Meta Platforms Ireland Limited",
    duration: "3 meses",
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies" updated={legal.updated}>
      <P>
        Las cookies son pequeños archivos que una web guarda en tu dispositivo.
        Sirven para recordar preferencias o para medir y personalizar la
        publicidad. Esta política cumple el artículo 22.2 de la Ley 34/2002
        (LSSI) y el RGPD. El responsable es {legal.tradeName}; sus datos
        completos están en la{" "}
        <Link
          href="/privacidad"
          className="text-brand-orange underline underline-offset-2 hover:brightness-125"
        >
          política de privacidad
        </Link>
        .
      </P>

      <H2>Cómo funciona nuestro aviso</H2>
      <P>
        Al entrar por primera vez te preguntamos si aceptas las cookies de
        publicidad de Meta. Hasta que aceptes, no se carga ninguna herramienta
        de Meta ni se guarda ninguna de sus cookies. Rechazar tiene el mismo
        peso que aceptar y no limita el uso de la web.
      </P>

      <H2>Cookies que usamos</H2>
      <div className="mt-4 space-y-3">
        {cookies.map((c) => (
          <div
            key={c.name}
            className="rounded-xl bg-warm-50/5 border border-warm-50/10 p-4"
          >
            <p className="font-mono text-sm font-bold text-brand-orange break-all">
              {c.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-warm-50/80">
              {c.purpose}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-warm-50/60">
              <dt className="font-semibold">Tipo</dt>
              <dd>{c.type}</dd>
              <dt className="font-semibold">Proveedor</dt>
              <dd>{c.provider}</dd>
              <dt className="font-semibold">Duración</dt>
              <dd>{c.duration}</dd>
            </dl>
          </div>
        ))}
      </div>
      <P>
        Si tienes la sesión abierta en Facebook o Instagram, Meta puede además
        leer sus propias cookies en tu navegador. Se rigen por su{" "}
        <A href={metaLinks.cookies}>política de cookies</A>.
      </P>

      <H2>Servicios de terceros al pulsar</H2>
      <UL>
        <li>
          <strong className="text-warm-50">Mapa de Google:</strong> no se carga
          hasta que pulsas sobre él. Entonces Google puede guardar sus propias
          cookies, según su{" "}
          <A href="https://policies.google.com/technologies/cookies">
            política de cookies
          </A>
          .
        </li>
        <li>
          <strong className="text-warm-50">Enlaces a redes sociales y WhatsApp:</strong>{" "}
          al pulsarlos sales de nuestra web y se aplican las cookies y
          condiciones de cada servicio.
        </li>
      </UL>

      <H2>Cambiar o retirar tu elección</H2>
      <P>
        Puedes cambiar tu decisión en cualquier momento. Tan fácil como
        aceptar:
      </P>
      <div className="mt-4">
        <CookieSettingsLink className="rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white hover:brightness-110 transition">
          Configurar cookies
        </CookieSettingsLink>
      </div>
      <P>
        También puedes borrar o bloquear cookies desde los ajustes de tu
        navegador. Si borras los datos del sitio, te volveremos a preguntar. Para
        gestionar los anuncios que ves en Facebook e Instagram, usa las{" "}
        <A href={metaLinks.adPreferences}>preferencias de anuncios de Meta</A>.
      </P>

      <H2>Cambios en esta política</H2>
      <P>
        Actualizaremos esta página si cambian las cookies que usamos. La fecha
        de arriba indica la última revisión.
      </P>
    </LegalLayout>
  );
}
