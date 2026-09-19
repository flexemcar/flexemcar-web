"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  cookieConsentKey,
  metaPixelId,
  openCookieSettingsEvent,
} from "@/app/lib/tracking";

type Choice = "accepted" | "rejected";

// Elección guardada en el navegador; si no hay almacenamiento, solo en memoria.
let memoryChoice: Choice | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Choice | null {
  try {
    const v = window.localStorage.getItem(cookieConsentKey);
    if (v === "accepted" || v === "rejected") return v;
  } catch {
    // Sin acceso al almacenamiento.
  }
  return memoryChoice;
}

// En el servidor todavía no se sabe qué eligió el visitante: no se pinta nada.
function getServerSnapshot(): Choice | null | "unknown" {
  return "unknown";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function saveChoice(value: Choice) {
  memoryChoice = value;
  try {
    window.localStorage.setItem(cookieConsentKey, value);
  } catch {
    // Sin almacenamiento: la elección solo dura esta visita.
  }
  listeners.forEach((l) => l());
}

export default function CookieConsent() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(openCookieSettingsEvent, reopen);
    return () => window.removeEventListener(openCookieSettingsEvent, reopen);
  }, []);

  function decide(value: Choice) {
    saveChoice(value);
    setReopened(false);
  }

  const open = choice !== "unknown" && (choice === null || reopened);

  // Ni aviso ni píxel en el panel de administración.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <>
      {/* El píxel solo se carga si el visitante lo ha aceptado. */}
      {choice === "accepted" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Aviso de cookies"
          className="fixed z-50 bottom-4 left-4 right-4 sm:right-auto sm:max-w-md rounded-2xl bg-dark-950 border border-warm-50/15 p-5 shadow-2xl"
        >
          <p className="text-sm text-warm-50/80 leading-relaxed">
            Usamos cookies de Meta (Facebook e Instagram) para medir el
            resultado de nuestros anuncios. Solo se activan si las aceptas.{" "}
            <Link
              href="/cookies"
              className="text-brand-orange underline underline-offset-2"
            >
              Más información
            </Link>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => decide("rejected")}
              className="rounded-full border border-warm-50/30 px-4 py-2 text-sm font-bold text-warm-50 hover:border-warm-50/60 transition"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:brightness-110 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
