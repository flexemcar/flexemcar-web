-- Solo los administradores pueden escribir.
--
-- Antes, las politicas de 0001 dejaban escribir a CUALQUIER usuario con
-- sesion (auth.role() = 'authenticated'). Con el registro publico activado,
-- cualquiera podia crearse una cuenta con la clave publica y borrar o cambiar
-- vehiculos y fotos. El registro ya esta desactivado en Supabase (2026-09-24);
-- esto cierra el hueco tambien en la base de datos, por si alguien lo
-- reactiva por error.
--
-- Ejecutar entero en el SQL Editor de Supabase. Se puede ejecutar varias veces.

-- 1. Lista de administradores (solo accesible desde el SQL Editor).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

insert into public.admins (user_id)
select id from auth.users where lower(email) = 'info@flexemcar.com'
on conflict (user_id) do nothing;

-- 2. Funcion que dice si quien hace la peticion es administrador.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Sustituir las politicas de escritura.
drop policy if exists "vehicles_admin_write" on public.vehicles;
create policy "vehicles_admin_write" on public.vehicles
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "vehicle_photos_admin_write" on public.vehicle_photos;
create policy "vehicle_photos_admin_write" on public.vehicle_photos
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "vehicle_photos_storage_admin_write" on storage.objects;
create policy "vehicle_photos_storage_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'vehicle-photos' and (select public.is_admin()))
  with check (bucket_id = 'vehicle-photos' and (select public.is_admin()));

-- 4. Comprobacion: debe salir 1 administrador (info@flexemcar.com).
select u.email, a.created_at as admin_desde,
       (select count(*) from auth.users) as usuarios_totales
from public.admins a join auth.users u on u.id = a.user_id;
