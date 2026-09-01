"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getDisplayPrice, type Vehicle } from "@/app/lib/vehicles";
import VehicleModal from "@/app/components/VehicleModal";

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

export default function StockGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    if (!maxPrice) return vehicles;
    return vehicles.filter((v) => getDisplayPrice(v).amount <= Number(maxPrice));
  }, [vehicles, maxPrice]);

  return (
    <>
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

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-brand-ink/60">
          No hay vehículos que coincidan con este filtro.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((v) => (
            <div
              key={v.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(v);
                }
              }}
              className="group cursor-pointer rounded-2xl bg-white border border-warm-200 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-orange/50"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-200 to-brand-ink/20 overflow-hidden">
                {v.photos[0] && (
                  <Image
                    src={v.photos[0].url}
                    alt={`${v.brand} ${v.model}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
                <span className="absolute top-3 right-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                  {formatKm(v.km)}
                </span>
                {v.status === "reserved" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="-rotate-6 rounded border-2 border-white px-4 py-1 font-heading uppercase font-extrabold tracking-wide text-white text-lg">
                      Reservado
                    </span>
                  </div>
                )}
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
                    {formatPrice(getDisplayPrice(v).amount)}
                  </span>
                  <span className="text-sm font-bold text-brand-ink underline underline-offset-2 transition-colors group-hover:text-brand-orange">
                    Ver ficha
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <VehicleModal vehicle={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
