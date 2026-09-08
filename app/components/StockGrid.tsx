"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  brandOptions,
  getDisplayPrice,
  vehicleTypeOptions,
  type Vehicle,
} from "@/app/lib/vehicles";
import VehicleModal from "@/app/components/VehicleModal";

const priceOptions = [
  { label: "Todos", value: "" },
  { label: "Hasta 15.000 €", value: "15000" },
  { label: "Hasta 20.000 €", value: "20000" },
  { label: "Hasta 25.000 €", value: "25000" },
];

const MIN_YEAR = 2000;
const MAX_YEAR = new Date().getFullYear() + 1;
const MIN_KM = 0;
const MAX_KM = 400000;

function formatPrice(n: number) {
  return n.toLocaleString("es-ES") + " €";
}

function formatKm(n: number) {
  return n.toLocaleString("es-ES") + " km";
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function StockGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [kmFrom, setKmFrom] = useState("");
  const [kmTo, setKmTo] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (maxPrice && getDisplayPrice(v).amount > Number(maxPrice)) return false;
      if (brands.length > 0 && !brands.includes(v.brand)) return false;
      if (types.length > 0 && (!v.vehicleType || !types.includes(v.vehicleType)))
        return false;
      if (kmFrom && v.km < Number(kmFrom)) return false;
      if (kmTo && v.km > Number(kmTo)) return false;
      if (yearFrom && v.year < Number(yearFrom)) return false;
      if (yearTo && v.year > Number(yearTo)) return false;
      return true;
    });
  }, [vehicles, maxPrice, brands, types, kmFrom, kmTo, yearFrom, yearTo]);

  const hasFilters =
    maxPrice ||
    brands.length > 0 ||
    types.length > 0 ||
    kmFrom ||
    kmTo ||
    yearFrom ||
    yearTo;

  function clearFilters() {
    setMaxPrice("");
    setBrands([]);
    setTypes([]);
    setKmFrom("");
    setKmTo("");
    setYearFrom("");
    setYearTo("");
  }

  return (
    <>
      <div className="mt-8 rounded-2xl bg-white border border-warm-200 p-4 sm:p-5 space-y-4">
        <ChipGroup label="Marca" options={brandOptions} selected={brands} onToggle={(v) => setBrands((prev) => toggle(prev, v))} />
        <ChipGroup
          label="Tipo de vehículo"
          options={vehicleTypeOptions}
          selected={types}
          onToggle={(v) => setTypes((prev) => toggle(prev, v))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/60 mb-1.5">
              Precio
            </p>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={selectClass}
            >
              {priceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/60 mb-1.5">
              Kilómetros
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Desde"
                min={MIN_KM}
                max={MAX_KM}
                step={1000}
                value={kmFrom}
                onChange={(e) => setKmFrom(e.target.value)}
                className={rangeInputClass}
              />
              <span className="text-brand-ink/40">–</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Hasta"
                min={MIN_KM}
                max={MAX_KM}
                step={1000}
                value={kmTo}
                onChange={(e) => setKmTo(e.target.value)}
                className={rangeInputClass}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/60 mb-1.5">
              Año
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Desde"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className={rangeInputClass}
              />
              <span className="text-brand-ink/40">–</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Hasta"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className={rangeInputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-warm-200">
          <p className="text-sm text-brand-ink/60">
            <span className="font-bold text-brand-ink">{filtered.length}</span> de{" "}
            {vehicles.length} vehículos
          </p>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-40 disabled:hover:brightness-100"
          >
            Limpiar filtros
          </button>
        </div>
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

const selectClass =
  "w-full rounded-full bg-warm-100 border border-warm-200 px-4 py-2 text-sm font-semibold text-brand-ink outline-none focus:border-brand-orange";

const rangeInputClass =
  "w-full min-w-0 rounded-full bg-warm-100 border border-warm-200 px-3 py-2 text-sm font-semibold text-brand-ink outline-none focus:border-brand-orange";

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-brand-ink/60 mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand-orange border-brand-orange text-white"
                  : "bg-warm-100 border-warm-200 text-brand-ink hover:border-brand-orange/50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
