import Image from "next/image";
import { links, navItems } from "@/app/lib/links";

const footerNavItems = navItems.filter((item) => item.label !== "Opiniones");

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M14.5 9H16V6.3c-.6-.1-1.4-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.4H7.5V15h2.3v7h2.8v-7h2.3l.4-2.5h-2.7V10.4c0-.7.2-1.4 1.9-1.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.1.26 2.6.46.6.24 1.1.55 1.6 1.04.5.5.8.98 1.04 1.6.2.5.4 1.4.46 2.6.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 2.1-.46 2.6a4.4 4.4 0 0 1-1.04 1.6 4.4 4.4 0 0 1-1.6 1.04c-.5.2-1.4.4-2.6.46-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2.1-.26-2.6-.46a4.4 4.4 0 0 1-1.6-1.04 4.4 4.4 0 0 1-1.04-1.6c-.2-.5-.4-1.4-.46-2.6C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-2.1.46-2.6.24-.6.55-1.1 1.04-1.6.5-.5.98-.8 1.6-1.04.5-.2 1.4-.4 2.6-.46C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5 0-4.75.07-1 .05-1.55.22-1.9.36-.48.19-.83.4-1.2.77-.36.36-.58.71-.77 1.19-.15.36-.32.9-.36 1.9C3 9.5 3 9.86 3 13s0 3.5.07 4.75c.05 1 .22 1.55.36 1.9.19.48.4.83.77 1.2.36.36.71.58 1.19.77.36.15.9.32 1.9.36 1.25.06 1.61.07 4.75.07s3.5 0 4.75-.07c1-.05 1.55-.22 1.9-.36.48-.19.83-.4 1.2-.77.36-.36.58-.71.77-1.19.15-.36.32-.9.36-1.9.06-1.25.07-1.61.07-4.75s0-3.5-.07-4.75c-.05-1-.22-1.55-.36-1.9a3.2 3.2 0 0 0-.77-1.2 3.2 3.2 0 0 0-1.19-.77c-.36-.15-.9-.32-1.9-.36C15.5 4 15.14 4 12 4Zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm4.7-2a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
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
          <Image
            src="/brand/logo-flexemcar.png"
            alt="Flexemcar"
            width={160}
            height={44}
            className="h-8 w-auto"
          />
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
