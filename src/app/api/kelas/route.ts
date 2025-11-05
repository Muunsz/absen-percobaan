import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
        nama: `${k.kelas} ${k.Jurusan.jurusan}`,
      }));

      return res.json(formattedKelas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch class list' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}

export async function POST(req: Request) {
  try {
    const { kelas, id_jurusan, id_waliKelas } = await req.json();

    if (!kelas?.trim()) {
      return NextResponse.json(
        { error: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    if (id_jurusan == null || id_waliKelas == null) {
      return NextResponse.json(
        { error: "Jurusan dan Wali Kelas wajib dipilih" },
        { status: 400 }
      );
    }

    // Ensure IDs are numbers
    const jurusanId = Number(id_jurusan);
    const waliKelasId = Number(id_waliKelas);

    if (isNaN(jurusanId) || isNaN(waliKelasId)) {
      return NextResponse.json(
        { error: "ID Jurusan dan Wali Kelas harus berupa angka" },
        { status: 400 }
      );
    }

    // Create kelas
    const newKelas = await prisma.kelas.create({
      data: {
        kelas: kelas.trim(),
        id_jurusan: jurusanId,
        id_waliKelas: waliKelasId,
      },
    });

    return NextResponse.json(
      newKelas,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating kelas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan kelas" },
      { status: 500 }
    );
  }
}