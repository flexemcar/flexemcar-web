import Image from "next/image";
import Link from "next/link";

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 font-heading uppercase font-extrabold text-xl sm:text-2xl text-warm-50">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-relaxed text-warm-50/80">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-3 list-disc pl-5 space-y-2 leading-relaxed text-warm-50/80 marker:text-brand-orange">
      {children}
    </ul>
  );
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-brand-orange underline underline-offset-2 hover:brightness-125 break-words"
    >
      {children}
    </a>
  );
}

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 text-warm-50">
      <header className="bg-warm-50 border-b border-warm-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Flexemcar, ir al inicio">
            <Image
              src="/brand/logo-flexemcar.png"
              alt="Flexemcar"
              width={160}
              height={44}
              className="h-8 sm:h-9 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-dark-900/70 hover:text-brand-orange transition"
          >
            ← Volver a la web
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14 pb-24">
        <h1 className="font-heading uppercase font-extrabold text-3xl sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-warm-50/50">Última actualización: {updated}</p>
        {children}
      </main>
    </div>
  );
}
