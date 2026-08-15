import Image from "next/image";
import { links, navItems } from "@/app/lib/links";

const socials = [
  { label: "Instagram", href: links.instagram },
  { label: "TikTok", href: links.tiktok },
  { label: "Facebook", href: links.facebook },
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
            Compra y venta de furgonetas y camiones de ocasión revisados y
            garantizados en Elche (Alicante).
          </p>
        </div>

        <div>
          <h3 className="font-heading uppercase font-extrabold text-sm tracking-wide text-brand-orange">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
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
          <ul className="mt-4 space-y-2 text-sm text-warm-50/80">
            <li>
              <a
                href={`mailto:${links.email}`}
                className="hover:text-brand-orange transition"
              >
                {links.email}
              </a>
            </li>
            {links.phone && (
              <li>
                <a
                  href={`tel:${links.phone}`}
                  className="hover:text-brand-orange transition"
                >
                  {links.phone}
                </a>
              </li>
            )}
          </ul>

          <a
            href={links.whatsapp || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
          >
            ¡Háblanos!
          </a>

          <div className="mt-6 flex gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-warm-50/60 hover:text-brand-orange transition text-sm font-semibold"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-warm-50/10 py-6 text-center text-xs text-warm-50/50">
        © {new Date().getFullYear()} Flexemcar. Todos los derechos reservados.
      </div>
    </footer>
  );
}
