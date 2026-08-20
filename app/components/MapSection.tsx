import { links } from "@/app/lib/links";
import Reveal from "@/app/components/Reveal";

export default function MapSection() {
  return (
    <section id="contacto" className="bg-warm-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Dónde estamos
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
            Visita nuestra campa en Elche
          </h2>
          <p className="mt-2 text-brand-ink/70">{links.address}</p>
        </Reveal>

        <div className="mt-8 overflow-hidden rounded-2xl border border-warm-200">
          <iframe
            src={links.mapsEmbed}
            title="Ubicación de Flexemcar"
            className="w-full h-[360px] sm:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
