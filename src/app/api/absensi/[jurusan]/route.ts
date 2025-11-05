import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, context: { params: Promise<{ jurusan: string }> }) {
  try {
    const { jurusan } = await context.params
    const jurusanParam = jurusan.toLowerCase()

    const jurusanData = await prisma.jurusan.findFirst({
      where: {
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
      kelas: jurusanData.kelas,
    })
  } catch (error) {
    console.error("Error fetch kelas:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
