import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Kelas {
  id: number;
  kelas: string;
  id_jurusan: number;
  id_waliKelas: number;
}

export async function GET(
  request: Request,
  { params }: any
) {
  const jurusanSlug = params.jurusan;

  const decodedName = decodeURIComponent(jurusanSlug).replace(/-/g, " ").trim();

  try {
    const jurusan = await prisma.jurusan.findFirst({
      where: {
        jurusan: {
          contains: decodedName.replace(/\s/g, ' ').trim(), 
          mode: 'insensitive', 
        }
      },
      select: {
        id: true,
      }
    });

    if (!jurusan) {
      return NextResponse.json({ error: `Jurusan dengan slug '${jurusanSlug}' tidak ditemukan.` }, { status: 404 });
    }

    const kelas: Kelas[] = await prisma.kelas.findMany({
      where: {
        id_jurusan: jurusan.id,
      },
      orderBy: {
        kelas: 'asc',
      }
    });

    return NextResponse.json(kelas);

  } catch (error) {
    console.error(`Error fetching kelas for ${jurusanSlug}:`, error);
    return NextResponse.json({ error: "Gagal mengambil data kelas" }, { status: 500 });
  }
}