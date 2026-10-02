"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Pestañas principales del panel. La activa va en naranja relleno; la otra,
// con borde, para que se vea claramente que es un boton.
const tabs = [
  {
    href: "/admin",
    label: "Vehículos",
    isActive: (p: string) => p === "/admin" || p.startsWith("/admin/vehicles"),
    icon: (
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    ),
  },
  {
    href: "/admin/videos",
    label: "Vídeos",
    isActive: (p: string) => p.startsWith("/admin/videos"),
    icon: <path d="M4 5h16v14H4zM10 9.5v5l4.5-2.5z" />,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-2 gap-3 px-4 sm:px-6 py-4 sm:flex">
      {tabs.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-extrabold uppercase tracking-wide transition sm:min-w-44 ${
              active
                ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/25"
                : "border-2 border-brand-orange/50 text-warm-50 hover:border-brand-orange hover:bg-brand-orange/10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {tab.icon}
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
