import Image from "next/image";
import Link from "next/link";
import { getVehicles } from "@/app/lib/getVehicles";
import { getDisplayPrice, statusLabels } from "@/app/lib/vehicles";
import DeleteVehicleButton from "@/app/admin/DeleteVehicleButton";

const statusStyles: Record<string, string> = {
  available: "bg-green-500/20 text-green-400",
  reserved: "bg-brand-orange/20 text-brand-orange",
  sold: "bg-warm-50/10 text-warm-50/50",
};

export default async function AdminPage() {
  const vehicles = await getVehicles();

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
          Vehículos ({vehicles.length})
        </h1>
        <Link
          href="/admin/vehicles/new"
          className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
        >
          + Nuevo vehículo
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <p className="mt-8 text-warm-50/60">
          Todavía no hay ningún vehículo. Añade el primero con el botón de arriba.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-warm-50/5 border border-warm-50/10 p-3"
            >
              <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-dark-900">
                {v.photos[0] && (
                  <Image
                    src={v.photos[0].url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-heading uppercase font-extrabold text-warm-50 sm:truncate">
                  {v.brand} {v.model}
                </p>
                <p className="text-sm text-warm-50/60 flex flex-wrap gap-x-1">
                  <span>{v.year}</span>
                  <span className="whitespace-nowrap">
                    · {v.km.toLocaleString("es-ES")} km
                  </span>
                  <span className="whitespace-nowrap">
                    · {getDisplayPrice(v).amount.toLocaleString("es-ES")} €
                  </span>
                </p>
              </div>

              <div className="flex w-full items-center gap-4 border-t border-warm-50/10 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[v.status]}`}
                >
                  {statusLabels[v.status]}
                </span>

                <Link
                  href={`/admin/vehicles/${v.id}`}
                  className="ml-auto text-sm font-semibold text-warm-50/80 hover:text-brand-orange transition sm:ml-0"
                >
                  Editar
                </Link>
                <DeleteVehicleButton id={v.id} label={`${v.brand} ${v.model}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
