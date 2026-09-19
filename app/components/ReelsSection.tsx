"use client";

import { useRef, useState } from "react";
import type { Reel } from "@/app/data/reels";
import Reveal from "@/app/components/Reveal";
import { useClickSound } from "@/app/lib/useClickSound";

const CARD_WIDTH = 260;

// El reproductor de TikTok no es responsive: siempre renderiza a este tamaño
// fijo internamente. Si se le fuerza a un hueco más pequeño, su contenido se
// corta y se descoloca. La forma correcta de encajarlo es dejar que ocupe su
// tamaño real y luego encogerlo entero con una transformación visual.
const TIKTOK_EMBED_WIDTH = 325;
const TIKTOK_EMBED_HEIGHT = 768;
const EMBED_SCALE = CARD_WIDTH / TIKTOK_EMBED_WIDTH;

// Tamaño normal de la tarjeta (miniatura, proporción real 9:16). Solo la
// tarjeta activa crece a la proporción del reproductor de TikTok mientras
// se está reproduciendo, y vuelve a este tamaño al cerrar.
const CARD_HEIGHT_IDLE = Math.round((CARD_WIDTH * 16) / 9);
const CARD_HEIGHT_PLAYING = Math.round(TIKTOK_EMBED_HEIGHT * EMBED_SCALE);

// Ruleta: la tarjeta activa va en el centro y las de los lados se van
// haciendo más pequeñas y tenues. Al ser circular, tras el último vídeo
// vuelve el primero, así que siempre hay vídeos a ambos lados.
const SCALES = [1, 0.82, 0.68, 0.56];
const OPACITIES = [1, 0.5, 0.22, 0.08];
const MAX_DEPTH = SCALES.length - 1;
const SIDE_GAP = 16;
const SWIPE_MIN_PX = 50;

// Distancia horizontal al centro (px) para cada nivel de profundidad.
const X_POSITIONS = SCALES.reduce<number[]>((acc, scale, d) => {
  if (d === 0) return [0];
  const gap = (CARD_WIDTH * SCALES[d - 1]) / 2 + (CARD_WIDTH * scale) / 2 + SIDE_GAP;
  return [...acc, acc[d - 1] + gap];
}, []);

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

export default function ReelsSection({ reels }: { reels: Reel[] }) {
  const n = reels.length;
  const [active, setActive] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const playClick = useClickSound("/sounds/nav-blip.wav");
  const dragStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  if (n === 0) return null;

  function goTo(index: number) {
    setActive(((index % n) + n) % n);
    setPlayingId(null);
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    swiped.current = false;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX) {
      swiped.current = true;
      goTo(active + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <section id="dia-a-dia" className="bg-dark-950 py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="px-4 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-warm-50 text-center">
            Nuestro día a día a tu lado
          </h2>
        </Reveal>

        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Vídeos de Flexemcar"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
          style={{ height: playingId ? CARD_HEIGHT_PLAYING : CARD_HEIGHT_IDLE }}
          className="relative mt-10 touch-pan-y select-none transition-[height] duration-500"
        >
          {reels.map((reel, i) => {
            let offset = (((i - active) % n) + n) % n;
            if (offset > n / 2) offset -= n;
            const distance = Math.abs(offset);
            const visible = distance <= MAX_DEPTH;
            const depth = Math.min(distance, MAX_DEPTH);
            const x = Math.sign(offset) * X_POSITIONS[depth];
            const isActive = distance === 0;
            const isPlaying = isActive && playingId === reel.id;

            return (
              <div
                key={reel.id}
                aria-hidden={!visible}
                style={{
                  width: CARD_WIDTH,
                  height: isPlaying ? CARD_HEIGHT_PLAYING : CARD_HEIGHT_IDLE,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translateX(${x}px) scale(${SCALES[depth]})`,
                  opacity: visible ? OPACITIES[depth] : 0,
                  zIndex: 10 - depth,
                  pointerEvents: visible ? "auto" : "none",
                }}
                className="absolute rounded-2xl overflow-hidden bg-dark-1000 transition-[transform,opacity,height] duration-500 ease-out"
              >
                {isPlaying && reel.tiktokId ? (
                  <>
                    <div
                      style={{
                        width: TIKTOK_EMBED_WIDTH,
                        height: TIKTOK_EMBED_HEIGHT,
                        transform: `scale(${EMBED_SCALE})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${reel.tiktokId}`}
                        width={TIKTOK_EMBED_WIDTH}
                        height={TIKTOK_EMBED_HEIGHT}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        title={reel.caption}
                        className="border-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayingId(null)}
                      aria-label="Cerrar vídeo"
                      className="absolute top-3 right-3 flex items-center justify-center size-8 rounded-full bg-dark-1000/70 text-warm-50 hover:bg-brand-orange transition"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    tabIndex={visible ? 0 : -1}
                    onClick={() => {
                      if (swiped.current) {
                        swiped.current = false;
                        return;
                      }
                      if (isActive) {
                        if (reel.tiktokId) setPlayingId(reel.id);
                      } else {
                        playClick();
                        goTo(i);
                      }
                    }}
                    aria-label={isActive ? `Reproducir vídeo: ${reel.caption}` : `Ver vídeo ${i + 1}`}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    {reel.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={reel.coverImage}
                        alt={reel.caption}
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-ink via-dark-900 to-brand-orange/40" />
                    )}
                    <div className="absolute top-3 left-3 flex items-center justify-center size-8 rounded-full bg-dark-1000/60 text-warm-50">
                      <PlatformIcon platform={reel.platform} />
                    </div>
                    {reel.tiktokId && (
                      <span
                        className={`relative flex items-center justify-center size-14 rounded-full bg-warm-50/90 text-brand-ink shadow-lg transition ${
                          isActive ? "group-hover:bg-brand-orange group-hover:text-white group-hover:scale-105" : ""
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="size-6 translate-x-0.5" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => {
              playClick();
              goTo(active - 1);
            }}
            aria-label="Anterior"
            className="flex items-center justify-center size-12 rounded-full bg-brand-orange text-white shadow-lg hover:brightness-110 transition"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {reels.map((reel, i) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al vídeo ${i + 1}`}
                className={`size-2 rounded-full transition-colors ${
                  i === active ? "bg-brand-orange" : "bg-warm-50/30"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              goTo(active + 1);
            }}
            aria-label="Siguiente"
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
