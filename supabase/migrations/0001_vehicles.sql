-- Esquema para el inventario de vehiculos y el panel de administracion de Flexemcar.
-- Ejecutar entero en el SQL Editor de Supabase (proyecto flexemcar-web).

create extension if not exists "pgcrypto";

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year int not null,
  km int not null,
  fuel text not null,
  price numeric not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists vehicle_photos_vehicle_id_idx on public.vehicle_photos (vehicle_id, position);

-- Mantiene updated_at al dia en cada cambio.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

-- RLS: lectura publica (la web la necesita sin sesion), escritura solo para
-- quien haya iniciado sesion (el unico usuario de Auth sera el administrador,
-- ya que no hay registro publico en la app).
alter table public.vehicles enable row level security;
alter table public.vehicle_photos enable row level security;

drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read" on public.vehicles
  for select using (true);

drop policy if exists "vehicles_admin_write" on public.vehicles;
create policy "vehicles_admin_write" on public.vehicles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "vehicle_photos_public_read" on public.vehicle_photos;
create policy "vehicle_photos_public_read" on public.vehicle_photos
  for select using (true);

drop policy if exists "vehicle_photos_admin_write" on public.vehicle_photos;
create policy "vehicle_photos_admin_write" on public.vehicle_photos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage: bucket publico para las fotos de vehiculos.
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

drop policy if exists "vehicle_photos_storage_public_read" on storage.objects;
create policy "vehicle_photos_storage_public_read" on storage.objects
  for select using (bucket_id = 'vehicle-photos');

drop policy if exists "vehicle_photos_storage_admin_write" on storage.objects;
create policy "vehicle_photos_storage_admin_write" on storage.objects
  for all using (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated')
  with check (bucket_id = 'vehicle-photos' and auth.role() = 'authenticated');
