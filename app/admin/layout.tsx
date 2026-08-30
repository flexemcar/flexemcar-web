import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { signOutAction } from "@/app/admin/actions";

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
      {user && (
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-warm-50/10">
          <Link
            href="/admin"
            className="font-heading uppercase font-extrabold text-warm-50"
          >
            Panel Flexemcar
          </Link>
          <div className="flex items-center gap-4 text-sm">
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
