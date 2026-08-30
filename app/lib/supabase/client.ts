import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para Client Components. Usa la clave publica (anon):
// las tablas tienen RLS activado, asi que este cliente solo puede leer datos
// publicos o escribir si el usuario ha iniciado sesion (ver migracion SQL).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
