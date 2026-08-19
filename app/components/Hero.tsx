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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
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
            className="rounded-full bg-brand-orange px-8 py-[15px] font-bold text-[17px] text-white shadow-[0_0_20px_rgba(245,130,31,0.4)] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_0_30px_rgba(245,130,31,0.6)]"
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
          className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-warm-50 pl-4 pr-5 py-3 shadow-lg hover:brightness-95 transition"
        >
          <svg viewBox="0 0 48 48" className="size-7 shrink-0" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
            />
            <path
              fill="#34A853"
              d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
            />
            <path
              fill="#FBBC05"
              d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
            />
            <path
              fill="#EA4335"
              d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
            />
          </svg>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg text-brand-ink">
                4,8
              </span>
              <span className="flex text-amber-400 text-sm" aria-hidden="true">
                {"★★★★★"}
              </span>
            </div>
            <p className="text-xs text-brand-ink/60">
              Valoraciones de clientes en Google
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
