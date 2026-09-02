"use client";

import { useEffect, useState } from "react";

/**
 * Foto de Miguel señalando el botón de WhatsApp. Aparece solo cuando el
 * usuario llega al final de la página (footer a la vista).
 */
export default function MiguelPointer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const nearBottom =
        window.scrollY + window.innerHeight >= doc.scrollHeight - 250;
      setVisible(nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-full bottom-1 mr-2 w-32 sm:bottom-1.5 sm:w-48 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-3"
      }`}
    >
      <div className="relative">
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-4 py-2 text-sm font-bold text-brand-ink shadow-lg sm:text-base">
          ¿Hablamos?
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/miguel-whatsapp.png"
          alt=""
          className="w-full h-auto drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
