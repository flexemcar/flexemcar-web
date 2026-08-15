"use client";

import { useRef, useState } from "react";
import { reels } from "@/app/data/reels";

const CARD_WIDTH = 220;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;

function PlatformIcon({ platform }: { platform: "instagram" | "tiktok" }) {
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.1.26 2.6.46.6.24 1.1.55 1.6 1.04.5.5.8.98 1.04 1.6.2.5.4 1.4.46 2.6.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 2.1-.46 2.6a4.4 4.4 0 0 1-1.04 1.6 4.4 4.4 0 0 1-1.6 1.04c-.5.2-1.4.4-2.6.46-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2.1-.26-2.6-.46a4.4 4.4 0 0 1-1.6-1.04 4.4 4.4 0 0 1-1.04-1.6c-.2-.5-.4-1.4-.46-2.6C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-2.1.46-2.6.24-.6.55-1.1 1.04-1.6.5-.5.98-.8 1.6-1.04.5-.2 1.4-.4 2.6-.46C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5 0-4.75.07-1 .05-1.55.22-1.9.36-.48.19-.83.4-1.2.77-.36.36-.58.71-.77 1.19-.15.36-.32.9-.36 1.9C3 9.5 3 9.86 3 13s0 3.5.07 4.75c.05 1 .22 1.55.36 1.9.19.48.4.83.77 1.2.36.36.71.58 1.19.77.36.15.9.32 1.9.36 1.25.06 1.61.07 4.75.07s3.5 0 4.75-.07c1-.05 1.55-.22 1.9-.36.48-.19.83-.4 1.2-.77.36-.36.58-.71.77-1.19.15-.36.32-.9.36-1.9.06-1.25.07-1.61.07-4.75s0-3.5-.07-4.75c-.05-1-.22-1.55-.36-1.9a3.2 3.2 0 0 0-.77-1.2 3.2 3.2 0 0 0-1.19-.77c-.36-.15-.9-.32-1.9-.36C15.5 4 15.14 4 12 4Zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm4.7-2a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
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
        <h2 className="font-heading uppercase font-extrabold text-3xl sm:text-4xl text-warm-50 text-center">
          Nuestro día a día a tu lado
        </h2>

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
