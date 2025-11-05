import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise <{ nis: string }>;
}

// ✅ GET one siswa
export async function GET(_: Request, { params }: Params) {
  try {
    const { nis } = await params;
    const siswa = await prisma.siswa.findUnique({
      where: { NIS: nis },
      include: {
        kelas: {
          select: {
            kelas: true,
            Jurusan: { select: { jurusan: true } },
          },
        },
      },
    });

    if (!siswa)
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });

    const formatted = {
      nis: siswa.NIS,
      nama: siswa.Nama,
      jenisKelamin: siswa.JK,
      kelas: siswa.kelas?.kelas || "Belum diatur",
      jurusan: siswa.kelas?.Jurusan.jurusan || "Belum diatur",
      status: siswa.status,
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch siswa:", error);
    return NextResponse.json(
      { error: "Gagal memuat data siswa" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE siswa
export async function PUT(req: Request, { params }: Params) {
  try {
    const { nis } = await params;
    const body = await req.json();
    const { nama, jenisKelamin, status, kelas, jurusan } = body;

    const kelasRecord = await prisma.kelas.findFirst({
      where: { kelas },
    });

    if (!kelasRecord) {
      return NextResponse.json(
        { error: `Kelas "${kelas}" tidak ditemukan` },
        { status: 400 }
      );
    }

    const updated = await prisma.siswa.update({
      where: { NIS: nis },
      data: {
        Nama: nama,
        JK: jenisKelamin,
        status,
        id_class: kelasRecord.id,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update siswa:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui siswa" },
      { status: 500 }
    );
  }
}

// ✅ DELETE siswa
export async function DELETE(_: Request, { params }: Params) {
  try {
    const { nis } = await params;

    await prisma.siswa.delete({
      where: { NIS: nis },
    });

    return NextResponse.json({ message: "Siswa berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete siswa:", error);
    return NextResponse.json(
      { error: "Gagal menghapus siswa" },
      { status: 500 }
    );
  }
}
