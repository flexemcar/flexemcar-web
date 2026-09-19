"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { links } from "@/app/lib/links";

// Fotos reales de la campa (public/hero). Para cambiarlas o añadir más, editar
// este array: "objectPosition" decide qué franja de la foto se ve al recortarla.
const slides = [
  { src: "/hero/hero-1.jpg", objectPosition: "50% 62%" },
  { src: "/hero/hero-2.jpg", objectPosition: "50% 50%" },
  { src: "/hero/hero-3.jpg", objectPosition: "50% 58%" },
  { src: "/hero/hero-4.jpg", objectPosition: "50% 55%" },
  { src: "/hero/hero-5.jpg", objectPosition: "50% 62%" },
];

const SLIDE_MS = 5000;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-dark-950">
      <div className="absolute inset-0">
        {/* En pantallas grandes las fotos ocupan la derecha y se funden con el fondo oscuro. */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[66%] lg:[mask-image:linear-gradient(to_right,transparent,black_40%)]">
          {slides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              quality={80}
              sizes="(min-width: 1024px) 66vw, 100vw"
              aria-hidden="true"
              style={{ objectPosition: slide.objectPosition }}
              className={`object-cover [transition:opacity_1400ms_ease,scale_7000ms_ease-out] motion-reduce:scale-100 ${
                i === active ? "opacity-100 scale-[1.07]" : "opacity-0 scale-100"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-1000/40 via-dark-1000/55 to-dark-1000/80 lg:bg-gradient-to-r lg:from-dark-1000/90 lg:via-dark-1000/40 lg:to-dark-1000/10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(55%_70%_at_88%_15%,rgba(245,130,31,0.18),transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(245,130,31,0.10),transparent_70%)]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-16 sm:pt-28 sm:pb-28">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-orange">
          <span className="size-2 rounded-full bg-brand-orange" aria-hidden="true" />
          Furgonetas de ocasión en Elche
        </p>

        <h1 className="font-heading uppercase font-extrabold text-[20vw] leading-[0.92] tracking-tight sm:text-[clamp(3rem,9.5vw,8.5rem)] sm:whitespace-nowrap [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          <span className="block sm:inline text-warm-50">Mucho más</span>{" "}
          <span className="block sm:inline text-brand-orange">que furgos</span>
        </h1>

        <p className="mt-7 max-w-2xl text-warm-100/90 text-lg sm:text-xl leading-relaxed [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
          Te ayudamos a encontrar la furgoneta que encaja contigo, tu trabajo
          y tu presupuesto. Revisadas, garantizadas y listas para empezar.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#stock"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand-orange px-9 py-[18px] font-bold text-lg text-white shadow-[0_0_20px_rgba(245,130,31,0.4)] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_0_30px_rgba(245,130,31,0.6)]"
          >
            Ver stock disponible
            <svg
              viewBox="0 0 24 24"
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="#vende-tu-furgoneta"
            className="rounded-full border border-warm-100/40 px-9 py-[18px] font-bold text-lg text-warm-50 hover:border-brand-orange hover:text-brand-orange transition"
          >
            Vendemos tu furgoneta
          </a>
        </div>

        <a
          href={links.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-3 rounded-2xl bg-warm-50 pl-4 pr-5 py-3 shadow-lg hover:brightness-95 transition"
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
