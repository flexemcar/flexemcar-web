"use client";

import Image from "next/image";
import { useState } from "react";
import { links } from "@/app/lib/links";
import { getDisplayPrice, sizeAndPower, type Vehicle } from "@/app/lib/vehicles";
import VehicleModal from "@/app/components/VehicleModal";

function notifyHref(v: Vehicle) {
  if (!links.whatsapp) return "#";
  const text = `Hola, me interesa que me aviséis cuando llegue la ${v.brand} ${v.model}`;
  return `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function UpcomingGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [selected, setSelected] = useState<Vehicle | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(v);
              }
            }}
            className="group cursor-pointer rounded-2xl border-2 border-dashed border-brand-orange/40 bg-warm-50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-orange"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-200 to-brand-ink/20 overflow-hidden">
              {v.photos[0] && (
                <Image
                  src={v.photos[0].url}
                  alt={`${v.brand} ${v.model}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
              <span className="absolute top-3 left-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                Próximamente
              </span>
              {v.status === "reserved" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="-rotate-6 rounded border-2 border-white px-4 py-1 font-heading uppercase font-extrabold tracking-wide text-white text-lg">
                    Reservado
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-heading uppercase font-extrabold text-lg text-brand-ink">
                {v.brand} {v.model}
              </h3>
              {v.eta && <p className="mt-1 text-sm font-semibold text-brand-orange">{v.eta}</p>}
              <p className="mt-1 text-sm text-brand-ink/60">
                {v.year} · {v.km.toLocaleString("es-ES")} km · {v.fuel}
              </p>
              {sizeAndPower(v).length > 0 && (
                <p className="mt-0.5 text-sm font-semibold text-brand-ink/80">{sizeAndPower(v).join(" · ")}</p>
              )}
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-heading font-extrabold text-xl text-brand-orange">
                  {getDisplayPrice(v).amount.toLocaleString("es-ES")} €
                </span>
                <span className="text-sm font-bold text-brand-ink underline underline-offset-2 transition-colors group-hover:text-brand-orange">
                  Ver ficha
                </span>
              </div>
              <a
                href={notifyHref(v)}
                target={links.whatsapp ? "_blank" : undefined}
                rel={links.whatsapp ? "noopener noreferrer" : undefined}
                onClick={(e) => e.stopPropagation()}
                className="mt-3 inline-block rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
              >
                Avísame cuando llegue
              </a>
            </div>
          </div>
        ))}
      </div>

      {selected && <VehicleModal vehicle={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
