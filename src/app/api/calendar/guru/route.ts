// app/api/calendar/guru/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const guruList = await prisma.account.findMany({
      where: { role: "GURU" },
      select: { id: true, nama_lengkap: true, username: true },
      orderBy: { nama_lengkap: "asc" },
    });

    return NextResponse.json(
      guruList.map(g => ({
        id: g.id,
        nama_lengkap: g.nama_lengkap || g.username // fallback ke username
      }))
    );
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar guru" }, { status: 500 });
  }
}