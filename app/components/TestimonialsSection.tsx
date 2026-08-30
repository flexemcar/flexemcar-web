"use client";

import { useState } from "react";
import { testimonials } from "@/app/data/testimonials";
import { links } from "@/app/lib/links";
import Reveal from "@/app/components/Reveal";
import { useClickSound } from "@/app/lib/useClickSound";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];
  const playClick = useClickSound("/sounds/nav-blip.wav");

  function goTo(index: number) {
    const wrapped = ((index % testimonials.length) + testimonials.length) % testimonials.length;
    playClick();
    setActive(wrapped);
  }

  return (
    <section id="opiniones" className="bg-dark-950 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Tu opinión, lo único que nos falta
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-warm-50">
            Opiniones reales
          </h2>
        </Reveal>

        <a
          href={links.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-warm-50/80 hover:text-brand-orange transition"
        >
          <span className="flex text-brand-orange" aria-hidden="true">
            {"★★★★★"}
          </span>
          <span className="text-sm font-semibold">
            4,8 sobre 5 · Reseñas de Google
          </span>
        </a>

        <div className="mt-10 rounded-2xl bg-warm-50/5 border border-warm-50/10 px-6 sm:px-10 py-10">
          <p className="text-lg text-warm-50/90 italic">"{current.quote}"</p>
          <p className="mt-6 font-heading uppercase font-extrabold text-warm-50">
            {current.name}
          </p>
          <p className="text-sm text-warm-50/60">{current.city}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Opinión anterior"
            className="flex items-center justify-center size-12 rounded-full bg-brand-orange text-white shadow-lg hover:brightness-110 transition"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver opinión de ${t.name}`}
                className={`size-2 rounded-full transition-colors ${
                  i === active ? "bg-brand-orange" : "bg-warm-50/30"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Opinión siguiente"
            className="flex items-center justify-center size-12 rounded-full bg-brand-orange text-white shadow-lg hover:brightness-110 transition"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
