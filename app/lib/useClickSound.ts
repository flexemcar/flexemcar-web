"use client";

import { useCallback, useEffect, useRef } from "react";

// Gestos con los que los navegadores permiten activar el audio. En iPhone el
// desbloqueo solo vale al soltar el dedo (touchend) o al hacer clic; un
// deslizamiento de tarjetas no cuenta hasta que termina.
const UNLOCK_EVENTS = ["pointerdown", "pointerup", "touchstart", "touchend", "click", "keydown"] as const;

// Si el audio tarda más que esto en activarse, el clic ya no tiene sentido.
const MAX_LATE_MS = 1500;

export function useClickSound(src: string) {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    ctxRef.current = ctx;

    fetch(src)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        bufferRef.current = buffer;
      })
      .catch(() => {});

    // Se intenta activar el audio en cada gesto mientras no esté sonando, así
    // ya está listo cuando llega el primer deslizamiento. También lo reactiva
    // si el sistema lo suspende (por ejemplo, tras cambiar de app en iPhone).
    const unlock = () => {
      if (ctx.state !== "running") ctx.resume().catch(() => {});
    };
    UNLOCK_EVENTS.forEach((type) =>
      window.addEventListener(type, unlock, { passive: true, capture: true }),
    );

    return () => {
      UNLOCK_EVENTS.forEach((type) =>
        window.removeEventListener(type, unlock, { capture: true }),
      );
      ctx.close();
    };
  }, [src]);

  return useCallback(() => {
    const ctx = ctxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer) return;

    const play = () => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.5;
      source.connect(gain).connect(ctx.destination);
      source.start(0);
    };

    if (ctx.state === "running") {
      play();
      return;
    }

    // Aún suspendido: suena en cuanto se activa, salvo que llegue tarde.
    const requestedAt = performance.now();
    ctx
      .resume()
      .then(() => {
        if (performance.now() - requestedAt <= MAX_LATE_MS) play();
      })
      .catch(() => {});
  }, []);
}
