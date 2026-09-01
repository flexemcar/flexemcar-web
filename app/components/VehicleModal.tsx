"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { calculateMonthlyPayment, financingConfig } from "@/app/lib/financing";
import { links } from "@/app/lib/links";
import { getDisplayPrice, statusLabels, type Vehicle } from "@/app/lib/vehicles";

function formatPrice(n: number) {
  return Math.round(n).toLocaleString("es-ES") + " €";
}

function formatKm(n: number) {
  return n.toLocaleString("es-ES") + " km";
}

export default function VehicleModal({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);

  const displayPrice = getDisplayPrice(vehicle);
  const basePrice = vehicle.cashPrice ?? vehicle.price ?? 0;
  const maxEntrada = Math.max(Math.round(Math.min(basePrice, 15000) / 100) * 100, 500);
  const [entrada, setEntrada] = useState(Math.round(maxEntrada * 0.2 / 100) * 100);
  const [plazo, setPlazo] = useState(48);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const amountToFinance = Math.max(basePrice - entrada, 0);
  const monthly = useMemo(
    () => calculateMonthlyPayment(amountToFinance, plazo, financingConfig.tin),
    [amountToFinance, plazo]
  );
  const totalToRepay = entrada + monthly * plazo;

  const whatsappMessage = `Hola, me interesa la ${vehicle.brand} ${vehicle.model} (${vehicle.year}, ${formatKm(
    vehicle.km
  )}) por ${formatPrice(displayPrice.amount)}.`;
  const whatsappHref = links.whatsapp
    ? `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const includedInPrice = [
    "Revisión completa y puesta a punto",
    "ITV recién pasada",
    "Cambio de nombre y gestión",
    `Garantía de ${vehicle.warrantyMonths} meses`,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full bg-white sm:my-8 sm:max-w-4xl sm:rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-lg text-white transition hover:bg-black/60"
        >
          ×
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex flex-col bg-warm-100">
            <div className="relative aspect-[4/3] min-h-[240px] shrink-0 bg-gradient-to-br from-warm-200 to-brand-ink/20 sm:aspect-auto sm:min-h-0 sm:flex-1">
              {vehicle.photos[activePhoto] && (
                <Image
                  src={vehicle.photos[activePhoto].url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              )}
              <span
                className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold text-white ${
                  vehicle.status === "reserved" ? "bg-brand-ink" : "bg-brand-orange"
                }`}
              >
                {statusLabels[vehicle.status]}
              </span>
            </div>
            {vehicle.photos.length > 1 && (
              <div className="flex shrink-0 gap-2 overflow-x-auto p-3">
                {vehicle.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    aria-label={`Foto ${i + 1}`}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === activePhoto ? "border-brand-orange" : "border-transparent"
                    }`}
                  >
                    <Image src={photo.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
              {vehicle.brand} · Furgoneta de ocasión
            </p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase text-brand-ink sm:text-3xl">
              {vehicle.brand} {vehicle.model}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {[String(vehicle.year), formatKm(vehicle.km), vehicle.fuel, vehicle.transmission].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-warm-200 px-3 py-1 text-xs font-semibold text-brand-ink/70"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>

            <div className="mt-4 flex items-end gap-6 border-b border-warm-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-brand-ink/50">
                  {displayPrice.label}
                </p>
                <p className="font-heading text-2xl font-extrabold text-brand-orange">
                  {formatPrice(displayPrice.amount)}
                </p>
              </div>
              {vehicle.price !== null && vehicle.cashPrice !== null && (
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-ink/50">Al contado</p>
                  <p className="font-heading text-lg font-extrabold text-brand-ink">
                    {formatPrice(vehicle.cashPrice)}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-warm-200 bg-warm-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-brand-ink">Calcula tu cuota</p>
                <p className="text-[11px] text-brand-ink/50">
                  TIN {financingConfig.tin}% · TAE {financingConfig.tae}%
                </p>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-ink/70">
                  <span>Entrada</span>
                  <span>{formatPrice(entrada)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxEntrada}
                  step={100}
                  value={entrada}
                  onChange={(e) => setEntrada(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-orange"
                />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-ink/70">
                  <span>Plazo</span>
                  <span>{plazo} meses</span>
                </div>
                <input
                  type="range"
                  min={financingConfig.minTermMonths}
                  max={financingConfig.maxTermMonths}
                  step={financingConfig.termStepMonths}
                  value={plazo}
                  onChange={(e) => setPlazo(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-orange"
                />
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-warm-200 pt-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-ink/50">
                    Cuota mensual
                  </p>
                  <p className="font-heading text-2xl font-extrabold text-brand-orange">
                    {formatPrice(monthly)}/mes
                  </p>
                </div>
                <div className="text-right text-[11px] text-brand-ink/50">
                  <p>Importe a financiar {formatPrice(amountToFinance)}</p>
                  <p>Total a devolver {formatPrice(totalToRepay)}</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappHref}
              target={links.whatsapp ? "_blank" : undefined}
              rel={links.whatsapp ? "noopener noreferrer" : undefined}
              className="mt-4 block rounded-full bg-brand-orange py-3 text-center font-bold text-white transition hover:brightness-110"
            >
              Me interesa · WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-warm-200 p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
            Ficha técnica
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:max-w-md">
            {[
              ["Marca", vehicle.brand],
              ["Año", String(vehicle.year)],
              ["Kilómetros", formatKm(vehicle.km)],
              ["Combustible", vehicle.fuel],
              ["Cambio", vehicle.transmission],
              vehicle.engine ? ["Motor", vehicle.engine] : null,
              vehicle.powerCv ? ["Potencia", `${vehicle.powerCv} CV`] : null,
              vehicle.bodyConfig ? ["Carrocería", vehicle.bodyConfig] : null,
              vehicle.seats ? ["Plazas", String(vehicle.seats)] : null,
              vehicle.ecoLabel ? ["Etiqueta medioambiental", vehicle.ecoLabel] : null,
              ["Garantía", `${vehicle.warrantyMonths} meses`],
            ]
              .filter((row): row is [string, string] => row !== null)
              .map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-warm-100 py-1.5 text-sm"
              >
                <dt className="text-brand-ink/60">{label}</dt>
                <dd className="font-semibold text-brand-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {vehicle.equipment.length > 0 && (
            <>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-brand-ink/50">
                Equipamiento
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {vehicle.equipment.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-warm-100 px-3 py-1 text-xs font-semibold text-brand-ink/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 rounded-2xl bg-warm-50 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
              Incluido en el precio
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-3 text-sm text-brand-ink sm:grid-cols-2">
              {includedInPrice.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
