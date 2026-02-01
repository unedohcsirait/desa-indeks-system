# Panduan Menjalankan Proyek Indeks Desa Secara Lokal

Panduan ini menjelaskan langkah-langkah untuk menjalankan aplikasi "Indeks Desa" di komputer lokal Anda.

## Persyaratan Sistem

Pastikan Anda sudah menginstal perangkat lunak berikut:
- **Node.js** (Versi 18 atau terbaru)
- **PostgreSQL** (Database)
- **Git** (Opsional, untuk klon repositori)

## Langkah-langkah Instalasi

### 1. Persiapan File
Unduh file proyek dari Replit dan ekstrak di komputer Anda, atau gunakan Git jika Anda sudah mengaturnya.

### 2. Instalasi Dependensi
Buka terminal/command prompt di dalam folder proyek (`Desa-Indeks-System`) dan jalankan:
```bash
npm install
```

### 3. Pengaturan Database (PostgreSQL)
Aplikasi ini membutuhkan database PostgreSQL.
1. Buat database baru di PostgreSQL Anda (misalnya bernama `indeks_desa`).
2. Dapatkan URL koneksi database Anda. Formatnya biasanya:
   `postgres://username:password@localhost:5432/indeks_desa`

### 4. Pengaturan Variabel Lingkungan (Environment Variables)
Buat file baru bernama `.env` di folder utama proyek dan tambahkan konfigurasi berikut:

```env
DATABASE_URL=postgres://username:password@localhost:5432/indeks_desa
SESSION_SECRET=buat_kata_sandi_rahasia_bebas_disini
NODE_ENV=development

# Konfigurasi Auth (Untuk lokal, Anda mungkin perlu menyesuaikan sistem login)
# Karena menggunakan Replit Auth, jalankan tanpa ini terlebih dahulu
```

### 5. Inisialisasi Database (Push Schema)
Jalankan perintah berikut untuk membuat tabel-tabel yang diperlukan di database Anda:
```bash
npm run db:push
```

### 6. Menjalankan Aplikasi
Setelah semua siap, jalankan aplikasi dalam mode pengembangan:
```bash
npm run dev
```

Aplikasi akan berjalan dan biasanya dapat diakses melalui browser di alamat:
`http://localhost:5000` (atau port lain yang muncul di terminal).

## Catatan Penting Mengenai Login
Aplikasi ini menggunakan **Replit Auth**. Saat dijalankan di lokal, sistem login mungkin memerlukan penyesuaian karena Replit Auth didesain khusus untuk lingkungan Replit. Jika Anda mengalami kendala pada halaman login di lokal, Anda perlu memodifikasi bagian autentikasi di `server/replit_integrations/auth` untuk menggunakan sistem login manual atau lokal.

## Ringkasan Perintah
- `npm install` - Instal library
- `npm run db:push` - Sinkronisasi database
- `npm run dev` - Jalankan aplikasi
