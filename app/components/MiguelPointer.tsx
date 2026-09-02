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
      className={`pointer-events-none absolute right-full bottom-[-65px] mr-4 w-32 sm:bottom-[-106px] sm:mr-6 sm:w-48 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-3"
      }`}
    >
      <div className="relative">
        <div className="absolute left-[76px] top-[27px] sm:left-[114px] sm:top-[40px]">
          <div className="relative -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-ink shadow-[0_6px_18px_rgba(0,0,0,0.28)] sm:px-4 sm:py-2 sm:text-sm">
            ¿Hablamos?
            <span className="absolute right-full top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-r-[8px] border-y-transparent border-r-white sm:border-y-[7px] sm:border-r-[9px]" />
          </div>
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
