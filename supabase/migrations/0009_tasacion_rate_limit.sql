-- Limite antispam persistente del formulario "Pide tu tasacion gratis".
-- Antes el limite vivia en la memoria de cada servidor de Vercel y se perdia
-- al reiniciarse. Ahora cada envio valido deja una marca (huella SHA-256 de la
-- IP, nunca la IP en claro) y la funcion dice si esa huella ya ha enviado
-- demasiadas solicitudes en los ultimos 10 minutos.
-- La tabla no se puede leer ni escribir desde fuera: solo a traves de la
-- funcion (security definer), que la web llama con la clave publica.
-- Ejecutar entero en el SQL Editor de Supabase despues de 0008. Se puede ejecutar varias veces.

create table if not exists public.tasacion_hits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists tasacion_hits_ip_time on public.tasacion_hits (ip_hash, created_at);

alter table public.tasacion_hits enable row level security;
revoke all on public.tasacion_hits from anon, authenticated;

create or replace function public.tasacion_rate_ok(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
begin
  if p_ip_hash is null or length(p_ip_hash) <> 64 then
    return false;
  end if;

  -- Limpieza: las marcas de mas de un dia ya no sirven para nada.
  delete from public.tasacion_hits where created_at < now() - interval '1 day';

  select count(*) into recent
  from public.tasacion_hits
  where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes';

  if recent >= 5 then
    return false;
  end if;

  insert into public.tasacion_hits (ip_hash) values (p_ip_hash);
  return true;
end;
$$;

revoke all on function public.tasacion_rate_ok(text) from public;
grant execute on function public.tasacion_rate_ok(text) to anon, authenticated;
