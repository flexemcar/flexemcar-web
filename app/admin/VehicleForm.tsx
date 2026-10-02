"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { compressImage, formatMb, MAX_PHOTOS_BYTES } from "@/app/admin/compressImage";
import {
  brandOptions,
  ecoLabelOptions,
  equipmentOptions,
  etaUnits,
  formatEta,
  fuelOptions,
  parseEta,
  statusLabels,
  transmissionOptions,
  vehicleTypeOptions,
  type VehicleStatus,
} from "@/app/lib/vehicles";

type Initial = {
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  transmission: string;
  price: number | null;
  cashPrice: number | null;
  warrantyMonths: number;
  equipment: string[];
  status: VehicleStatus;
  description: string | null;
  engine: string | null;
  powerCv: number | null;
  bodyConfig: string | null;
  seats: number | null;
  ecoLabel: string | null;
  vehicleType: string | null;
  upcoming: boolean;
  eta: string | null;
};

export default function VehicleForm({
  action,
  initial,
  submitLabel,
  photosLabel,
}: {
  action: (formData: FormData) => void;
  initial?: Initial;
  submitLabel: string;
  photosLabel: string;
}) {
  const [upcoming, setUpcoming] = useState(initial?.upcoming ?? false);
  const initialEta = parseEta(initial?.eta ?? null);
  const [etaAmount, setEtaAmount] = useState(String(initialEta?.amount ?? 2));
  const [etaUnit, setEtaUnit] = useState<string>(initialEta?.unit ?? "semanas");
  const [photos, setPhotos] = useState<File[]>([]);
  const [preparingPhotos, setPreparingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photosBytes = photos.reduce((sum, f) => sum + f.size, 0);
  const photosTooBig = photosBytes > MAX_PHOTOS_BYTES;

  async function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setError(null);
    setPreparingPhotos(true);
    try {
      setPhotos(await Promise.all(files.map((f) => compressImage(f))));
    } finally {
      setPreparingPhotos(false);
    }
  }

  // Validacion en onSubmit (antes de la accion) para que, si algo falta, no se
  // envie nada y no se borre lo que ya esta escrito en el formulario.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const price = String(data.get("price") ?? "").trim();
    const cashPrice = String(data.get("cash_price") ?? "").trim();
    let message: string | null = null;
    if (!price && !cashPrice) {
      message = "Indica al menos un precio (financiado o al contado).";
    } else if (preparingPhotos) {
      message = "Espera un momento: las fotos aún se están preparando.";
    } else if (photosTooBig) {
      message = `Las fotos pesan ${formatMb(photosBytes)} y el máximo por guardado es ${formatMb(MAX_PHOTOS_BYTES)}. Elige menos fotos ahora y añade el resto después desde «Editar».`;
    }
    if (message) {
      e.preventDefault();
      setError(message);
    } else {
      setError(null);
    }
  }

  // Se envian las fotos ya comprimidas en lugar de las originales del input.
  async function submitAction(formData: FormData) {
    formData.delete("photos");
    photos.forEach((f) => formData.append("photos", f));
    await action(formData);
  }

  return (
    <form action={submitAction} onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="rounded-xl bg-dark-900 border border-warm-50/10 p-3">
        <p className="text-sm font-semibold text-warm-50/80">¿Dónde sale en la web?</p>
        <div className="mt-2 flex flex-wrap items-stretch gap-2">
          <div role="radiogroup" className="grid flex-1 grid-cols-2 gap-2 min-w-[240px]">
            {[
              { value: false, label: "En stock", hint: "Ya está en la campa" },
              { value: true, label: "Próxima entrega", hint: "Aún no ha llegado" },
            ].map((tab) => {
              const active = upcoming === tab.value;
              return (
                <label
                  key={tab.label}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-center transition ${
                    active
                      ? "border-brand-orange bg-brand-orange text-white"
                      : "border-warm-50/10 text-warm-50/70 hover:border-brand-orange/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="upcoming"
                    value={tab.value ? "on" : ""}
                    checked={active}
                    onChange={() => setUpcoming(tab.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-bold">{tab.label}</span>
                  <span className="block text-xs opacity-80">{tab.hint}</span>
                </label>
              );
            })}
          </div>

          {upcoming && (
            <div className="flex items-center gap-2 rounded-lg border border-brand-orange/50 px-3 py-2 text-sm font-semibold text-warm-50/80">
              <span className="whitespace-nowrap">Llega en</span>
              <input
                type="number"
                name="eta_amount"
                min={1}
                max={99}
                required
                value={etaAmount}
                onChange={(e) => setEtaAmount(e.target.value)}
                aria-label="Cantidad"
                className="w-14 rounded-md bg-dark-950 border border-warm-50/10 px-2 py-1 text-warm-50 outline-none focus:border-brand-orange"
              />
              <select
                name="eta_unit"
                value={etaUnit}
                onChange={(e) => setEtaUnit(e.target.value)}
                aria-label="Unidad"
                className="rounded-md bg-dark-950 border border-warm-50/10 px-2 py-1 text-warm-50 outline-none focus:border-brand-orange"
              >
                {etaUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {Number(etaAmount) === 1 ? u.singular : u.plural}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {upcoming && (
          <p className="mt-2 text-xs text-warm-50/60">
            En la web saldrá «{formatEta(Number(etaAmount), etaUnit) ?? "…"}» dentro de
            «Próximas entregas», no en el stock. Cuando llegue, cámbialo a «En stock».
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Marca">
          <input
            name="brand"
            required
            list="brand-options"
            defaultValue={initial?.brand}
            className={inputClass}
          />
          <datalist id="brand-options">
            {brandOptions.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </Field>
        <Field label="Modelo">
          <input name="model" required defaultValue={initial?.model} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Año">
          <input
            type="number"
            name="year"
            required
            defaultValue={initial?.year}
            className={inputClass}
          />
        </Field>
        <Field label="Kilómetros">
          <input
            type="number"
            name="km"
            required
            defaultValue={initial?.km}
            className={inputClass}
          />
        </Field>
        <Field label="Combustible">
          <select name="fuel" defaultValue={initial?.fuel ?? fuelOptions[0]} className={inputClass}>
            {fuelOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Precio financiado (€, opcional)">
          <input
            type="number"
            name="price"
            defaultValue={initial?.price ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Precio al contado (€, opcional si hay financiado)">
          <input
            type="number"
            name="cash_price"
            defaultValue={initial?.cashPrice ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Garantía (meses)">
          <input
            type="number"
            name="warranty_months"
            required
            defaultValue={initial?.warrantyMonths ?? 12}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Cambio">
          <select
            name="transmission"
            defaultValue={initial?.transmission ?? transmissionOptions[0]}
            className={inputClass}
          >
            {transmissionOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select
            name="status"
            defaultValue={initial?.status ?? "available"}
            className={inputClass}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Etiqueta medioambiental (opcional)">
          <select
            name="eco_label"
            defaultValue={initial?.ecoLabel ?? ""}
            className={inputClass}
          >
            {ecoLabelOptions.map((label) => (
              <option key={label} value={label}>
                {label || "Sin especificar"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Tipo de vehículo (opcional)">
          <select
            name="vehicle_type"
            defaultValue={initial?.vehicleType ?? ""}
            className={inputClass}
          >
            <option value="">Sin especificar</option>
            {vehicleTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tamaño / carrocería (opcional)">
          <input
            type="text"
            name="body_config"
            placeholder="Ej. L3H2"
            defaultValue={initial?.bodyConfig ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Plazas (opcional)">
          <input
            type="number"
            name="seats"
            defaultValue={initial?.seats ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Motor (opcional)">
          <input
            type="text"
            name="engine"
            placeholder="Ej. 2.3 dCi"
            defaultValue={initial?.engine ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Potencia CV (opcional)">
          <input
            type="number"
            name="power_cv"
            defaultValue={initial?.powerCv ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div>
        <p className="text-sm font-semibold text-warm-50/80">Equipamiento</p>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 rounded-lg bg-dark-900 border border-warm-50/10 p-3">
          {equipmentOptions.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-warm-50/80">
              <input
                type="checkbox"
                name="equipment"
                value={item}
                defaultChecked={initial?.equipment?.includes(item)}
                className="accent-brand-orange"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <Field label="Descripción (opcional)">
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label={photosLabel}>
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          onChange={handlePhotosChange}
          className="block w-full text-sm text-warm-50/80 file:mr-3 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
        />
      </Field>
      {preparingPhotos && <p className="text-sm text-warm-50/70">Preparando fotos…</p>}
      {!preparingPhotos && photos.length > 0 && (
        <p className={`text-sm ${photosTooBig ? "font-semibold text-red-400" : "text-warm-50/70"}`}>
          {photos.length} {photos.length === 1 ? "foto lista" : "fotos listas"} ·{" "}
          {formatMb(photosBytes)}
          {photosTooBig &&
            ` · Demasiado para un solo guardado (máximo ${formatMb(MAX_PHOTOS_BYTES)}): elige menos y añade el resto después desde «Editar».`}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
          {error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-orange px-6 py-2.5 font-bold text-white hover:brightness-110 transition disabled:opacity-60 disabled:hover:brightness-100"
    >
      {pending ? "Guardando… (no cierres la página)" : label}
    </button>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg bg-dark-900 border border-warm-50/10 px-3 py-2 text-warm-50 outline-none focus:border-brand-orange";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-warm-50/80">
      {label}
      {children}
    </label>
  );
}
