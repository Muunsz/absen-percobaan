import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies, headers } from "next/headers";

export async function GET(req: NextRequest, context: { params: Promise<{ jurusan: string }> }) {
  try {
    const cookieStore = await cookies();
    const idClass = cookieStore.get("id_kelas")?.value;
    const { jurusan } = await context.params
    const jurusanParam = jurusan.toLowerCase()

    const getId = await prisma.kelas.findUnique({
      where: {
        id: Number(idClass),
      },
      select: {
        id: true,
        kelas: true,
        id_jurusan: true,
        Jurusan: {
          select: {
            jurusan: true,
          },
        },
        id_waliKelas: true,
      },
    })

    if (!getId || isNaN(getId.id_jurusan)) {
      return NextResponse.json({ message: "ID jurusan tidak valid" }, { status: 400 })
    }

    const jurusanData = await prisma.jurusan.findFirst({
      where: {
        id: getId.id_jurusan,
        jurusan: {
          equals: jurusanParam,
          mode: "insensitive",
        },
      },
      include: {
        kelas: true,
      },
    })

    if (!jurusanData) {
      return NextResponse.json({ message: "Jurusan tidak ditemukan", kelas: [] }, { status: 404 })
    }

    return NextResponse.json({
      message: "Data ditemukan",
      kelas: getId.id,
      nama_kelas: getId.kelas,
      id_jurusan: getId.id_jurusan,
      jurusan: getId.Jurusan.jurusan,
      id_waliKelas: getId.id_waliKelas,
    });
  } catch (error) {
    console.error("Error fetch kelas:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
