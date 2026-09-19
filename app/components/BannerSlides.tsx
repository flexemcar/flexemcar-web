"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type BannerSlide = {
  src: string;
  // Solo para móvil, donde la foto se recorta: qué franja se ve.
  objectPosition?: string;
};

// Fotos que se van cruzando (fundido + zoom lento). Va dentro de un contenedor
// con position relative.
// - Escritorio: la foto se ve ENTERA y centrada, sobre un fondo de la misma foto
//   desenfocado y teñido de naranja, para que el vehículo no salga cortado.
// - Móvil: la foto va recortada a todo el ancho del bloque.
export default function BannerSlides({
  slides,
  intervalMs = 5000,
}: {
  slides: BannerSlide[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 [transition:opacity_1400ms_ease] ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="320px"
            className="hidden sm:block scale-125 object-cover blur-2xl"
          />
          <div className="hidden sm:block absolute inset-0 bg-brand-orange/55" />
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="(min-width: 640px) 480px, 100vw"
            style={{ objectPosition: slide.objectPosition ?? "50% 50%" }}
            className={`object-cover sm:object-contain [transition:scale_7000ms_ease-out] motion-reduce:scale-100 ${
              i === active ? "scale-[1.05]" : "scale-100"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
