"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-warm-50/5 border border-warm-50/10 p-8"
      >
        <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
          Panel Flexemcar
        </h1>
        <p className="mt-1 text-sm text-warm-50/60">Acceso solo para administradores.</p>

        <label className="mt-6 block text-sm font-semibold text-warm-50/80">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-dark-900 border border-warm-50/10 px-3 py-2 text-warm-50 outline-none focus:border-brand-orange"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-warm-50/80">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-dark-900 border border-warm-50/10 px-3 py-2 text-warm-50 outline-none focus:border-brand-orange"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-brand-orange px-5 py-2.5 font-bold text-white hover:brightness-110 transition disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
