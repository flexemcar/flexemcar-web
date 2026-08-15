"use client";

import { useMemo, useState } from "react";
import { totalStock, vehicles } from "@/app/data/vehicles";

const priceOptions = [
  { label: "Todos", value: "" },
  { label: "Hasta 15.000 €", value: "15000" },
  { label: "Hasta 20.000 €", value: "20000" },
  { label: "Hasta 25.000 €", value: "25000" },
];

function formatPrice(n: number) {
  return n.toLocaleString("es-ES") + " €";
}

function formatKm(n: number) {
  return n.toLocaleString("es-ES") + " km";
}

export default function StockSection() {
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    if (!maxPrice) return vehicles;
    return vehicles.filter((v) => v.price <= Number(maxPrice));
  }, [maxPrice]);

  return (
    <section id="stock" className="bg-warm-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
          Stock disponible
        </p>
        <h2 className="mt-2 font-heading uppercase font-extrabold text-3xl sm:text-4xl text-brand-ink">
          Nuestras furgonetas de ocasión
        </h2>
        <p className="mt-2 text-brand-ink/70">
          Todas revisadas y con historial verificado. Filtra por precio y
          encuentra la tuya —{" "}
          <span className="font-semibold">{totalStock} vehículos en stock</span>.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-full bg-white border border-warm-200 p-2">
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1 min-w-[160px] rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-brand-ink outline-none"
          >
            {priceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMaxPrice("")}
            className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl bg-white border border-warm-200 overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-200 to-brand-ink/20">
                <span className="absolute top-3 right-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                  {formatKm(v.km)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading uppercase font-extrabold text-lg text-brand-ink">
                  {v.brand} {v.model}
                </h3>
                <p className="mt-1 text-sm text-brand-ink/60">
                  {v.year} · {formatKm(v.km)} · {v.fuel}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xl text-brand-orange">
                    {formatPrice(v.price)}
                  </span>
                  <a
                    href="#"
                    className="text-sm font-bold text-brand-ink underline underline-offset-2 hover:text-brand-orange"
                  >
                    Ver ficha
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="rounded-full bg-brand-orange px-8 py-[15px] font-bold text-[17px] text-white hover:brightness-110 transition"
          >
            Ver más furgonetas ({totalStock})
          </a>
        </div>
      </div>
    </section>
  );
}
