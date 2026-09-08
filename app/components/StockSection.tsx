import { getVehicles } from "@/app/lib/getVehicles";
import Reveal from "@/app/components/Reveal";
import StockGrid from "@/app/components/StockGrid";

export default async function StockSection() {
  const vehicles = await getVehicles({ includeSold: false });

  return (
    <section id="stock" className="bg-warm-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Stock disponible
          </p>
          <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
            Nuestras furgonetas de ocasión
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
