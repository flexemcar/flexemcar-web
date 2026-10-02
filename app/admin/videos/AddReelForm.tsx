"use client";

import { useActionState, useEffect, useRef } from "react";
import { addReelAction, type ReelFormState } from "@/app/admin/reelActions";

const initialState: ReelFormState = { error: null, ok: false };

export default function AddReelForm() {
  const [state, formAction, pending] = useActionState(addReelAction, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok && inputRef.current) inputRef.current.value = "";
  }, [state]);

  return (
    <form action={formAction} className="max-w-xl">
      <label className="block text-sm font-semibold text-warm-50/80">
        Enlace del vídeo de TikTok
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            ref={inputRef}
            name="video_url"
            type="text"
            required
            placeholder="https://www.tiktok.com/@flexemcar/video/..."
            className="w-full rounded-lg bg-dark-900 border border-warm-50/10 px-3 py-2 text-warm-50 outline-none focus:border-brand-orange"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition disabled:opacity-60"
          >
            {pending ? "Comprobando…" : "Añadir vídeo"}
          </button>
        </div>
      </label>
      <p className="mt-2 text-xs text-warm-50/60">
        En TikTok: abre el vídeo → «Compartir» → «Copiar enlace», y pégalo aquí. Saldrá el
        primero en la web.
      </p>
      {state.error && (
        <p role="alert" className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="mt-3 text-sm font-semibold text-green-400">Vídeo añadido. Ya sale en la web.</p>
      )}
    </form>
  );
}
