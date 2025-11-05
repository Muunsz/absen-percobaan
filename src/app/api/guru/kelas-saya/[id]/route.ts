// app/api/guru/kelas-saya/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const kelasId = Number(resolvedParams.id);
    if (isNaN(kelasId)) {
      return NextResponse.json({ error: "ID kelas tidak valid" }, { status: 400 });
    }

    // Ambil data kelas + jurusan + siswa aktif + absensi
    const kelas = await prisma.kelas.findUnique({
      where: { id: kelasId },
      include: {
        Jurusan: { select: { jurusan: true } },
        siswa: {
          where: { status: "Aktif" },
          select: {
            NIS: true,
            Nama: true,
            JK: true,
            absensi: {
              where: { id_kelas: kelasId },
              select: {
                tanggal: true,
                keterangan: true,
                deskripsi: true,
              },
              orderBy: { tanggal: "asc" },
            },
          },
          orderBy: { Nama: "asc" },
        },
      },
    });

    if (!kelas) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
    }

    // Hitung rekap kehadiran
    const rekap = { HADIR: 0, SAKIT: 0, IZIN: 0, ALPA: 0 };
    kelas.siswa.forEach(s => {
      s.absensi.forEach(a => {
        if (a.keterangan in rekap) rekap[a.keterangan as keyof typeof rekap]++;
      });
    });

    return NextResponse.json({
      kelas: {
        id: kelas.id,
        nama: kelas.Jurusan ? `${kelas.kelas} ${kelas.Jurusan.jurusan}` : kelas.kelas,
        jurusan: kelas.Jurusan?.jurusan || "Umum",
        totalSiswa: kelas.siswa.length,
      },
      siswa: kelas.siswa.map(s => ({
        NIS: s.NIS,
        Nama: s.Nama,
        JK: s.JK,
        absensi: s.absensi.map(a => ({
          tanggal: a.tanggal.toISOString().split("T")[0],
          keterangan: a.keterangan,
          deskripsi: a.deskripsi,
        })),
      })),
      rekap,
    });
  } catch (error) {
    console.error("Error fetching kelas detail:", error);
    return NextResponse.json({ error: "Gagal mengambil data kelas" }, { status: 500 });
  }
}