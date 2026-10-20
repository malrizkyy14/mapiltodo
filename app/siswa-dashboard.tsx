"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  jurusan: string;
};

type FormSiswa = Omit<Siswa, "id">;

const formKosong: FormSiswa = { nama: "", kelas: "", jurusan: "" };
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

async function bacaRespons<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error || "Permintaan tidak berhasil.");
  }
  return body;
}

export default function SiswaDashboard() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormSiswa>(formKosong);
  const [cari, setCari] = useState("");
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const muatSiswa = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/siswa", { cache: "no-store" });
      const result = await bacaRespons<{ data: Siswa[] }>(response);
      setSiswa(result.data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Data siswa gagal dimuat. Periksa koneksi database."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void muatSiswa();
  }, [muatSiswa]);

  const siswaTerfilter = useMemo(() => {
    const query = cari.trim().toLowerCase();
    if (!query) return siswa;
    return siswa.filter((item) =>
      [item.nama, item.kelas, item.jurusan].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [cari, siswa]);

  const mulaiTambah = () => {
    setEditId(null);
    setForm(formKosong);
    setError("");
    setSukses("");
    setFormTerbuka(true);
  };

  const mulaiEdit = (item: Siswa) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      kelas: item.kelas,
      jurusan: item.jurusan,
    });
    setError("");
    setSukses("");
    setFormTerbuka(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const simpanSiswa = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSukses("");
    try {
      const response = await fetch(
        editId ? `/api/siswa/${editId}` : "/api/siswa",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const result = await bacaRespons<{ message: string }>(response);
      setSukses(result.message);
      setFormTerbuka(false);
      setEditId(null);
      setForm(formKosong);
      await muatSiswa();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Data siswa gagal disimpan."
      );
    } finally {
      setBusy(false);
    }
  };

  const hapusSiswa = async (item: Siswa) => {
    if (!window.confirm(`Hapus data ${item.nama}?`)) return;
    setError("");
    setSukses("");
    try {
      const response = await fetch(`/api/siswa/${item.id}`, {
        method: "DELETE",
      });
      const result = await bacaRespons<{ message: string }>(response);
      setSukses(result.message);
      await muatSiswa();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Data siswa gagal dihapus."
      );
    }
  };

  const jumlahKelas = new Set(siswa.map((item) => item.kelas)).size;
  const jumlahJurusan = new Set(siswa.map((item) => item.jurusan)).size;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="bg-[#111b35] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-black shadow-lg shadow-indigo-950/30">
              S
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">
                SISWA<span className="text-indigo-300">KU</span>
              </span>
              <span className="block text-xs text-slate-400">
                Panel administrasi
              </span>
            </span>
          </a>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Aplikasi daftar siswa
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-indigo-600">
              DATA AKADEMIK
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Daftar siswa
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Kelola data siswa, kelas, dan jurusan dalam satu tempat.
            </p>
          </div>
          <button
            type="button"
            onClick={mulaiTambah}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            <span className="text-lg leading-none">+</span>
            Tambah siswa
          </button>
        </div>

        <section className="mb-7 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total siswa" value={loading ? "—" : siswa.length} icon="01" />
          <StatCard label="Kelas terdaftar" value={loading ? "—" : jumlahKelas} icon="02" />
          <StatCard label="Jurusan" value={loading ? "—" : jumlahJurusan} icon="03" />
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void muatSiswa()}
              className="shrink-0 font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        )}
        {sukses && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {sukses}
          </div>
        )}

        {formTerbuka && (
          <section className="mb-7 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Formulir siswa
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {editId ? "Ubah data siswa" : "Tambah siswa baru"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFormTerbuka(false)}
                aria-label="Tutup formulir"
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={simpanSiswa}>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">
                  Nama lengkap
                  <input
                    className={`${inputClass} mt-2`}
                    name="nama"
                    value={form.nama}
                    onChange={(event) =>
                      setForm({ ...form, nama: event.target.value })
                    }
                    placeholder="Contoh: Budi Santoso"
                    maxLength={100}
                    required
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Kelas
                  <input
                    className={`${inputClass} mt-2`}
                    name="kelas"
                    value={form.kelas}
                    onChange={(event) =>
                      setForm({ ...form, kelas: event.target.value })
                    }
                    placeholder="Contoh: XI RPL 1"
                    maxLength={50}
                    required
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Jurusan
                  <input
                    className={`${inputClass} mt-2`}
                    name="jurusan"
                    value={form.jurusan}
                    onChange={(event) =>
                      setForm({ ...form, jurusan: event.target.value })
                    }
                    placeholder="Contoh: RPL"
                    maxLength={50}
                    required
                  />
                </label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setFormTerbuka(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                >
                  {busy ? "Menyimpan..." : editId ? "Simpan perubahan" : "Simpan siswa"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-bold">Semua siswa</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Mengambil data dari database..."
                  : `${siswaTerfilter.length} data ditampilkan`}
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                value={cari}
                onChange={(event) => setCari(event.target.value)}
                placeholder="Cari nama, kelas, jurusan..."
                aria-label="Cari siswa"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama siswa</th>
                  <th className="px-6 py-4 font-semibold">Kelas</th>
                  <th className="px-6 py-4 font-semibold">Jurusan</th>
                  <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : siswaTerfilter.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <p className="font-semibold text-slate-700">
                        {siswa.length === 0 ? "Belum ada data siswa" : "Data tidak ditemukan"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {siswa.length === 0
                          ? "Tambahkan siswa pertama untuk mulai mengisi daftar."
                          : "Coba kata kunci pencarian lain."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  siswaTerfilter.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                            {item.nama.charAt(0).toUpperCase()}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {item.nama}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.kelas}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                          {item.jurusan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => mulaiEdit(item)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void hapusSiswa(item)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Data tersimpan di database MySQL Aiven.</span>
            <span>Kelola data hanya untuk keperluan pengujian.</span>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <h2 className="font-bold">REST API</h2>
          <p className="mt-1 text-sm text-slate-500">
            Endpoint ini menggunakan database yang sama dengan tampilan di atas.
          </p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <ApiMethod method="GET" path="/api/siswa" detail="Ambil semua siswa" />
            <ApiMethod method="POST" path="/api/siswa" detail="Tambah siswa (JSON)" />
            <ApiMethod method="GET" path="/api/siswa/:id" detail="Ambil satu siswa" />
            <ApiMethod method="PUT" path="/api/siswa/:id" detail="Ubah data (JSON)" />
            <ApiMethod method="DELETE" path="/api/siswa/:id" detail="Hapus siswa" />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function ApiMethod({
  method,
  path,
  detail,
}: {
  method: string;
  path: string;
  detail: string;
}) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-50 text-emerald-700",
    POST: "bg-blue-50 text-blue-700",
    PUT: "bg-amber-50 text-amber-700",
    DELETE: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
      <span className={`rounded-md px-2 py-1 text-[10px] font-black ${colors[method]}`}>
        {method}
      </span>
      <code className="text-xs font-semibold text-slate-700">{path}</code>
      <span className="ml-auto text-xs text-slate-400">{detail}</span>
    </div>
  );
}
