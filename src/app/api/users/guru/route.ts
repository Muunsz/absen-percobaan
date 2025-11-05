// app/api/users/guru/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const guruUsers = await prisma.account.findMany({
      where: {
        role: "GURU",
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true, // [FIX] Tambahkan ini untuk mengambil nama lengkap
        role: true,
        id_mapel: true,
        mapel: {
          select: {
            mapel: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    // [PENTING] Format ulang data agar cocok dengan tipe 'User' di frontend
    const formattedUsers = guruUsers.map(user => ({
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap, // [FIX] Tambahkan ini ke objek respons
      role: user.role,
      id_mapel: user.id_mapel,
      mataPelajaran: user.mapel?.mapel || 'Belum diatur',
    }));

    // Kirim data yang sudah diformat
    return NextResponse.json(formattedUsers, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch guru users:", error);
    return NextResponse.json(
      { error: "Gagal memuat data guru" },
      { status: 500 }
    );
  }
}

