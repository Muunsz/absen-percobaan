import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sekertarisUsers = await prisma.account.findMany({
      where: {
        role: "SEKRETARIS",
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
        id_kelas: true,
        kelas: {
          select: {
            kelas: true,
          },
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    const formattedUsers = sekertarisUsers.map(user => ({
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap, 
      role: user.role,
      id_kelas: user.id_kelas,
      kelas: user.kelas?.kelas || 'Belum diatur',
    }));

    return NextResponse.json(formattedUsers, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch sekertaris users:", error);
    return NextResponse.json(
      { error: "Gagal memuat data sekertaris" },
      { status: 500 }
    );
  }
}

