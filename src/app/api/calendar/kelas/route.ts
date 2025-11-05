// app/api/kelas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kelasList = await prisma.kelas.findMany({
      select: {
        id: true,
        kelas: true,
        Jurusan: {
          select: {
            jurusan: true,
          },
        },
      },
      orderBy: {
        kelas: 'asc',
      },
    });

    const formattedKelas = kelasList.map((k) => ({
      id: k.id,
      nama: k.Jurusan ? `${k.kelas} ${k.Jurusan.jurusan}` : k.kelas,
    }));

    return NextResponse.json(formattedKelas);
  } catch (error) {
    console.error("Error fetching kelas:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar kelas" }, { status: 500 });
  }
}

// Jika Anda tetap ingin support POST, tambahkan di sini (opsional)
export async function POST(request: Request) {
  try {
    const { kelas, id_jurusan, id_waliKelas } = await request.json();

    if (!kelas?.trim()) {
      return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 });
    }
    if (id_jurusan == null || id_waliKelas == null) {
      return NextResponse.json({ error: "Jurusan dan Wali Kelas wajib dipilih" }, { status: 400 });
    }

    const jurusanId = Number(id_jurusan);
    const waliKelasId = Number(id_waliKelas);

    if (isNaN(jurusanId) || isNaN(waliKelasId)) {
      return NextResponse.json({ error: "ID harus berupa angka" }, { status: 400 });
    }

    const newKelas = await prisma.kelas.create({
      data: {
        kelas: kelas.trim(),
        id_jurusan: jurusanId,
        id_waliKelas: waliKelasId,
      },
    });

    return NextResponse.json(newKelas, { status: 201 });
  } catch (error) {
    console.error("Error creating kelas:", error);
    return NextResponse.json({ error: "Gagal menambahkan kelas" }, { status: 500 });
  }
}