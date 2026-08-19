"use client";

import { links } from "@/app/lib/links";
import ScrollToTop from "@/app/components/ScrollToTop";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 5.75 2.38 8.08 8.08 0 0 1 2.38 5.73c0 4.47-3.64 8.1-8.13 8.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.14.82.84-3.06-.19-.32a8.07 8.07 0 0 1-1.24-4.32c0-4.47 3.64-8.1 8.16-8.1Zm-4.47 4.63c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.71 2.72 4.24 3.7 2.09.82 2.52.66 2.97.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.72-1.68-.8-.22-.08-.38-.12-.55.12-.16.24-.63.8-.77.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.35-.76-1.84-.2-.48-.4-.42-.55-.42h-.47Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2h-3.2v13.4a2.6 2.6 0 1 1-2.2-2.57v-3.25a5.85 5.85 0 1 0 5.4 5.83V8.9a7.1 7.1 0 0 0 4.4 1.5V7.2a3.9 3.9 0 0 1-4.4-3.9V2Z" />
    </svg>
  );
}

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col-reverse items-center gap-3 sm:gap-4">
      <ScrollToTop />

      <a
        href={links.whatsapp ? `https://wa.me/${links.whatsapp}` : "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex items-center justify-center size-11 sm:size-12 rounded-full bg-whatsapp text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
      >
        <WhatsAppIcon />
      </a>

      <a
        href={links.tiktok || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="flex items-center justify-center size-11 sm:size-12 rounded-full bg-brand-ink text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
      >
        <TikTokIcon />
      </a>
    </div>
  );
}
