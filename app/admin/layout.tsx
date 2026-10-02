import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { signOutAction } from "@/app/admin/actions";
import { isAdminUser } from "@/app/lib/admin";

export const metadata: Metadata = {
  title: "Panel Flexemcar",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-dark-950">
      {isAdminUser(user) && (
        <header className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-4 border-b border-warm-50/10">
          <Link
            href="/admin"
            className="font-heading uppercase font-extrabold text-warm-50"
          >
            Panel Flexemcar
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <Link href="/admin" className="text-warm-50/70 hover:text-brand-orange transition">
              Vehículos
            </Link>
            <Link href="/admin/videos" className="text-warm-50/70 hover:text-brand-orange transition">
              Vídeos
            </Link>
            <Link href="/" className="text-warm-50/70 hover:text-brand-orange transition">
              Ver web
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-warm-50/70 hover:text-brand-orange transition"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
