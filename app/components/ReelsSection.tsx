"use client";

import { useRef, useState } from "react";
import { reels } from "@/app/data/reels";
import Reveal from "@/app/components/Reveal";

const CARD_WIDTH = 220;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;

function PlatformIcon({ platform }: { platform: "instagram" | "tiktok" }) {
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2h-3.2v13.4a2.6 2.6 0 1 1-2.2-2.57v-3.25a5.85 5.85 0 1 0 5.4 5.83V8.9a7.1 7.1 0 0 0 4.4 1.5V7.2a3.9 3.9 0 0 1-4.4-3.9V2Z" />
    </svg>
  );
}

export default function ReelsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollToIndex(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, reels.length - 1));
    el.scrollTo({ left: clamped * STEP, behavior: "smooth" });
    setActive(clamped);
  }

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / STEP));
  }

  return (
    <section id="dia-a-dia" className="bg-dark-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 className="font-heading uppercase font-extrabold text-3xl sm:text-4xl text-warm-50 text-center">
            Nuestro día a día a tu lado
          </h2>
        </Reveal>

        <div className="mt-10 relative">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {reels.map((reel) => {
              const CardInner = (
                <>
                  {reel.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={reel.coverImage}
                      alt={reel.caption}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-ink via-dark-900 to-brand-orange/40" />
                  )}
                  <div className="absolute inset-0 bg-dark-1000/20" />
                  <div className="absolute top-3 left-3 flex items-center justify-center size-8 rounded-full bg-dark-1000/60 text-warm-50">
                    <PlatformIcon platform={reel.platform} />
                  </div>
                  <p className="absolute bottom-3 left-3 right-3 text-warm-50 text-sm font-semibold">
                    {reel.caption}
                  </p>
                </>
              );

              return (
                <div
                  key={reel.id}
                  style={{ width: CARD_WIDTH }}
                  className="relative shrink-0 snap-start aspect-[9/16] rounded-2xl overflow-hidden"
                >
                  {reel.videoUrl === "#" ? (
                    <div className="relative h-full w-full">{CardInner}</div>
                  ) : (
                    <a
                      href={reel.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-full w-full"
                    >
                      {CardInner}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(active - 1)}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 items-center justify-center size-11 rounded-full bg-warm-50 text-brand-ink shadow-lg hover:bg-brand-orange hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            aria-label="Siguiente"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 items-center justify-center size-11 rounded-full bg-warm-50 text-brand-ink shadow-lg hover:bg-brand-orange hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reels.map((reel, i) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir al vídeo ${i + 1}`}
              className={`size-2 rounded-full transition-colors ${
                i === active ? "bg-brand-orange" : "bg-warm-50/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
