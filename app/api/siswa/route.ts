import {
  ambilSemuaSiswa,
  responsKesalahan,
  tambahSiswa,
  validasiSiswa,
} from "@/lib/siswa";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json({ data: await ambilSemuaSiswa() });
  } catch (error) {
    return responsKesalahan(error);
  }
}

export async function POST(request: Request) {
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
    const id = await tambahSiswa(input);
    return Response.json(
      { data: { id, ...input }, message: "Siswa berhasil ditambahkan." },
      { status: 201 }
    );
  } catch (error) {
    return responsKesalahan(error);
  }
}
