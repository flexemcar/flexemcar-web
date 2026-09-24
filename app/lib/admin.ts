import type { User } from "@supabase/supabase-js";

// Correos con acceso al panel. La barrera real esta en la base de datos
// (tabla public.admins y funcion is_admin(), migracion 0005); esto es una
// segunda capa para que el panel ni siquiera se abra a otros usuarios.
const ADMIN_EMAILS = ["info@flexemcar.com"];

export function isAdminUser(user: User | null | undefined): boolean {
  const email = user?.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.includes(email);
}
