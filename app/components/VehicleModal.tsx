"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { links } from "@/app/lib/links";
import { getDisplayPrice, sizeAndPower, statusLabels, type Vehicle } from "@/app/lib/vehicles";

function formatPrice(n: number) {
  return Math.round(n).toLocaleString("es-ES") + " €";
}

// Distancia minima (px) para que un deslizamiento cambie de foto.
const SWIPE_MIN_PX = 50;

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
  const photoCount = vehicle.photos.length;
  // Deslizar la foto: sigue al dedo/raton mientras se arrastra y al soltar
  // pasa a la siguiente o la anterior (en bucle).
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Paso relativo (+1 / -1) a partir de la foto actual, en bucle. Con updater
  // para que varios clics seguidos sumen bien.
  function stepPhoto(delta: number) {
    if (photoCount === 0) return;
    setActivePhoto((a) => (((a + delta) % photoCount) + photoCount) % photoCount);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (photoCount < 2 || (e.target as HTMLElement).closest("button")) return;
    dragStartX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    setDragX(e.clientX - dragStartX.current);
  }

  function handlePointerEnd() {
    if (dragStartX.current === null) return;
    dragStartX.current = null;
    setDragging(false);
    if (dragX <= -SWIPE_MIN_PX) stepPhoto(1);
    else if (dragX >= SWIPE_MIN_PX) stepPhoto(-1);
    setDragX(0);
  }

  useEffect(() => {
    // Solo desplaza la fila de miniaturas en horizontal (scrollIntoView
    // moveria tambien la ficha en vertical).
    const thumb = thumbRefs.current[activePhoto];
    const strip = thumb?.parentElement;
    if (!thumb || !strip) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activePhoto]);

  const displayPrice = getDisplayPrice(vehicle);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (photoCount > 1 && e.key === "ArrowRight") setActivePhoto((x) => (x + 1) % photoCount);
      if (photoCount > 1 && e.key === "ArrowLeft")
        setActivePhoto((x) => (x - 1 + photoCount) % photoCount);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, photoCount]);

  const whatsappMessage = `Hola, me interesa la ${vehicle.brand} ${vehicle.model} (${vehicle.year}, ${formatKm(
    vehicle.km
  )}) por ${formatPrice(displayPrice.amount)}${vehicle.upcoming ? ", que está en camino" : ""}.`;
  const whatsappHref = links.whatsapp
    ? `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const includedInPrice = [
    "Revisión completa y puesta a punto",
    "ITV recién pasada",
    "Cambio de nombre y gestión",
    "Garantía hasta 2 años (contacta con tu comercial para más información)",
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
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              className={`relative aspect-[4/3] min-h-[240px] shrink-0 overflow-hidden bg-gradient-to-br from-warm-200 to-brand-ink/20 touch-pan-y select-none ${
                photoCount > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
              }`}
            >
              <div
                className={`absolute inset-0 flex ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
                style={{ transform: `translateX(calc(${-activePhoto * 100}% + ${dragX}px))` }}
              >
                {vehicle.photos.map((photo, i) => (
                  <div key={photo.id} className="relative h-full w-full shrink-0">
                    <Image
                      src={photo.url}
                      alt={`${vehicle.brand} ${vehicle.model} · foto ${i + 1}`}
                      fill
                      draggable={false}
                      priority={i === 0}
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ))}
              </div>

              {photoCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => stepPhoto(-1)}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/85 text-brand-ink shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white hover:text-brand-orange active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => stepPhoto(1)}
                    aria-label="Foto siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/85 text-brand-ink shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white hover:text-brand-orange active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-bold text-white">
                    {activePhoto + 1} / {photoCount}
                  </span>
                </>
              )}
              <span
                className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold text-white ${
                  vehicle.status === "reserved" ? "bg-brand-ink" : "bg-brand-orange"
                }`}
              >
                {vehicle.upcoming && vehicle.status === "available"
                  ? "Próximamente"
                  : statusLabels[vehicle.status]}
              </span>
            </div>
            {vehicle.photos.length > 1 && (
              <div className="relative flex shrink-0 gap-2 overflow-x-auto p-3">
                {vehicle.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
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
            {vehicle.upcoming && (
              <p className="mt-1 text-sm font-semibold text-brand-orange">
                En camino{vehicle.eta ? ` · ${vehicle.eta}` : ""}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                String(vehicle.year),
                formatKm(vehicle.km),
                vehicle.fuel,
                vehicle.transmission,
                ...sizeAndPower(vehicle),
              ].map(
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
          {vehicle.description && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-wide text-brand-ink/50">
                Descripción
              </h3>
              {/* pre-line respeta los saltos de parrafo que se escriben en el panel */}
              <p className="mt-3 mb-8 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-brand-ink/80">
                {vehicle.description}
              </p>
            </>
          )}

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
              vehicle.bodyConfig ? ["Tamaño", vehicle.bodyConfig] : null,
              vehicle.seats ? ["Plazas", String(vehicle.seats)] : null,
              vehicle.ecoLabel ? ["Etiqueta medioambiental", vehicle.ecoLabel] : null,
              ["Garantía", "Hasta 2 años"],
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
