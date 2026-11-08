-- ProTile CZ — gallery_images schema + seed of live photos123 portfolio
-- Project: vmqggaksvweiyhevgebs
-- Idempotent: safe to re-run.

-- ---------------------------------------------------------------------------
-- 1) Table + columns
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text,
  category text not null default 'obklady',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_images
  add column if not exists category text not null default 'obklady';

alter table public.gallery_images
  add column if not exists sort_order int not null default 0;

create index if not exists gallery_images_created_at_idx
  on public.gallery_images (created_at desc);

create index if not exists gallery_images_sort_order_idx
  on public.gallery_images (sort_order asc, created_at desc);

grant usage on schema public to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;
grant insert, update, delete on table public.gallery_images to authenticated;

alter table public.gallery_images enable row level security;

do $$
declare r record;
begin
  for r in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'gallery_images'
  loop
    execute format('drop policy if exists %I on public.gallery_images', r.policyname);
  end loop;
end $$;

create policy "gallery_images_select_public"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

create policy "gallery_images_insert_authenticated"
  on public.gallery_images for insert
  to authenticated
  with check (true);

create policy "gallery_images_update_authenticated"
  on public.gallery_images for update
  to authenticated
  using (true)
  with check (true);

create policy "gallery_images_delete_authenticated"
  on public.gallery_images for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 2) Storage bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 5242880, null)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = null;

drop policy if exists "Public read gallery" on storage.objects;
drop policy if exists "Auth upload gallery" on storage.objects;
drop policy if exists "Auth delete own gallery" on storage.objects;
drop policy if exists "Auth upload gallery loose" on storage.objects;
drop policy if exists "Auth delete gallery" on storage.objects;
drop policy if exists "Auth update gallery" on storage.objects;

create policy "Public read gallery"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Auth upload gallery"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "Auth update gallery"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery');

