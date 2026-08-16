"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { links, navItems } from "@/app/lib/links";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-orange text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-8">
          <a
            href={links.mapsLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-dark-1000 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-dark-950 transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 shrink-0"
              fill="currentColor"
            >
              <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.7a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
            ¿Dónde estamos?
          </a>
          <p className="hidden sm:block flex-1 text-center font-extrabold tracking-wide uppercase text-xs sm:text-sm">
            Nº1 en transparencia · Portal líder en compraventa de furgonetas
          </p>
        </div>
      </div>

      <div className="bg-warm-50/95 backdrop-blur border-b border-warm-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/brand/logo-flexemcar.png"
              alt="Flexemcar"
              width={200}
              height={55}
              priority
              className="h-11 sm:h-14 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-semibold text-base text-brand-ink hover:text-brand-orange transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            className="md:hidden flex items-center justify-center size-9 rounded-full border border-warm-200 text-brand-ink"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-warm-200 bg-warm-50 px-4 sm:px-6 py-3 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-sm text-brand-ink hover:text-brand-orange transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
