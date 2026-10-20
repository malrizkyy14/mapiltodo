# CRUD Daftar Siswa (Next.js + MySQL)

1. Import `database.sql` ke MySQL (phpMyAdmin / terminal). Script ini membuat database `db_siswa` dan tabel `siswa`.
2. Jalankan `npm install`.
3. Isi `.env.local` di root project dengan host, port, user, password, dan nama database MySQL. Gunakan `.env.example` sebagai acuan. `DB_PASSWORD` harus berisi kata sandi untuk `DB_USER`; jangan menaruhnya di source code atau commit file `.env.local`.
4. Jika muncul `Access denied for user 'root'@'localhost' (using password: NO)`, `DB_PASSWORD` kosong atau tidak terbaca. Isi dengan kata sandi MySQL yang benar. Bila akun MySQL memang tidak memakai kata sandi, pastikan akun tersebut diizinkan untuk login dari `localhost`.
5. Jalankan `npm run dev`. Setelah mengubah `.env.local`, hentikan server dan jalankan ulang agar konfigurasi baru terbaca.
6. Buka http://localhost:3000
