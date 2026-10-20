import {
  ambilSiswa,
  hapusSiswa,
  parseId,
  responsKesalahan,
  ubahSiswa,
  validasiSiswa,
} from "@/lib/siswa";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) {
    return Response.json({ error: "ID siswa tidak valid." }, { status: 400 });
  }

  try {
    const siswa = await ambilSiswa(id);
    return siswa
      ? Response.json({ data: siswa })
      : Response.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
  } catch (error) {
    return responsKesalahan(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) {
    return Response.json({ error: "ID siswa tidak valid." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus berupa JSON yang valid." }, { status: 400 });
  }

  const input = validasiSiswa(body);
  if (!input) {
    return Response.json(
      {
        error:
          "Isi nama (maks. 100 karakter), kelas (maks. 50), dan jurusan (maks. 50).",
      },
      { status: 400 }
    );
  }

  try {
    const updated = await ubahSiswa(id, input);
    return updated
      ? Response.json({ data: { id, ...input }, message: "Data siswa diperbarui." })
      : Response.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
  } catch (error) {
    return responsKesalahan(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const id = parseId((await params).id);
  if (!id) {
    return Response.json({ error: "ID siswa tidak valid." }, { status: 400 });
  }

  try {
    const deleted = await hapusSiswa(id);
    return deleted
      ? Response.json({ message: "Siswa berhasil dihapus." })
      : Response.json({ error: "Siswa tidak ditemukan." }, { status: 404 });
  } catch (error) {
    return responsKesalahan(error);
  }
}
