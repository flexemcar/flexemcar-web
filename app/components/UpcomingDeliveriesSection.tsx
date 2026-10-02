import { getVehicles } from "@/app/lib/getVehicles";
import Reveal from "@/app/components/Reveal";
import UpcomingGrid from "@/app/components/UpcomingGrid";

// Vehiculos marcados como "Proxima entrega" en el panel. Si no hay ninguno,
// la seccion no se pinta.
export default async function UpcomingDeliveriesSection() {
  const vehicles = await getVehicles({ includeSold: false, upcoming: true });
  if (vehicles.length === 0) return null;

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
            Furgonetas que están de camino a nuestra campa. Avísanos y te
            contactamos en cuanto lleguen.
          </p>
        </Reveal>

        <UpcomingGrid vehicles={vehicles} />
      </div>
    </section>
  );
}
