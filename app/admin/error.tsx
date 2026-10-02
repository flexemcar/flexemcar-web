"use client";

import Link from "next/link";
import { useEffect } from "react";

// Pantalla de error del panel: si algo falla al guardar (conexion, Supabase...)
// se ve esto en lugar de la pagina generica de Next.
export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-4 sm:px-6 py-12 max-w-xl">
      <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
        No se ha podido completar
      </h1>
      <p className="mt-3 text-warm-50/70">
        Algo ha fallado al guardar o al cargar el panel. Comprueba la conexión a
        internet y vuelve a intentarlo. Si estabas subiendo fotos, prueba con menos
        fotos a la vez.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition"
        >
          Reintentar
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-warm-50/20 px-5 py-2 text-sm font-bold text-warm-50 hover:border-brand-orange transition"
        >
          Volver al listado
        </Link>
      </div>
    </div>
  );
}
