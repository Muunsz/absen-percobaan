import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.kelas.delete({ where: { id: Number(id) } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Gagal menghapus kelas" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { kelas, id_jurusan, id_waliKelas } = await req.json();
    const { id } = await params;
    const kelasId = Number(id);

    if (isNaN(kelasId)) {
      return NextResponse.json({ error: "ID kelas tidak valid" }, { status: 400 });
    }

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

    const jurusanId = Number(id_jurusan);
    const waliKelasId = Number(id_waliKelas);

    if (isNaN(jurusanId) || isNaN(waliKelasId)) {
      return NextResponse.json(
        { error: "ID Jurusan dan Wali Kelas harus berupa angka" },
        { status: 400 }
      );
    }

    const [kelasExists, jurusanExists, guruExists] = await Promise.all([
      prisma.kelas.findUnique({ where: { id: kelasId } }),
      prisma.jurusan.findUnique({ where: { id: jurusanId } }),
      prisma.account.findUnique({ where: { id: waliKelasId } }),
    ]);

    if (!kelasExists) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
    }

    if (!jurusanExists) {
      return NextResponse.json({ error: "Jurusan tidak ditemukan" }, { status: 404 });
    }

    if (!guruExists) {
      return NextResponse.json({ error: "Guru (Wali Kelas) tidak ditemukan" }, { status: 404 });
    }

    const updatedKelas = await prisma.kelas.update({
      where: { id: kelasId },
      data: {
        kelas: kelas.trim(),
        id_jurusan: jurusanId,
        id_waliKelas: waliKelasId,
      },
    });

    return NextResponse.json(
      { message: "Kelas berhasil diperbarui", kelas: updatedKelas },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating kelas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui kelas" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise <{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: "ID kelas tidak valid" },
        { status: 400 }
      );
    }

    const kelas = await prisma.kelas.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        kelas: true,
        id_jurusan: true,
        id_waliKelas: true,
        Jurusan: {
          select: {
            jurusan: true,
          },
        },
      },
    });

    if (!kelas) {
      return NextResponse.json(
        { error: "Kelas tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: kelas.id,
      nama_kelas: kelas.kelas,
      id_jurusan: kelas.id_jurusan,
      nama_jurusan: kelas.Jurusan?.jurusan || null,
    });
  } catch (error) {
    console.error("Error fetching kelas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data kelas" },
      { status: 500 }
    );
  }
}