// src/app/api/absensi/class/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fungsi untuk menormalisasi nama kelas: hapus spasi berlebih & case-insensitive
function normalizeKelas(nama: string): string {
  return nama.trim().replace(/\s+/g, " ");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const namaParam = searchParams.get("nama");

    if (!namaParam || typeof namaParam !== "string") {
      return NextResponse.json({ error: "Nama kelas diperlukan." }, { status: 400 });
    }

    const namaNormalized = normalizeKelas(namaParam);

    // Coba 1: Cari persis (case-insensitive)
    const kelas = await prisma.kelas.findFirst({
      where: {
        kelas: {
          equals: namaNormalized,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (kelas) {
      return NextResponse.json({ id: kelas.id });
    }

    // Coba 2: Cari dengan spasi dihapus (misal: "XI PSPT1" vs "XI PSPT 1")
    const namaNoSpace = namaNormalized.replace(/\s/g, "");
    const kelasFallback = await prisma.kelas.findFirst({
      where: {
        kelas: {
          equals: namaNoSpace,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (kelasFallback) {
      return NextResponse.json({ id: kelasFallback.id });
    }

    // Coba 3: Cari dengan LIKE (jika masih gagal)
    const kelasLike = await prisma.kelas.findFirst({
      where: {
        kelas: {
          contains: namaNormalized.split(" ")[0], // ambil "XI"
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (kelasLike) {
      return NextResponse.json({ id: kelasLike.id });
    }

    return NextResponse.json({ error: "Kelas tidak ditemukan." }, { status: 404 });
  } catch (error) {
    console.error("Error fetching class ID:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}