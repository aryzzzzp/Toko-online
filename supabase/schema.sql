-- =========================================================
-- SKEMA DATABASE Bali Stars Sofa — jalankan di Supabase SQL Editor
-- =========================================================

-- 1. Tabel PROFILES (data tambahan untuk setiap user, termasuk role)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profil bisa dilihat oleh pemiliknya"
  on profiles for select using (auth.uid() = id);

create policy "Profil bisa diupdate oleh pemiliknya"
  on profiles for update using (auth.uid() = id);

-- Trigger: otomatis buat baris profiles saat user baru mendaftar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Tabel CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- 3. Tabel PRODUCTS (katalog)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null default 0,
  original_price numeric(12,2),
  stock integer not null default 0,
  image_url text,
  category_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table categories enable row level security;
alter table products enable row level security;

-- Semua orang boleh membaca katalog & kategori (toko publik)
create policy "Katalog bisa dibaca semua orang"
  on products for select using (true);

create policy "Kategori bisa dibaca semua orang"
  on categories for select using (true);

-- Hanya admin yang boleh tambah / ubah / hapus produk
create policy "Admin bisa insert produk"
  on products for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin bisa update produk"
  on products for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin bisa hapus produk"
  on products for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin bisa kelola kategori"
  on categories for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin bisa update kategori"
  on categories for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin bisa hapus kategori"
  on categories for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 4. Tabel ORDERS (pesanan)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','completed','cancelled')),
  total numeric(12,2) not null default 0,
  shipping_address text,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  price numeric(12,2) not null,
  quantity integer not null default 1
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "User melihat pesanan sendiri"
  on orders for select using (auth.uid() = user_id);

create policy "User membuat pesanan sendiri"
  on orders for insert with check (auth.uid() = user_id);

create policy "Admin melihat semua pesanan"
  on orders for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admin update semua pesanan"
  on orders for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "User melihat item pesanan sendiri"
  on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

create policy "User insert item pesanan sendiri"
  on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

create policy "Admin kelola semua item pesanan"
  on order_items for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 5. Storage bucket untuk gambar produk (jalankan sekali)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Gambar produk publik bisa dibaca"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin bisa upload gambar produk"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin bisa hapus gambar produk"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- =========================================================
-- CARA MENJADIKAN USER SEBAGAI ADMIN:
-- Daftar dulu lewat halaman /register, lalu jalankan query ini
-- (ganti email sesuai akun yang mau dijadikan admin):
--
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@email-anda.com');
-- =========================================================

-- Data contoh kategori & produk (opsional, boleh dihapus)
insert into categories (name, slug) values
  ('Fashion', 'fashion'),
  ('Elektronik', 'elektronik'),
  ('Rumah Tangga', 'rumah-tangga'),
  ('Kecantikan', 'kecantikan')
on conflict do nothing;
