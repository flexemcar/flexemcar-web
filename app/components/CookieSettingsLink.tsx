"use client";

import { openCookieSettingsEvent } from "@/app/lib/tracking";

// Botón que reabre el aviso para cambiar o retirar el consentimiento.
export default function CookieSettingsLink({
  children = "Configurar cookies",
  className = "hover:text-brand-orange transition",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(openCookieSettingsEvent))}
      className={className}
    >
      {children}
    </button>
  );
}
