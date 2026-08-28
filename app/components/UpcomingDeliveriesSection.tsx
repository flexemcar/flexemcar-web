import { upcomingDeliveries } from "@/app/data/upcomingDeliveries";
import { links } from "@/app/lib/links";
import Reveal from "@/app/components/Reveal";

export default function UpcomingDeliveriesSection() {
  return (
    <section id="proximas-entregas" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            En camino
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
            Próximas entregas
          </h2>
          <p className="mt-2 text-brand-ink/70">
            Furgonetas ya reservadas que están de camino a nuestra campa.
            Avísanos y te contactamos en cuanto lleguen.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingDeliveries.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border-2 border-dashed border-brand-orange/40 bg-warm-50 overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-200 to-brand-ink/20">
                <span className="absolute top-3 left-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                  Próximamente
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading uppercase font-extrabold text-lg text-brand-ink">
                  {d.brand} {d.model}
                </h3>
                <p className="mt-1 text-sm text-brand-ink/60">{d.eta}</p>
                <a
                  href={
                    links.whatsapp
                      ? `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(
                          `Hola, me interesa que me aviséis cuando llegue la ${d.brand} ${d.model}`
                        )}`
                      : "#"
                  }
                  target={links.whatsapp ? "_blank" : undefined}
                  rel={links.whatsapp ? "noopener noreferrer" : undefined}
                  className="mt-3 inline-block rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
                >
                  Avísame cuando llegue
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
