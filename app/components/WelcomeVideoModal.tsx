"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo de bienvenida que aparece centrado en pantalla, dentro de una
 * ventana con forma de parabrisas de furgoneta, cuando el usuario llega
 * con el scroll a la sección "Nuestras furgonetas de ocasión" (#stock).
 * Se muestra una única vez por visita (tanto si se cierra a mano como si
 * termina solo).
 */
export default function WelcomeVideoModal() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    videoRef.current?.pause();
    setOpen(false);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
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

        {/* Marco "parabrisas" */}
        <div className="relative aspect-[8/5] w-full drop-shadow-2xl">
          <div className="windshield-clip absolute inset-0 bg-gradient-to-b from-brand-orange via-[#f5821f] to-[#c96410]" />

          <div className="windshield-clip absolute inset-[3.2%] overflow-hidden bg-dark-1000">
            <video
              ref={videoRef}
              src="/video/bienvenida-flexemcar.mp4"
              autoPlay
              muted
              playsInline
              onEnded={close}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Botón de silencio */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            className="absolute bottom-[7%] right-[8%] z-20 flex size-8 sm:size-9 items-center justify-center rounded-full bg-dark-1000/80 text-white shadow-md transition-transform hover:scale-110"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="size-4 sm:size-5" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" />
                <path
                  d="M18.5 8.5l3 3m0-3l-3 3"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-4 sm:size-5" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" />
                <path
                  d="M16.5 8.5a4.5 4.5 0 0 1 0 7M19 6a8 8 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </button>

          {/* Letrero de marca, como una franja de parasol sobre el parabrisas */}
          <div className="pointer-events-none absolute -top-4 sm:-top-5 left-1/2 z-10 -translate-x-1/2 rounded-md bg-dark-1000 px-3 py-1.5 shadow-lg sm:px-4 sm:py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-flexemcar-blanco.png"
              alt="Flexemcar"
              className="h-3 w-auto sm:h-3.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
