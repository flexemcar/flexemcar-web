import { type NextRequest } from "next/server";
import { updateSession } from "@/app/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

// Solo /admin necesita sesion: si Supabase estuviera mal configurado o caido,
// el resto de la web publica no debe verse afectado.
export const config = {
  matcher: "/admin/:path*",
};
