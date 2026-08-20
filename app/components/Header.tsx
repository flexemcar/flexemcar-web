"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { links, navItems } from "@/app/lib/links";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-brand-orange text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-1.5 flex items-center gap-3">
          <div className="group relative shrink-0">
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-1 flex flex-col gap-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="h-0.5 w-3 rounded-full bg-dark-1000/70 opacity-0 group-hover:animate-[speedline_0.6s_ease-out_infinite]" />
              <span className="h-0.5 w-4 rounded-full bg-dark-1000/60 opacity-0 group-hover:animate-[speedline_0.6s_ease-out_infinite_0.1s]" />
              <span className="h-0.5 w-2.5 rounded-full bg-dark-1000/50 opacity-0 group-hover:animate-[speedline_0.6s_ease-out_infinite_0.2s]" />
            </span>
            <a
              href={links.mapsLocation}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-1.5 rounded-full bg-dark-1000 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wide shadow-sm transition-transform duration-300 ease-out hover:translate-x-2 hover:bg-dark-950"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-3 shrink-0"
                fill="currentColor"
              >
                <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.7a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              ¿Dónde estamos?
            </a>
          </div>
          <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left font-extrabold tracking-wide uppercase text-[10px] sm:text-xs sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:overflow-visible sm:whitespace-nowrap sm:pointer-events-none">
            Nº1 en transparencia · Portal líder en compraventa de furgonetas
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-warm-50/95 backdrop-blur border-b border-warm-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/brand/logo-flexemcar.png"
              alt="Flexemcar"
              width={160}
              height={44}
              priority
              className="h-8 sm:h-9 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-semibold text-sm text-brand-ink hover:text-brand-orange transition-colors"
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
      </header>
    </>
  );
}
