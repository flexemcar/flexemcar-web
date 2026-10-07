"use client";

import { useEffect, useRef, useState } from "react";

// Vídeo "Buena gente" (public/video). Muestra la portada con un botón grande de
// reproducir; al pulsarlo arranca con sonido y aparecen los controles nativos.
// Solo se descarga al darle a reproducir (preload="none") y se pausa al salir
// de la pantalla.
export default function BuenaGenteVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.muted = false;
    video.play().catch(() => {});
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] bg-dark-1000 ring-4 ring-brand-orange/70 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
      <video
        ref={videoRef}
        src="/video/buena-gente-flexemcar.mp4"
        poster="/video/buena-gente-poster.jpg"
        preload="none"
        playsInline
        controls={started}
        className="h-full w-full object-cover"
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Reproducir el vídeo de Flexemcar"
          className="group absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-dark-1000/85 via-dark-1000/10 to-transparent pb-8 text-white"
        >
          <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-24">
            <span className="absolute inset-0 rounded-full bg-brand-orange/40 motion-safe:animate-ping" />
            <span className="relative flex size-full items-center justify-center rounded-full bg-brand-orange shadow-lg transition duration-300 group-hover:scale-110 motion-reduce:transition-none">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 size-8 sm:size-10" fill="currentColor">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
            </span>
          </span>
          <span className="text-sm font-bold uppercase tracking-widest">Dale al play</span>
          <span className="mt-1 text-xs text-white/70">Con sonido · 0:42</span>
        </button>
      )}
    </div>
  );
}
