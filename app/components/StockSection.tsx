import { getVehicles } from "@/app/lib/getVehicles";
import Reveal from "@/app/components/Reveal";
import StockGrid from "@/app/components/StockGrid";
import TallerVideoBlock from "@/app/components/TallerVideoBlock";

export default async function StockSection() {
  const vehicles = await getVehicles({ includeSold: false });

  return (
    <section id="stock" className="bg-warm-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative mb-12 sm:mb-16 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-dark-1000 px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-brand-orange/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-10 md:text-left">
              <div className="flex flex-col items-center md:items-start md:max-w-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange">
                  Detrás de cámaras
                </span>
                <h3 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Miguel, ¿sabías que teníamos taller propio?
                </h3>
              </div>

              <div className="w-full max-w-[220px] sm:max-w-[260px] shrink-0">
                <TallerVideoBlock />
              </div>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Stock disponible
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
            Furgos disponibles
          </h2>
          <p className="mt-2 text-brand-ink/70">
            Todas revisadas y con historial verificado. Filtra por marca, tipo,
            kilómetros, año y precio, y encuentra la tuya —{" "}
            <span className="font-semibold">{vehicles.length} vehículos en stock</span>.
          </p>
        </Reveal>

        <StockGrid vehicles={vehicles} />
      </div>
    </section>
  );
}
