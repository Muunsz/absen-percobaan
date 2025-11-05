import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const options = await prisma.kelas.findMany({
      select: {
        id: true,
        kelas: true,
        id_jurusan: true,
        Jurusan: { select: { jurusan: true } },
      },
      orderBy: { kelas: "asc" },
    });
    
    const flattened = options.map((o) => ({
      id: o.id,
      kelas: o.kelas,
      id_jurusan: o.id_jurusan,
      jurusan: o.Jurusan.jurusan, // flatten
    }));
    
    return NextResponse.json(flattened);
    
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    );
  }
}