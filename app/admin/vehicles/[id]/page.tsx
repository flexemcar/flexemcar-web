import { notFound } from "next/navigation";
import { updateVehicleAction } from "@/app/admin/actions";
import { getVehicleById } from "@/app/lib/getVehicles";
import VehicleForm from "@/app/admin/VehicleForm";
import PhotoManager from "@/app/admin/PhotoManager";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const boundAction = updateVehicleAction.bind(null, vehicle.id);

  return (
    <div className="px-4 sm:px-6 py-8">
      <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
        {vehicle.brand} {vehicle.model}
      </h1>

      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-warm-50/60">
          Fotos
        </h2>
        <div className="mt-3">
          <PhotoManager vehicleId={vehicle.id} initialPhotos={vehicle.photos} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-warm-50/60">
          Datos del vehículo
        </h2>
        <div className="mt-3">
          <VehicleForm
            action={boundAction}
            initial={vehicle}
            submitLabel="Guardar cambios"
            photosLabel="Añadir más fotos"
          />
        </div>
      </section>
    </div>
  );
}
