-- Permisos para la clave secreta (rol service_role), usada solo desde el
-- ordenador de Adrian para dar de alta vehiculos y fotos sin pasar por el
-- panel. El proyecto tiene desactivado "Automatically expose new tables",
-- asi que estos permisos no se conceden solos. service_role ya se salta RLS;
-- esto solo le da acceso a nivel de tabla.
-- Ejecutar en el SQL Editor de Supabase. Se puede ejecutar varias veces.

grant usage on schema public to service_role;
grant select, insert, update, delete
  on public.vehicles, public.vehicle_photos, public.reels
  to service_role;
