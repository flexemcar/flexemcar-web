"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { relativeMonthsEs } from "@/app/lib/relativeTime";
import { useClickSound } from "@/app/lib/useClickSound";
import GoogleReviewIcon from "@/app/components/GoogleReviewIcon";

export type ReviewCardData = {
  id: string;
  name: string;
  text: string;
  rating: number;
  isGoogle: boolean;
  photoUrl?: string | null;
  profileUrl?: string | null;
  relativeTime?: string;
  // Mes aproximado (AAAA-MM): la etiqueta "hace X meses" se calcula al mostrarla.
  date?: string;
  avatarColor?: string;
  city?: string;
};

const DAY_MS = 86_400_000;
const subscribeNever = () => () => {};
const currentDay = () => Math.floor(Date.now() / DAY_MS);
const serverDay = () => Math.floor(Date.UTC(2026, 8, 19) / DAY_MS);

// Reseñas más largas que esto se recortan con "Leer más".
const LONG_TEXT = 260;
const SWIPE_MIN_PX = 50;

// Estilo visual compartido por la tarjeta real y por el "medidor" invisible
// que fija la altura del carrusel (mismo padding/borde en los dos para que
// midan exactamente igual).
const CARD_CLASSES =
  "flex flex-col rounded-2xl border border-brand-orange/70 bg-[#211e18] px-6 sm:px-10 py-8 sm:py-10";

function Stars({ rating, isGoogle }: { rating: number; isGoogle: boolean }) {
  const full = Math.round(rating);
  return (
    <span
      className={`flex text-sm ${isGoogle ? "text-[#FBBC04]" : "text-brand-orange"}`}
      aria-hidden="true"
    >
      {"★★★★★".slice(0, full)}
      <span className="opacity-25">{"★★★★★".slice(full)}</span>
    </span>
  );
}

