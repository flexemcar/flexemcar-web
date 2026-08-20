import Image from "next/image";
import { links, navItems } from "@/app/lib/links";

const footerNavItems = navItems.filter((item) => item.label !== "Opiniones");

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socials = [
  { label: "Facebook", href: links.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: links.instagram, Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="bg-dark-1000 text-warm-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="inline-flex items-center rounded-2xl bg-brand-orange px-5 py-3">
            <Image
              src="/brand/logo-flexemcar.png"
              alt="Flexemcar"
              width={160}
              height={44}
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
          <p className="mt-4 text-sm text-warm-50/70 max-w-xs">
            Flexemcar es tu portal para comprar y vender furgonetas de
            ocasión al mejor precio. Amplia selección de furgonetas y
            camiones revisados y garantizados.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center size-10 rounded-full border border-warm-50/25 text-warm-50 hover:border-brand-orange hover:text-brand-orange transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading uppercase font-extrabold text-sm tracking-wide text-brand-orange">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-warm-50/80 hover:text-brand-orange transition"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading uppercase font-extrabold text-sm tracking-wide text-brand-orange">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {links.phone && (
              <li>
                <a
                  href={`tel:${links.phone}`}
                  className="font-bold text-warm-50 hover:text-brand-orange transition"
                >
                  {links.phone}
                </a>
              </li>
            )}
            <li>
              <a
                href={`mailto:${links.email}`}
                className="text-warm-50/80 hover:text-brand-orange transition"
              >
                {links.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-warm-50/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warm-50/50">
          <p>© {new Date().getFullYear()} Flexemcar · Compraventa de furgonetas de ocasión</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-orange transition">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-brand-orange transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
