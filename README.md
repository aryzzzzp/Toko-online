# Bali Star Sofa — Website Toko Retail (Next.js + Tailwind + Supabase)

Website jualan/retail lengkap dengan katalog produk, login user, dan panel admin.
Dibangun dengan **Next.js 14 (App Router)**, **Tailwind CSS**, **JavaScript**, dan **Supabase**
(Auth + Database Postgres + Storage gambar).

## ✨ Fitur

- **Beranda** — hero slideshow animasi (Ken Burns, gaya resort seperti Ayana), kategori unggulan, produk terbaru.
- **Katalog** — filter kategori, pencarian, halaman detail produk.
- **Tentang Kami** — halaman cerita brand.
- **Autentikasi** — daftar & masuk pakai Supabase Auth (email/password).
- **Akun Pengguna** — riwayat pesanan pribadi.
- **Panel Admin** (dilindungi, hanya role `admin`):
  - Dashboard ringkasan (total produk, pesanan, pengguna, pendapatan)
  - Kelola Produk — tambah, ubah, **hapus**, upload gambar, atur stok/harga/kategori/status aktif
  - Kelola Pesanan — lihat semua pesanan & ubah status (menunggu → dibayar → diproses → dikirim → selesai)

## 🧱 Struktur Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend & Routing | Next.js 14 App Router |
| Styling | Tailwind CSS |
| Animasi | Framer Motion + CSS keyframes |
| Bahasa | JavaScript |
| Database & Auth | Supabase (Postgres, Auth, Storage) |

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Buat project Supabase
1. Buka [supabase.com](https://supabase.com) → buat project baru (gratis).
2. Buka **SQL Editor** → jalankan seluruh isi file `supabase/schema.sql` di project ini.
   File ini akan otomatis membuat:
   - Tabel `profiles`, `categories`, `products`, `orders`, `order_items`
   - Row Level Security (RLS) policy (publik hanya bisa baca, hanya admin bisa kelola produk)
   - Storage bucket `product-images` untuk upload gambar
   - Trigger otomatis: setiap user baru daftar → otomatis dapat role `customer`

### 3. Salin kredensial Supabase
Buka **Project Settings → API**, salin:
- `Project URL`
- `anon public key`

Buat file `.env.local` (copy dari `.env.local.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Jalankan aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

### 5. Jadikan akun Anda sebagai Admin
1. Daftar akun baru lewat halaman `/register` di website Anda.
2. Buka **Supabase → SQL Editor**, jalankan (ganti email sesuai akun Anda):
```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'email-anda@contoh.com');
```
3. Logout lalu login kembali. Menu **Admin** akan muncul di navbar, dan Anda bisa akses `/admin`.

## 📂 Struktur Folder Penting

```
app/
  page.js                 → Beranda
  catalog/page.js         → Katalog (list produk)
  catalog/[id]/page.js    → Detail produk
  about/page.js           → Tentang Kami
  login/page.js           → Login
  register/page.js        → Daftar
  account/page.js         → Riwayat pesanan user
  admin/
    page.js               → Dashboard admin
    products/page.js      → Kelola produk (list + hapus)
    products/new/page.js  → Tambah produk
    products/[id]/page.js → Ubah produk
    orders/page.js        → Kelola pesanan
components/               → Komponen UI (Navbar, Hero, ProductCard, dll)
lib/                      → Klien Supabase (browser & server)
middleware.js             → Proteksi halaman /admin (hanya role admin)
supabase/schema.sql       → Skema database lengkap + RLS
```

## 🛒 Alur Belanja Saat Ini

Tombol **"Pesan Sekarang"** di halaman detail produk akan langsung membuat baris di
tabel `orders` & `order_items` dengan status `pending`. Ini adalah fondasi checkout
sederhana — Anda bisa mengembangkannya lebih lanjut dengan menambahkan:
- Halaman keranjang (cart) multi-produk sebelum checkout
- Integrasi payment gateway (Midtrans / Xendit sangat umum dipakai di Indonesia)
- Notifikasi email saat status pesanan berubah

## 🎨 Desain

Tema visual "Bali Star Sofa" terinspirasi resort/butik mewah (seperti Ayana Resort): warna hijau
forest, sand, dan aksen brass/emas, tipografi serif italic (Fraunces) dipadu sans-serif
(Manrope), serta hero slideshow dengan efek Ken Burns dan transisi lembut.

## 📦 Deploy

Rekomendasi termudah: [Vercel](https://vercel.com) — hubungkan repo GitHub Anda,
tambahkan environment variable yang sama seperti `.env.local`, lalu deploy.
