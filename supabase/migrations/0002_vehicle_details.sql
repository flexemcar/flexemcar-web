-- Amplia la ficha de vehiculo con los campos que necesita la pagina de detalle:
-- transmision, precio al contado (opcional), garantia y equipamiento.
-- Ejecutar en el SQL Editor de Supabase (proyecto flexemcar-web) despues de 0001_vehicles.sql.

alter table public.vehicles
  add column if not exists transmission text not null default 'Manual',
  add column if not exists cash_price numeric,
  add column if not exists warranty_months int not null default 12,
  add column if not exists equipment text[] not null default '{}';
