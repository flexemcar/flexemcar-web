"use client";

import { useTransition } from "react";
import { deleteVehicleAction } from "@/app/admin/actions";

export default function DeleteVehicleButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`¿Eliminar "${label}"? Esta acción no se puede deshacer.`)) return;
        startTransition(() => {
          deleteVehicleAction(id);
        });
      }}
      className="text-sm font-semibold text-red-400 hover:text-red-300 transition disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
