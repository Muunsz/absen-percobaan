// src/app/api/absensi/scan/confirm/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scannedStudents, classId } = body;

    // Validasi input
    if (!Array.isArray(scannedStudents) || scannedStudents.length === 0) {
      return NextResponse.json(
        { 
          message: "Daftar siswa yang dipindai tidak valid atau kosong." 
        },
        { status: 400 }
      );
    }

    if (!classId || typeof classId !== "number") {
      return NextResponse.json(
        { 
          message: "ID Kelas tidak valid. Harap pilih kelas yang benar." 
        },
        { status: 400 }
      );
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Ambil semua siswa di kelas tersebut
    const allStudentsInClass = await prisma.siswa.findMany({
      where: { id_class: classId },
      select: { NIS: true }
    });

    if (allStudentsInClass.length === 0) {
      return NextResponse.json(
        { 
          message: "Tidak ada siswa yang terdaftar di kelas ini." 
        },
        { status: 404 }
      );
    }

    const allNIS = allStudentsInClass.map(s => s.NIS);
    const scannedSet = new Set(scannedStudents);

    // Siswa yang ter-scan -> status HADIR
    const toUpdateHadirs = allNIS
      .filter(nis => scannedSet.has(nis))
      .map(nis => ({
        id_siswa: nis,
        id_kelas: classId,
        keterangan: "HADIR" as const,
        tanggal: startOfDay,
        deskripsi: null // Deskripsi opsional, bisa diisi jika perlu
      }));

    // Siswa yang tidak ter-scan -> status IZIN
    const toUpdateIzins = allNIS
      .filter(nis => !scannedSet.has(nis))
      .map(nis => ({
        id_siswa: nis,
        id_kelas: classId,
        keterangan: "IZIN" as const,
        tanggal: startOfDay,
        deskripsi: "Tidak dipindai, otomatis izin."
      }));

    // Gunakan transaction untuk keamanan data
    await prisma.$transaction([
      // Hapus semua absensi hari ini untuk kelas ini
      prisma.absensi.deleteMany({
        where: {
          id_kelas: classId,
          tanggal: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      // Tambahkan absensi baru
      prisma.absensi.createMany({
        data: [...toUpdateHadirs, ...toUpdateIzins]
      })
    ]);

    return NextResponse.json(
      { 
        message: `Absensi berhasil disimpan! ${toUpdateHadirs.length} siswa hadir, ${toUpdateIzins.length} siswa izin.`,
        total: allNIS.length,
        detail: {
          hadir: toUpdateHadirs.length,
          izin: toUpdateIzins.length
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/absensi/scan/confirm:", error);
    return NextResponse.json(
      { 
        message: "Server error. Gagal menyimpan absensi. Silakan coba lagi." 
      },
      { status: 500 }
    );
  }
}