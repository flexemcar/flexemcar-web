import { getVehicleCount } from "@/app/lib/getVehicles";
import Counter from "@/app/components/Counter";

export default async function StatsSection() {
  const totalStock = await getVehicleCount();
  const stats = [
    { target: 500, prefix: "+", label: "Furgonetas entregadas" },
    { target: totalStock, prefix: "", label: "Vehículos en stock" },
  ];

  return (
    // Foto de fondo con capa oscura del 88 %. En escritorio queda fija mientras se
    // desplaza la página (efecto parallax); en móvil se desplaza con la sección
    // porque los navegadores móviles no lo soportan bien.
    <section
      style={{
        backgroundImage:
          "linear-gradient(rgba(14,12,10,0.88), rgba(14,12,10,0.88)), url(/stats/stats-bg.jpg)",
      }}
      className="relative bg-dark-950 bg-cover bg-center py-16 sm:py-24 md:bg-fixed"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading font-extrabold text-4xl sm:text-5xl text-brand-orange">
              <Counter target={stat.target} prefix={stat.prefix} />
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-warm-50/80">
              {stat.label}
            </p>
          </div>
        ))}
        <div>
          <p className="font-heading font-extrabold text-4xl sm:text-5xl text-brand-orange">
            4,8★
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-warm-50/80">
            Valoración en Google
          </p>
        </div>
      </div>
    </section>
  );
}
