"use client";

import Image from "next/image";
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
      className={`pointer-events-none absolute -top-28 right-0 sm:-top-32 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      <Image
        src="/brand/miguel-whatsapp.png"
        alt=""
        width={276}
        height={368}
        className="h-28 w-auto sm:h-32 drop-shadow-xl"
      />
    </div>
  );
}
