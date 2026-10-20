import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type Siswa = RowDataPacket & {
  id: number;
  nama: string;
  kelas: string;
  jurusan: string;
};

export type SiswaInput = {
  nama: string;
  kelas: string;
  jurusan: string;
};

export function validasiSiswa(value: unknown): SiswaInput | null {
  if (typeof value !== "object" || value === null) return null;

  const input = value as Record<string, unknown>;
  if (
    typeof input.nama !== "string" ||
    typeof input.kelas !== "string" ||
    typeof input.jurusan !== "string"
  ) {
    return null;
  }

  const siswa = {
    nama: input.nama.trim(),
    kelas: input.kelas.trim(),
    jurusan: input.jurusan.trim(),
  };

  if (
    !siswa.nama ||
    !siswa.kelas ||
    !siswa.jurusan ||
    siswa.nama.length > 100 ||
    siswa.kelas.length > 50 ||
    siswa.jurusan.length > 50
  ) {
    return null;
  }

  return siswa;
}

export async function ambilSemuaSiswa(): Promise<Siswa[]> {
  const [rows] = await db.query<Siswa[]>("SELECT * FROM siswa ORDER BY id DESC");
  return rows;
}

export async function ambilSiswa(id: number): Promise<Siswa | null> {
  const [rows] = await db.execute<Siswa[]>(
    "SELECT * FROM siswa WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}

export async function tambahSiswa(input: SiswaInput): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO siswa (nama, kelas, jurusan) VALUES (?, ?, ?)",
    [input.nama, input.kelas, input.jurusan]
  );
  return result.insertId;
}

export async function ubahSiswa(
  id: number,
  input: SiswaInput
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE siswa SET nama = ?, kelas = ?, jurusan = ? WHERE id = ?",
    [input.nama, input.kelas, input.jurusan, id]
  );
  return result.affectedRows > 0;
}

export async function hapusSiswa(id: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    "DELETE FROM siswa WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}

export function responsKesalahan(error: unknown): Response {
  const databaseError =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "";

  console.error("Database request failed:", databaseError || error);

  if (databaseError === "ER_NO_SUCH_TABLE") {
    return Response.json(
      { error: "Tabel siswa belum ada. Jalankan database.sql di Aiven." },
      { status: 503 }
    );
  }

  if (
    databaseError === "ER_ACCESS_DENIED_ERROR" ||
    databaseError === "HANDSHAKE_SSL_ERROR" ||
    databaseError === "ETIMEDOUT" ||
    databaseError === "ECONNREFUSED"
  ) {
    return Response.json(
      {
        error:
          "Tidak dapat terhubung ke MySQL. Periksa environment variables Aiven di Vercel dan konfigurasi TLS.",
      },
      { status: 503 }
    );
  }

  return Response.json(
    { error: "Terjadi kesalahan saat mengakses database." },
    { status: 500 }
  );
}

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
