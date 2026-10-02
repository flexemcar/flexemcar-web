-- Videos de TikTok de la seccion "Dia a dia" de la home, gestionados desde el
-- panel (/admin/videos) en vez de estar escritos en el codigo. Se guarda solo
-- el enlace: la miniatura y el texto se piden a TikTok en vivo (oEmbed).
-- Lectura publica, escritura solo administradores (is_admin() de 0005).
-- Incluye los 10 videos que habia en app/data/reels.ts.
-- Ejecutar entero en el SQL Editor de Supabase despues de 0006. Se puede ejecutar varias veces.

create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  video_url text not null unique,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.reels enable row level security;

drop policy if exists "reels_public_read" on public.reels;
create policy "reels_public_read" on public.reels
  for select using (true);

drop policy if exists "reels_admin_write" on public.reels;
create policy "reels_admin_write" on public.reels
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.reels to anon, authenticated;
grant insert, update, delete on public.reels to authenticated;

insert into public.reels (video_url, position) values
  ('https://www.tiktok.com/@flexemcar/video/7679028117096254753', 0),
  ('https://www.tiktok.com/@flexemcar/video/7678741195236986145', 1),
  ('https://www.tiktok.com/@flexemcar/video/7678660953638030624', 2),
  ('https://www.tiktok.com/@flexemcar/video/7678390368164908320', 3),
  ('https://www.tiktok.com/@flexemcar/video/7677519027475860769', 4),
  ('https://www.tiktok.com/@flexemcar/video/7674666840487906592', 5),
  ('https://www.tiktok.com/@flexemcar/video/7674633341680749856', 6),
  ('https://www.tiktok.com/@flexemcar/video/7673896192169807137', 7),
  ('https://www.tiktok.com/@flexemcar/video/7673192556695538976', 8),
  ('https://www.tiktok.com/@flexemcar/video/7673164693531266337', 9)
on conflict (video_url) do nothing;

-- Comprobacion: deben salir los 10 videos en orden.
select position, video_url from public.reels order by position;
