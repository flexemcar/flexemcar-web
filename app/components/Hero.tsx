"use client";

import { useEffect, useState } from "react";
import { links } from "@/app/lib/links";

// Placeholder de fondo: sustituir por fotos reales (mismo array, una entrada por imagen).
const slides = [
  "from-dark-950 via-dark-900 to-brand-ink",
  "from-dark-1000 via-dark-900 to-brand-ink",
  "from-brand-ink via-dark-950 to-dark-900",
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-dark-950">
      <div className="absolute inset-0">
        {slides.map((gradient, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-dark-1000/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-16 sm:pt-8 sm:pb-24">
        <div className="flex justify-end mb-8 sm:mb-12">
          <a
            href={`mailto:${links.email}`}
            className="text-xs sm:text-sm text-warm-100/80 hover:text-brand-orange transition-colors"
          >
            {links.email}
          </a>
        </div>

        <h1 className="font-heading uppercase font-extrabold text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl tracking-tight max-w-3xl">
          <span className="text-warm-50">Las mejores furgonetas</span>{" "}
          <span className="text-brand-orange">al mejor precio</span>
        </h1>

        <p className="mt-6 max-w-lg text-warm-100/90 text-base sm:text-lg">
          Vehículos industriales revisados, garantizados y listos para
          trabajar desde el primer día. Encuentra tu furgoneta o camión en
          Flexemcar.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#stock"
            className="rounded-full bg-brand-orange px-8 py-[15px] font-bold text-[17px] text-white hover:brightness-110 transition"
          >
            Ver stock disponible
          </a>
          <a
            href="#vende-tu-furgoneta"
            className="rounded-full border border-warm-100/40 px-8 py-[15px] font-bold text-[17px] text-warm-50 hover:border-brand-orange hover:text-brand-orange transition"
          >
            Vendemos tu furgoneta
          </a>
        </div>

        <a
          href={links.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-warm-50/10 px-4 py-2 text-warm-50 hover:bg-warm-50/20 transition"
        >
          <span className="flex text-brand-orange" aria-hidden="true">
            {"★★★★★"}
          </span>
          <span className="text-sm font-semibold">
            4,8 valoraciones de clientes en Google
          </span>
        </a>
      </div>
    </section>
  );
}
