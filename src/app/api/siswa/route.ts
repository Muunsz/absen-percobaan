import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nis, nama, jenisKelamin, status, kelas } = body;

    const kelasRecord = await prisma.kelas.findFirst({ where: { kelas } });
    if (!kelasRecord) {
      return NextResponse.json(
        { error: `Kelas "${kelas}" tidak ditemukan` },
        { status: 400 }
      );
    }

    const existing = await prisma.siswa.findUnique({ where: { NIS: nis } });
    if (existing) {
      return NextResponse.json({ error: "NIS sudah digunakan" }, { status: 400 });
    }

    const siswa = await prisma.siswa.create({
      data: {
        NIS: nis,
        Nama: nama,
        JK: jenisKelamin,
        status,
        id_class: kelasRecord.id,
      },
    });

    return NextResponse.json(siswa, { status: 201 });
  } catch (error) {
    console.error("Failed to create siswa:", error);
    return NextResponse.json({ error: "Gagal menambah siswa" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const guruUsers = await prisma.siswa.findMany({
      select: {
        NIS: true,
        Nama: true,
        JK: true,
        kelas: {
            select: {
                kelas: true, 
                Jurusan: { select: { jurusan: true } }
                },
        },
        status: true,
      },
      orderBy: {
        id_class: "asc",
      },
    });

    const formattedSiswa = guruUsers.map(siswa => ({
      nis: siswa.NIS,
      nama: siswa.Nama,
      JK: siswa.JK,
      kelas: siswa.kelas?.kelas || 'Belum diatur',
      jurusan: siswa.kelas?.Jurusan.jurusan || 'Belum diatur',
      status: siswa.status,
    }));

    return NextResponse.json(formattedSiswa, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch siswa:", error);
    return NextResponse.json(
      { error: "Gagal memuat data siswa" },
      { status: 500 }
    );
  }
}

