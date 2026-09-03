"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo de bienvenida que aparece centrado en pantalla, dentro de una
 * ventana con un leve toque de parabrisas de furgoneta, cuando el
 * usuario llega con el scroll a "Nuestras furgonetas de ocasión" (#stock).
 * Se muestra una única vez por visita (tanto si se cierra a mano como si
 * termina solo).
 */
export default function WelcomeVideoModal() {
  const [open, setOpen] = useState(false);
  const alreadyTriggeredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const target = document.getElementById("stock");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !alreadyTriggeredRef.current) {
          alreadyTriggeredRef.current = true;
          setOpen(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Algunos navegadores bloquean el autoplay con sonido si no ha
        // habido interacción previa del usuario en el sitio; en ese caso
        // se reproduce silenciado en vez de quedarse congelado sin nada.
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [open]);

  function close() {
    videoRef.current?.pause();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-8"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Vídeo de bienvenida de Flexemcar"
    >
      <div
        className="relative w-full max-w-2xl animate-welcome-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={close}
          aria-label="Cerrar vídeo"
          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full bg-brand-ink text-white shadow-lg ring-2 ring-white transition-transform hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 sm:size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Marco con un leve toque de parabrisas */}
        <div className="relative aspect-[8/5] w-full drop-shadow-2xl">
          <div className="windshield-clip absolute inset-0 bg-gradient-to-b from-brand-orange via-[#f5821f] to-[#c96410]" />

          <div className="windshield-clip absolute inset-[1.6%] overflow-hidden bg-dark-1000">
            <video
              ref={videoRef}
              src="/video/bienvenida-flexemcar.mp4"
              playsInline
              onEnded={close}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Insignia de marca flotando sobre el marco */}
          <div className="pointer-events-none absolute -top-5 sm:-top-6 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-brand-orange px-3 py-2 shadow-lg sm:rounded-2xl sm:px-4 sm:py-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-flexemcar-badge.png"
              alt="Flexemcar"
              className="h-4 w-auto sm:h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