function Avatar({ review }: { review: ReviewCardData }) {
  if (review.photoUrl) {
    // Foto de perfil real del autor, la sirve la propia API de Google para
    // este uso — por eso es una <img> normal y no next/image (dominio
    // externo con URL firmada, mismo patrón que la miniatura de TikTok).
    return (
      <img
        src={review.photoUrl}
        alt=""
        width={44}
        height={44}
        draggable={false}
        className="size-11 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initial = review.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span
      style={review.avatarColor ? { backgroundColor: review.avatarColor } : undefined}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full font-heading font-bold text-white ${
        review.avatarColor ? "" : review.isGoogle ? "bg-dark-900" : "bg-brand-orange"
      }`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

// Contenido de una tarjeta: avatar y nombre, estrellas con la etiqueta de
// Google y el texto. Es el mismo diseño de siempre, ahora dentro de la tarjeta
// con trazo naranja de la ruleta.
function ReviewBody({
  review,
  now,
  isActive,
  expanded,
  onToggle,
}: {
  review: ReviewCardData;
  now: Date;
  isActive: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isLong = review.text.length > LONG_TEXT;
  const nameClass = `block truncate font-heading uppercase font-extrabold text-warm-50 ${
    isActive && review.profileUrl ? "hover:text-brand-orange transition" : ""
  }`;

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar review={review} />
        <div className="min-w-0">
          {isActive && review.profileUrl ? (
            <a
              href={review.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={nameClass}
            >
              {review.name}
            </a>
          ) : (
            <span className={nameClass}>{review.name}</span>
          )}
          {review.city ? <p className="text-sm text-warm-50/60">{review.city}</p> : null}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Stars rating={review.rating} isGoogle={review.isGoogle} />
        {review.isGoogle ? (
          <span className="flex items-center gap-1 text-xs text-warm-50/50">
            <GoogleReviewIcon className="size-3.5" />
            Reseña de Google
            {review.date
              ? ` · ${relativeMonthsEs(review.date, now)}`
              : review.relativeTime
                ? ` · ${review.relativeTime}`
                : ""}
          </span>
        ) : null}
      </div>

      <p
        className={`mt-4 whitespace-pre-line text-base sm:text-lg text-warm-50/90 italic ${
          isLong && !(isActive && expanded) ? "line-clamp-6" : ""
        }`}
      >
        &ldquo;{review.text}&rdquo;
      </p>
      {isLong && isActive ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 self-start text-sm font-bold text-brand-orange hover:underline"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      ) : null}
    </>
  );
}

// Posición de cada tarjeta según su distancia a la activa: la del centro va
// al frente y las de los lados asoman por detrás, más pequeñas y tenues.
// Los desplazamientos son en % del ancho de la tarjeta.
function depthStyle(distance: number, side: number) {
  if (distance === 0) return { x: 0, scale: 1, opacity: 1, z: 20 };
  if (distance === 1) return { x: side * 52, scale: 0.82, opacity: 0.45, z: 10 };
  return { x: side * 70, scale: 0.7, opacity: 0, z: 0 };
}

export default function GoogleReviewsCarousel({ reviews }: { reviews: ReviewCardData[] }) {
  const n = reviews.length;
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // Fecha de "hoy" en días. El servidor usa una fija para que servidor y
  // navegador pinten lo mismo al hidratar, y el navegador pasa enseguida a la
  // fecha real.
  const nowDay = useSyncExternalStore(subscribeNever, currentDay, serverDay);
  const now = new Date(nowDay * DAY_MS);
  const playClick = useClickSound("/sounds/nav-blip.wav");
  const dragStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  if (n === 0) return null;

  // Todo cambio de opinión (flechas, puntos, tarjeta lateral o deslizamiento)
  // pasa por aquí, así que suena siempre.
  function goTo(index: number) {
    playClick();
    setActive(((index % n) + n) % n);
    setExpanded(false);
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
    <>
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Opiniones de clientes"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartX.current = null;
        }}
        className="mt-10 touch-pan-y select-none py-6"
      >
        {/* La tarjeta activa se ve siempre en posición absoluta (para que la
            ruleta se anime con transform sin saltos), así que la altura real
            del carrusel la marca este "medidor" invisible con el mismo
            contenido en flujo normal: el espacio de abajo queda igual que
            el de arriba, y solo crece cuando se pulsa "Leer más". */}
        <div className="relative mx-auto w-[84%] sm:w-[560px]">
          <div aria-hidden="true" className={`invisible ${CARD_CLASSES}`}>
            <ReviewBody
              review={reviews[active]}
              now={now}
              isActive
              expanded={expanded}
              onToggle={() => {}}
            />
          </div>

          {reviews.map((review, i) => {
            let offset = (((i - active) % n) + n) % n;
            if (offset > n / 2) offset -= n;
            const distance = Math.abs(offset);
            const isActive = distance === 0;
            const visible = distance <= 1;
            const d = depthStyle(distance, Math.sign(offset));

            return (
              <article
                key={review.id}
                aria-hidden={!isActive}
                style={{
                  transform: `translateX(${d.x}%) scale(${d.scale})`,
                  opacity: d.opacity,
                  zIndex: d.z,
                  pointerEvents: visible ? "auto" : "none",
                }}
                className={`absolute inset-0 text-left transition-[transform,opacity] duration-500 ease-out ${CARD_CLASSES} ${
                  isActive ? "shadow-[0_24px_60px_rgba(0,0,0,0.55)]" : ""
                }`}
              >
                <ReviewBody
                  review={review}
                  now={now}
                  isActive={isActive}
                  expanded={expanded}
                  onToggle={() => setExpanded((e) => !e)}
                />
                {!isActive && visible ? (
                  <button
                    type="button"
                    aria-label={`Ver opinión de ${review.name}`}
                    onClick={() => {
                      if (swiped.current) {
                        swiped.current = false;
                        return;
                      }
                      goTo(i);
                    }}
                    className="absolute inset-0 cursor-pointer rounded-2xl"
                  />
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-6">
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

        <p className="sm:hidden min-w-16 text-center text-sm font-semibold tabular-nums text-warm-50/70">
          {active + 1} / {n}
        </p>

        <div className="hidden sm:flex items-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver opinión de ${r.name}`}
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
    </>
  );
}
