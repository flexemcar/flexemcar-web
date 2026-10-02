-- "Proximas entregas": vehiculos que aun no han llegado a la campa. Se dan de
-- alta igual que el resto desde el panel, marcando la casilla, y la web los
-- enseña en la seccion "Proximas entregas" en vez de en el stock. Cuando
-- llegan, basta con desmarcar la casilla y pasan al stock.
-- `eta` es texto libre ("Llega en 2 semanas", "Mediados de noviembre").
-- Las politicas de 0005 y los GRANT de 0001 son por tabla: cubren las columnas nuevas.
-- Ejecutar en el SQL Editor de Supabase (proyecto flexemcar-web) despues de 0005_admin_only_writes.sql.

alter table public.vehicles
  add column if not exists upcoming boolean not null default false,
  add column if not exists eta text;

-- Comprobacion: deben salir los vehiculos actuales con upcoming = false.
select brand, model, upcoming, eta from public.vehicles order by created_at desc;
