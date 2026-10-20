# CRUD Daftar Siswa (Next.js + MySQL)

## Jalankan lokal

1. Pastikan service MySQL Aiven berstatus **Running**. Salin host, port, user, dan password dari halaman service Aiven.
2. Buat `.env.local` di root project berdasarkan `.env.example`:

   ```env
   DB_HOST=hostname-dari-aiven
   DB_PORT=13730
   DB_USER=avnadmin
   DB_PASSWORD=password-dari-aiven
   DB_NAME=defaultdb
   DB_SSL=true
   ```

   `DB_SSL_CA` opsional tetapi disarankan untuk memverifikasi sertifikat server. Unduh CA certificate dari halaman Aiven, lalu atur `DB_SSL_CA` dengan isi PEM lengkap (termasuk baris `BEGIN CERTIFICATE` dan `END CERTIFICATE`). Tanpa CA, TLS tetap mengenkripsi koneksi tetapi sertifikat server tidak diverifikasi. Jangan commit `.env.local`.
3. Import `database.sql` ke service MySQL Aiven. Script membuat tabel `siswa` dan memasukkan contoh data tanpa menggandakan data saat dijalankan ulang.
4. Jalankan `npm install`, lalu `npm run dev`. Buka http://localhost:3000.

## REST API

Semua endpoint memakai database Aiven yang sama dengan halaman dashboard:

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/api/siswa` | Mengambil semua siswa |
| `POST` | `/api/siswa` | Menambah siswa |
| `GET` | `/api/siswa/:id` | Mengambil satu siswa |
| `PUT` | `/api/siswa/:id` | Mengubah siswa |
| `DELETE` | `/api/siswa/:id` | Menghapus siswa |

`POST` dan `PUT` menerima JSON dengan bentuk:

```json
{
  "nama": "Budi Santoso",
  "kelas": "XI RPL 1",
  "jurusan": "RPL"
}
```

Contoh uji setelah aplikasi berjalan:

```sh
curl http://localhost:3000/api/siswa
curl -X POST http://localhost:3000/api/siswa -H "Content-Type: application/json" -d "{\"nama\":\"Budi Santoso\",\"kelas\":\"XI RPL 1\",\"jurusan\":\"RPL\"}"
curl -X PUT http://localhost:3000/api/siswa/1 -H "Content-Type: application/json" -d "{\"nama\":\"Budi Santoso\",\"kelas\":\"XI RPL 1\",\"jurusan\":\"RPL\"}"
curl -X DELETE http://localhost:3000/api/siswa/1
```

Endpoint tulis ini tidak memakai login dan hanya cocok untuk demo/testing. Jangan simpan data siswa sungguhan atau biarkan endpoint publik tanpa autentikasi dan otorisasi.

## Deploy ke Vercel

1. Push project ke GitHub dan import repository tersebut di Vercel.
2. Buka **Project → Settings → Environment Variables**. Tambahkan variabel untuk environment **Production** (dan **Preview** jika dipakai):
   - `DB_HOST`: hostname service Aiven
   - `DB_PORT`: port service Aiven
   - `DB_USER`: user Aiven
   - `DB_PASSWORD`: password Aiven
   - `DB_NAME`: nama database, biasanya `defaultdb`
   - `DB_SSL`: `true`
   - `DB_SSL_CA`: CA certificate Aiven (opsional, disarankan untuk verifikasi TLS)
3. Di Aiven, pastikan service aktif dan koneksi publik diizinkan. Jangan menaruh kredensial pada source code atau repository GitHub.
4. Pilih **Deployments → Redeploy** (atau push commit baru). Setiap perubahan Environment Variables perlu deployment baru.
5. Setelah status deployment **Ready**, uji `https://alamat-project.vercel.app/` dan `https://alamat-project.vercel.app/api/siswa`.

Jika API menampilkan error koneksi, periksa nama environment variable, database/table, status Aiven, kredensial, serta pengaturan TLS/CA. Pesan error dari API tidak menampilkan password database.
