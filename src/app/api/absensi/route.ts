import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jurusans = await prisma.jurusan.findMany({
      select: {
        id: true,
        jurusan: true,
      },
    });

    return NextResponse.json(jurusans);
  } catch (error) {
    console.error("Error fetching jurusans:", error);
    return NextResponse.json({ error: "Gagal mengambil data jurusan" }, { status: 500 });
  }
}