create policy "Auth delete gallery"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- ---------------------------------------------------------------------------
-- 3) Seed live static portfolio (site-relative paths under /photos123)
-- ---------------------------------------------------------------------------
insert into public.gallery_images (id, storage_path, alt_text, category, sort_order)
values
  ('a1000000-0000-4000-8000-000000000001', '/photos123/p01.jpg', 'Koupelna — béžový velkoformát a vana', 'koupelny', 1),
  ('a1000000-0000-4000-8000-000000000002', '/photos123/p02.jpg', 'Koupelna — sprchová vanička a obklad', 'koupelny', 2),
  ('a1000000-0000-4000-8000-000000000003', '/photos123/p03.jpg', 'WC — šedý velkoformát a Geberit', 'koupelny', 3),
  ('a1000000-0000-4000-8000-000000000004', '/photos123/p04.jpg', 'Koupelna — vana a béžový velkoformát', 'koupelny', 4),
  ('a1000000-0000-4000-8000-000000000005', '/photos123/p05.jpg', 'Koupelna — šedý mramorový velkoformát', 'koupelny', 5),
  ('a1000000-0000-4000-8000-000000000006', '/photos123/p06.jpg', 'Koupelna — šedý kamenný velkoformát', 'koupelny', 6),
  ('a1000000-0000-4000-8000-000000000007', '/photos123/p07.jpg', 'Koupelna — šedý mramor a rozvody', 'koupelny', 7),
  ('a1000000-0000-4000-8000-000000000008', '/photos123/p08.jpg', 'WC — šedý mramor a závěsné WC', 'koupelny', 8),
  ('a1000000-0000-4000-8000-000000000009', '/photos123/p09.jpg', 'Dlažba — chodba s vyrovnávacím systémem', 'dlazby', 9),
  ('a1000000-0000-4000-8000-000000000010', '/photos123/p10.jpg', 'Dlažba — pokládka v dlouhé chodbě', 'dlazby', 10),
  ('a1000000-0000-4000-8000-000000000011', '/photos123/p11.jpg', 'Dlažba — rozpracovaná pokládka', 'dlazby', 11),
  ('a1000000-0000-4000-8000-000000000012', '/photos123/p12.jpg', 'Koupelna — sprcha s lineárním žlabem', 'koupelny', 12),
  ('a1000000-0000-4000-8000-000000000013', '/photos123/p13.jpg', 'Dlažba — hotová šedá podlaha v chodbě', 'dlazby', 13),
  ('a1000000-0000-4000-8000-000000000014', '/photos123/p14.jpg', 'Dlažba — pokládka s nivelačními klíny', 'dlazby', 14),
  ('a1000000-0000-4000-8000-000000000015', '/photos123/p15.jpg', 'Dlažba — pokládka s laserem a křížky', 'dlazby', 15),
  ('a1000000-0000-4000-8000-000000000016', '/photos123/p16.jpg', 'Koupelna — obklad vany velkoformátem', 'koupelny', 16),
  ('a1000000-0000-4000-8000-000000000017', '/photos123/p17.jpg', 'Dlažba — šedá podlaha v chodbě', 'dlazby', 17),
  ('a1000000-0000-4000-8000-000000000018', '/photos123/p18.jpg', 'Sprcha — kout a příprava WC', 'koupelny', 18),
  ('a1000000-0000-4000-8000-000000000019', '/photos123/p19.jpg', 'Koupelna — sprchový kout a WC', 'koupelny', 19),
  ('a1000000-0000-4000-8000-000000000020', '/photos123/p20.jpg', 'Koupelna — vana a kombinovaný obklad', 'koupelny', 20),
  ('a1000000-0000-4000-8000-000000000021', '/photos123/p21.jpg', 'Koupelna — mramorový obklad a dlažba', 'koupelny', 21),
  ('a1000000-0000-4000-8000-000000000022', '/photos123/p22.jpg', 'Koupelna — vana a krémový velkoformát', 'koupelny', 22),
  ('a1000000-0000-4000-8000-000000000023', '/photos123/p23.jpg', 'Koupelna — kamenný velkoformát a WC', 'koupelny', 23),
  ('a1000000-0000-4000-8000-000000000024', '/photos123/p24.jpg', 'WC — velkoformátový obklad a dlažba', 'koupelny', 24),
  ('a1000000-0000-4000-8000-000000000025', '/photos123/p25.jpg', 'WC — příprava na závěsné WC', 'koupelny', 25),
  ('a1000000-0000-4000-8000-000000000026', '/photos123/p26.jpg', 'WC — alcova s podomítkovým systémem', 'koupelny', 26),
  ('a1000000-0000-4000-8000-000000000027', '/photos123/p27.jpg', 'Koupelna — obklad vany mramorem', 'koupelny', 27),
  ('a1000000-0000-4000-8000-000000000028', '/photos123/p28.jpg', 'Koupelna — světlý obklad a tmavá dlažba', 'koupelny', 28),
  ('a1000000-0000-4000-8000-000000000029', '/photos123/p29.jpg', 'WC — velkoformátový obklad', 'koupelny', 29),
  ('a1000000-0000-4000-8000-000000000030', '/photos123/p30.jpg', 'WC — béžovohnědý velkoformát', 'koupelny', 30),
  ('a1000000-0000-4000-8000-000000000031', '/photos123/p31.jpg', 'Sprcha — sprchové kouty v kamenném dekoru', 'koupelny', 31),
  ('a1000000-0000-4000-8000-000000000032', '/photos123/p32.jpg', 'Koupelna — mramorový velkoformát a příčka', 'koupelny', 32),
  ('a1000000-0000-4000-8000-000000000033', '/photos123/p33.jpg', 'WC — mramorový obklad s podomítkou', 'koupelny', 33),
  ('a1000000-0000-4000-8000-000000000034', '/photos123/p34.jpg', 'Koupelna — mramor, nika a příčka', 'koupelny', 34),
  ('a1000000-0000-4000-8000-000000000035', '/photos123/p35.jpg', 'Koupelna — antracitová vana a niky', 'koupelny', 35),
  ('a1000000-0000-4000-8000-000000000036', '/photos123/p36.jpg', 'Koupelna — šedý velkoformát a niky', 'koupelny', 36),
  ('a1000000-0000-4000-8000-000000000037', '/photos123/p37.jpg', 'Koupelna — tmavě šedý obklad a vana', 'koupelny', 37),
  ('a1000000-0000-4000-8000-000000000038', '/photos123/p38.jpg', 'Obklad — precizní dořez u desky', 'obklady', 38),
  ('a1000000-0000-4000-8000-000000000039', '/photos123/p39.jpg', 'Koupelna — antracit, vana a niky', 'koupelny', 39),
  ('a1000000-0000-4000-8000-000000000040', '/photos123/p40.jpg', 'Obklad — kamenický vnější roh', 'obklady', 40),
  ('a1000000-0000-4000-8000-000000000041', '/photos123/p41.jpg', 'Obklad — miterovaný roh bez lišty', 'obklady', 41),
  ('a1000000-0000-4000-8000-000000000042', '/photos123/p42.jpg', 'Koupelna — béžový obklad s vanou', 'koupelny', 42),
  ('a1000000-0000-4000-8000-000000000043', '/photos123/p43.jpg', 'Sprcha — pokládka dlažby s klíny', 'koupelny', 43),
  ('a1000000-0000-4000-8000-000000000044', '/photos123/p44.jpg', 'Koupelna — šedý velkoformát nad vanou', 'koupelny', 44)
on conflict (storage_path) do update set
  alt_text = excluded.alt_text,
  category = excluded.category,
  sort_order = excluded.sort_order;

-- Notify PostgREST to reload schema cache (fixes PGRST205)
notify pgrst, 'reload schema';
