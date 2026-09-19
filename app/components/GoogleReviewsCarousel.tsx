"use client";

import { useState, useSyncExternalStore } from "react";
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

export default function GoogleReviewsCarousel({ reviews }: { reviews: ReviewCardData[] }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // Fecha de "hoy" en días. El servidor usa una fija para que servidor y
  // navegador pinten lo mismo al hidratar, y el navegador pasa enseguida a la
  // fecha real.
  const nowDay = useSyncExternalStore(subscribeNever, currentDay, serverDay);
  const now = new Date(nowDay * DAY_MS);
  const current = reviews[active];
  const playClick = useClickSound("/sounds/nav-blip.wav");

  if (!current) return null;

  function goTo(index: number) {
    const wrapped = ((index % reviews.length) + reviews.length) % reviews.length;
    playClick();
    setActive(wrapped);
    setExpanded(false);
  }

  return (
    <>
      <div className="mt-10 rounded-2xl bg-warm-50/5 border border-warm-50/10 px-6 sm:px-10 py-10 text-left">
        <div className="flex items-center gap-3">
          <Avatar review={current} />
          <div className="min-w-0">
            <a
              href={current.profileUrl ?? undefined}
              target={current.profileUrl ? "_blank" : undefined}
              rel={current.profileUrl ? "noopener noreferrer" : undefined}
              className={`block truncate font-heading uppercase font-extrabold text-warm-50 ${
                current.profileUrl ? "hover:text-brand-orange transition" : ""
              }`}
            >
              {current.name}
            </a>
            {current.city ? (
              <p className="text-sm text-warm-50/60">{current.city}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Stars rating={current.rating} isGoogle={current.isGoogle} />
          {current.isGoogle ? (
            <span className="flex items-center gap-1 text-xs text-warm-50/50">
              <GoogleReviewIcon className="size-3.5" />
              Reseña de Google
              {current.date
                ? ` · ${relativeMonthsEs(current.date, now)}`
                : current.relativeTime
                  ? ` · ${current.relativeTime}`
                  : ""}
            </span>
          ) : null}
        </div>

        <p
          className={`mt-4 whitespace-pre-line text-base sm:text-lg text-warm-50/90 italic ${
            !expanded && current.text.length > LONG_TEXT ? "line-clamp-6" : ""
          }`}
        >
          &ldquo;{current.text}&rdquo;
        </p>
        {current.text.length > LONG_TEXT ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-sm font-bold text-brand-orange hover:underline"
          >
            {expanded ? "Leer menos" : "Leer más"}
          </button>
        ) : null}
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

        <p className="sm:hidden min-w-16 text-center text-sm font-semibold tabular-nums text-warm-50/70">
          {active + 1} / {reviews.length}
        </p>

        <div className="hidden sm:flex items-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setActive(i);
                setExpanded(false);
              }}
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
