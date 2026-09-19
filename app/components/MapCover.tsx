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
              <TapIcon className="size-16" />
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

// Dedo pulsando: contorno de mano con el índice extendido y dos ondas de toque.
function TapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 -8 24 32"
      className={className}
      fill="none"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 -3A8.5 8.5 0 0 1 15 -3" opacity="0.55" />
      <path d="M4.3 -0.6A4.5 4.5 0 0 1 11.7 -0.6" />
      <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}
