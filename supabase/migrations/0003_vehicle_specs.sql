-- Amplia la ficha de vehiculo con specs que traen los anuncios reales de la
-- empresa (motor, potencia, carroceria/configuracion, plazas, etiqueta
-- medioambiental DGT) y hace opcional el precio financiado: muchos anuncios
-- solo dan un precio, que se trata como precio al contado.
-- Ejecutar en el SQL Editor de Supabase (proyecto flexemcar-web) despues de 0002_vehicle_details.sql.

alter table public.vehicles
  add column if not exists engine text,
  add column if not exists power_cv int,
  add column if not exists body_config text,
  add column if not exists seats int,
  add column if not exists eco_label text;

alter table public.vehicles
  alter column price drop not null;

alter table public.vehicles
  drop constraint if exists vehicles_price_or_cash_price_check;
alter table public.vehicles
  add constraint vehicles_price_or_cash_price_check
  check (price is not null or cash_price is not null);
