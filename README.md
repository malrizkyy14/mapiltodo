# CRUD Daftar Siswa (Next.js + MySQL)

1. Import `database.sql` ke database MySQL (phpMyAdmin / terminal). Script ini membuat database `defaultdb` dan tabel `siswa`.
2. Jalankan `npm install`.
3. Isi `.env.local` di root project dengan host, port, user, password, dan nama database MySQL. Gunakan `.env.example` sebagai acuan. Untuk koneksi yang mensyaratkan TLS, atur `DB_SSL=true`. Saat ini verifikasi sertifikat dinonaktifkan untuk pengujian Aiven; sebelum production, pasang CA certificate Aiven dan aktifkan verifikasi sertifikat. Jangan taruh kredensial nyata di source code atau commit file `.env.local`.
4. Untuk deploy ke Vercel, tambahkan `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, dan `DB_SSL` di **Project Settings → Environment Variables**. Gunakan detail koneksi dari Aiven; `DB_NAME` adalah nama database yang tersedia (misalnya `defaultdb`) dan `DB_SSL=true` untuk TLS. Atur environment Production (serta Preview bila diperlukan). Jangan commit password ke Git.
5. Jika muncul `Access denied`, periksa user dan password. Jika koneksi TLS gagal, pastikan Aiven mengizinkan koneksi dari Vercel dan konfigurasi CA/SSL servicenya benar.
6. Jalankan `npm run dev`. Setelah mengubah `.env.local`, hentikan server dan jalankan ulang agar konfigurasi baru terbaca.
7. Buka http://localhost:3000
