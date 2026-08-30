import { createVehicleAction } from "@/app/admin/actions";
import VehicleForm from "@/app/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
        Nuevo vehículo
      </h1>
      <div className="mt-6">
        <VehicleForm
          action={createVehicleAction}
          submitLabel="Crear vehículo"
          photosLabel="Fotos (la primera será la portada)"
        />
      </div>
    </div>
  );
}
