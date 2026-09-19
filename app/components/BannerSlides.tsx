"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type BannerSlide = {
  src: string;
  // Qué franja de la foto se ve al recortarla (las fotos son verticales).
  objectPosition?: string;
};

// Fondo de fotos que se van cruzando (fundido + zoom lento). Va dentro de un
// contenedor con position relative y overflow hidden.
export default function BannerSlides({
  slides,
  intervalMs = 5000,
  sizes = "(min-width: 1280px) 1216px, 100vw",
}: {
  slides: BannerSlide[];
  intervalMs?: number;
  sizes?: string;
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
    <div aria-hidden="true" className="absolute inset-0">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          sizes={sizes}
          style={{ objectPosition: slide.objectPosition ?? "50% 50%" }}
          className={`object-cover [transition:opacity_1400ms_ease,scale_7000ms_ease-out] motion-reduce:scale-100 ${
            i === active ? "opacity-100 scale-[1.07]" : "opacity-0 scale-100"
          }`}
        />
      ))}
    </div>
  );
}
