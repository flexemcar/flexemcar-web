"use client";

import {
  brandOptions,
  ecoLabelOptions,
  equipmentOptions,
  fuelOptions,
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
  return (
    <form action={action} className="space-y-4 max-w-xl">
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
        <Field label="Carrocería (opcional)">
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
          className="block w-full text-sm text-warm-50/80 file:mr-3 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
        />
      </Field>

      <button
        type="submit"
        className="rounded-full bg-brand-orange px-6 py-2.5 font-bold text-white hover:brightness-110 transition"
      >
        {submitLabel}
      </button>
    </form>
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
