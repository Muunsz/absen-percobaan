// app/api/guru/calendar/kelas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kelasList = await prisma.kelas.findMany({
      select: {
        id: true,
        kelas: true,
        Jurusan: { select: { jurusan: true } },
      },
      orderBy: { kelas: "asc" },
    });

    return NextResponse.json(
      kelasList.map(k => ({
        id: k.id,
        nama: k.Jurusan ? `${k.kelas} ${k.Jurusan.jurusan}` : k.kelas,
      }))
    );
  } catch (error) {
    console.error("Error fetching kelas:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar kelas" }, { status: 500 });
  }
}