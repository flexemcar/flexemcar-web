"use client";

import { fuelOptions, statusLabels, type VehicleStatus } from "@/app/lib/vehicles";

type Initial = {
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  price: number;
  status: VehicleStatus;
  description: string | null;
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
          <input name="brand" required defaultValue={initial?.brand} className={inputClass} />
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
        <Field label="Precio (€)">
          <input
            type="number"
            name="price"
            required
            defaultValue={initial?.price}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Combustible">
          <select name="fuel" defaultValue={initial?.fuel ?? fuelOptions[0]} className={inputClass}>
            {fuelOptions.map((f) => (
              <option key={f} value={f}>
                {f}
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
