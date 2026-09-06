"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo de bienvenida que aparece centrado en pantalla, dentro de una
 * ventana con un leve toque de parabrisas de furgoneta, cuando el
 * usuario llega con el scroll a "Nuestras furgonetas de ocasión" (#stock).
 * Se muestra una única vez por visita. La página sigue siendo scrolleable
 * mientras el vídeo está abierto (no se bloquea el scroll del body), y el
 * vídeo solo se cierra pulsando su botón de cerrar ("x") — no al hacer
 * scroll, ni al pulsar fuera, ni al terminar el vídeo.
 *
 * El vídeo es vertical (formato historia/reel) y la ventana es cuadrada
 * (1:1), así que se muestra en dos capas: un fondo con el mismo vídeo
 * ampliado y desenfocado (rellena todo el marco sin dejar huecos) y,
 * encima, el vídeo real completo sin recortar (para que se vea a las dos
 * personas enteras, sin cortarles la cara ni el cuerpo). Se reproduce una
 * única vez (sin loop): al terminar se queda en el último fotograma hasta
 * que se cierra con la "x".
 *
 * El vídeo permanece montado en el DOM desde el principio (oculto hasta
 * que "open" es true) para poder "desbloquear" el sonido en el primer
 * clic/tecla que el usuario dé en cualquier parte de la página: los
 * navegadores solo permiten reproducir con sonido automáticamente si ha
 * habido una interacción real del usuario en el sitio, y un simple scroll
 * no cuenta como tal. Haciendo un play()/pause() silencioso (volumen a 0,
 * pero SIN usar el atributo muted, que es lo que de verdad comprueba el
 * navegador) en cuanto el usuario interactúa por primera vez, el navegador
 * registra esa interacción y el play() con sonido real que se dispara más
 * tarde por el IntersectionObserver (sin gesto directo) ya no lo bloquea.
 */
export default function WelcomeVideoModal() {
  const [open, setOpen] = useState(false);
  const [needsSoundTap, setNeedsSoundTap] = useState(false);
  const alreadyTriggeredRef = useRef(false);
  const soundUnlockedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Desbloqueo silencioso del sonido en la primera interacción real del
  // usuario con la página (clic, tecla o toque), mucho antes de que el
  // vídeo llegue a abrirse.
  useEffect(() => {
    function unlockSound() {
      if (soundUnlockedRef.current) return;
      const video = videoRef.current;
      if (!video) return;
      soundUnlockedRef.current = true;

      video.muted = false;
      video.volume = 0; // el intento es real (no muted) pero inaudible
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
            video.currentTime = 0;
            video.volume = 1;
          })
          .catch(() => {
            // El navegador tampoco lo permitió con este gesto; se
            // reintentará el flujo normal (con su propio fallback) al
            // abrirse el vídeo de verdad.
            soundUnlockedRef.current = false;
            video.volume = 1;
          });
      }
    }

    window.addEventListener("pointerdown", unlockSound, { once: true });
    window.addEventListener("keydown", unlockSound, { once: true });
    window.addEventListener("touchstart", unlockSound, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };
  }, []);

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
    const video = videoRef.current;
    if (!video) return;

    bgVideoRef.current?.play().catch(() => {});

    setNeedsSoundTap(false);
    video.volume = 1;
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // El navegador ha bloqueado el autoplay con sonido pese al
        // desbloqueo previo (p. ej. el usuario llegó a "stock" sin haber
        // interactuado antes con la página). Se reproduce silenciado y se
        // muestra un botón para activar el sonido con un toque.
        video.muted = true;
        video.play().catch(() => {});
        setNeedsSoundTap(true);
      });
    }
  }, [open]);

  function close() {
    videoRef.current?.pause();
    bgVideoRef.current?.pause();
    setOpen(false);
  }

  function enableSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
    setNeedsSoundTap(false);
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-8 ${
        open ? "" : "invisible opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Vídeo de bienvenida de Flexemcar"
    >
      <div className="relative w-full max-w-2xl animate-welcome-modal-in">
        {/* Botón cerrar: única forma de cerrar el vídeo */}
        <button
          onClick={close}
          aria-label="Cerrar vídeo"
          tabIndex={open ? 0 : -1}
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
        <div className="relative aspect-square w-full drop-shadow-2xl">
          <div className="windshield-clip absolute inset-0 bg-gradient-to-b from-brand-orange via-[#f5821f] to-[#c96410]" />

          <div className="windshield-clip absolute inset-[1.6%] overflow-hidden bg-dark-1000">
            {/* Fondo: el mismo vídeo, ampliado y desenfocado, solo para rellenar el marco */}
            <video
              ref={bgVideoRef}
              src="/video/bienvenida-flexemcar.mp4"
              muted
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 h-full w-full scale-125 object-cover object-[center_25%] blur-2xl brightness-[0.45]"
            />
            {/* Vídeo real, completo y sin recortar, para que se vea bien a las personas */}
            <video
              ref={videoRef}
              src="/video/bienvenida-flexemcar.mp4"
              playsInline
              className="relative h-full w-full object-contain"
            />
          </div>

          {/* Botón para activar el sonido, solo si el navegador bloqueó el autoplay con sonido */}
          {open && needsSoundTap && (
            <button
              onClick={enableSound}
              aria-label="Activar sonido"
              className="absolute bottom-[7%] right-[8%] z-20 flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-2 text-xs font-bold text-white shadow-lg ring-2 ring-white transition-transform hover:scale-105 sm:text-sm"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" />
                <path
                  d="M16.5 8.5a4.5 4.5 0 0 1 0 7M19 6a8 8 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              Activar sonido
            </button>
          )}

          {/* Insignia de marca flotando bajo el marco */}
          <div className="pointer-events-none absolute -bottom-5 sm:-bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-brand-orange px-3 py-2 shadow-lg sm:rounded-2xl sm:px-4 sm:py-2.5">
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
