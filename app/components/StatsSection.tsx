import { totalStock } from "@/app/data/vehicles";
import Counter from "@/app/components/Counter";

const stats = [
  { target: 500, prefix: "+", label: "Furgonetas entregadas" },
  { target: totalStock, prefix: "", label: "Vehículos en stock" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-dark-950 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-1000 via-dark-950 to-brand-ink/60" />
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
