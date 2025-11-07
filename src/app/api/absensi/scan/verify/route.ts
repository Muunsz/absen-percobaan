// src/app/api/absensi/scan/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nis } = body;

    // Validasi input
    if (!nis || typeof nis !== "string" || nis.trim() === "") {
      return NextResponse.json(
        { 
          status: "error", 
          message: "NIS tidak valid. Harap masukkan NIS yang benar." 
        },
        { status: 400 }
      );
    }

    // Cari siswa berdasarkan NIS (yang merupakan string unik)
    const siswa = await prisma.siswa.findUnique({
      where: { NIS: nis },
      include: {
        kelas: {
          include: {
            Jurusan: true
          }
        }
      }
    });

    if (!siswa) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Data siswa tidak ditemukan. Pastikan QR/Barcode benar." 
        },
        { status: 404 }
      );
    }

    // Periksa apakah sudah ada absensi untuk tanggal yang dipilih (atau hari ini jika tidak diberikan)
    let tanggalAbsensi: Date;
    if (body.tanggal && typeof body.tanggal === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.tanggal)) {
      const [y, m, d] = body.tanggal.split("-").map(Number);
      // use UTC midnight so queries match stored DATE values
      tanggalAbsensi = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
    } else {
      const now = new Date();
      tanggalAbsensi = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    }

    if (isNaN(tanggalAbsensi.getTime())) {
      const now = new Date();
      tanggalAbsensi = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    }

    const startOfDay = new Date(Date.UTC(tanggalAbsensi.getUTCFullYear(), tanggalAbsensi.getUTCMonth(), tanggalAbsensi.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(tanggalAbsensi.getUTCFullYear(), tanggalAbsensi.getUTCMonth(), tanggalAbsensi.getUTCDate(), 23, 59, 59, 999));

    const existingAbsensi = await prisma.absensi.findFirst({
      where: {
        id_siswa: siswa.NIS,
        tanggal: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingAbsensi) {
      return NextResponse.json(
        { 
          status: "warning", 
          message: `${siswa.Nama} sudah tercatat hadir hari ini.` 
        },
        { status: 200 }
      );
    }

    // Siapkan data untuk response
    const responseData = {
      nis: siswa.NIS,
      nama: siswa.Nama,
      kelas: siswa.kelas?.kelas || "Kelas Tidak Diketahui",
      jurusan: siswa.kelas?.Jurusan?.jurusan || "Jurusan Tidak Diketahui"
    };

    return NextResponse.json(
      { 
        status: "success", 
        data: responseData 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/absensi/scan/verify:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Terjadi kesalahan server. Silakan coba lagi nanti." 
      },
      { status: 500 }
    );
  }
}