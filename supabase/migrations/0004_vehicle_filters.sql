-- Añade el tipo/estilo de carroceria (categoria cerrada, para poder
-- filtrar por el en la web publica: Caja abierta / Carrozado / Mixto /
-- Furgón cerrado), distinto de `body_config` que sigue siendo texto libre
-- tipo "L3H2". No hace falta repetir los GRANT de 0001: son a nivel de
-- tabla y ya cubren las columnas nuevas.
-- Ejecutar en el SQL Editor de Supabase (proyecto flexemcar-web) despues de 0003_vehicle_specs.sql.

alter table public.vehicles
  add column if not exists vehicle_type text;
