"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { deletePhotoAction, reorderPhotosAction } from "@/app/admin/actions";
import type { VehiclePhoto } from "@/app/lib/vehicles";

export default function PhotoManager({
  vehicleId,
  initialPhotos,
}: {
  vehicleId: string;
  initialPhotos: VehiclePhoto[];
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...photos];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setPhotos(next);
    setDragIndex(null);
    startTransition(() => {
      reorderPhotosAction(vehicleId, next.map((p) => p.id));
    });
  }

  function handleDelete(photo: VehiclePhoto) {
    if (!confirm("¿Eliminar esta foto?")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    startTransition(() => {
      deletePhotoAction(photo.id, photo.storagePath, vehicleId);
    });
  }

  if (photos.length === 0) {
    return <p className="text-sm text-warm-50/50">Todavía no hay fotos.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className="relative aspect-[4/3] rounded-lg overflow-hidden border border-warm-50/10 bg-dark-900 cursor-move"
          style={{ opacity: isPending ? 0.6 : 1 }}
        >
          <Image
            src={photo.url}
            alt=""
            fill
            className="object-cover pointer-events-none"
            sizes="200px"
          />
          {index === 0 && (
            <span className="absolute top-1 left-1 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
              Portada
            </span>
          )}
          <button
            type="button"
            onClick={() => handleDelete(photo)}
            aria-label="Eliminar foto"
            className="absolute top-1 right-1 flex items-center justify-center size-6 rounded-full bg-black/70 text-white hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
