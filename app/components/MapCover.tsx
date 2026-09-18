"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Cubre el mapa de Google con una foto aérea de la campa. El iframe solo se
// monta al pulsar, así que no se descarga el mapa hasta que alguien lo pide.
export default function MapCover({ embedSrc }: { embedSrc: string }) {
  const [activated, setActivated] = useState(false);
  const [covered, setCovered] = useState(true);

  // Si el iframe tardara en avisar de que ha cargado, no dejamos la foto tapando el mapa.
  useEffect(() => {
    if (!activated) return;
    const id = setTimeout(() => setCovered(false), 3000);
    return () => clearTimeout(id);
  }, [activated]);

  return (
    <div className="relative mt-8 h-[360px] sm:h-[420px] overflow-hidden rounded-2xl border border-warm-200 bg-warm-100">
      {activated && (
        <iframe
          src={embedSrc}
          title="Ubicación de Flexemcar"
          className="absolute inset-0 h-full w-full"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setCovered(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setActivated(true)}
        disabled={activated}
        aria-label="Mostrar el mapa interactivo"
        aria-hidden={!covered}
        tabIndex={covered ? 0 : -1}
        className={`group absolute inset-0 cursor-pointer transition-[opacity,visibility] duration-500 ${
          covered ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <Image
          src="/brand/campa-flexemcar.jpg"
          alt="Vista aérea de la campa de Flexemcar en Elche"
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover object-[50%_46%]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-dark-1000/35" />

        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="relative flex size-20 items-center justify-center">
            {!activated && (
              <span className="absolute inline-flex size-full rounded-full bg-brand-orange/60 motion-safe:animate-ping" />
            )}
            <span className="relative flex size-20 items-center justify-center rounded-full bg-brand-orange shadow-[0_0_24px_rgba(245,130,31,0.55)] transition-transform duration-300 group-hover:scale-110">
              <TwoFingersIcon className="size-12" />
            </span>
          </span>
          <span className="rounded-full bg-dark-1000/70 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            {activated ? "Cargando mapa…" : "Toca para ver el mapa"}
          </span>
        </span>
      </button>
    </div>
  );
}

// Dos dedos pulsando: silueta de mano con dos dedos extendidos y ondas de toque.
function TwoFingersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g className="stroke-white" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M14 7A14 14 0 0 1 34 7" />
        <path d="M19 7A8 8 0 0 1 29 7" />
      </g>
      <g className="fill-white">
        <rect x="14" y="13" width="9" height="24" rx="4.5" />
        <rect x="24.4" y="11" width="9" height="26" rx="4.5" />
        <rect x="11" y="26" width="30" height="20" rx="9" />
      </g>
      <g className="fill-white stroke-brand-orange" strokeWidth="1.4" strokeLinejoin="round">
        <rect x="34" y="25" width="8" height="15" rx="4" />
        <rect x="5" y="29" width="9" height="14" rx="4.5" transform="rotate(-20 9.5 36)" />
      </g>
      <path d="M23.7 27V33" className="stroke-brand-orange" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
