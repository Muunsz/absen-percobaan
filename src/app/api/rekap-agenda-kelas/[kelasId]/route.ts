import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise <{ kelasId: string }> }
) {
  const { kelasId } = await params
  const kelasIdNum = Number(kelasId)

  try {
    const [kelas, agendas, siswa] = await Promise.all([
      prisma.kelas.findUnique({ where: { id: kelasIdNum } }),
      prisma.agenda_Kelas.findMany({
        where: { id_class: kelasIdNum },
        include: { guru: true, mapel: true, kelas: true },
      }),
      prisma.siswa.findMany({
        where: { id_class: kelasIdNum },
        include: { kelas: true },
      }),
    ])

    if (!kelas) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ kelas, agendas, siswa })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Gagal mengambil data kelas" }, { status: 500 })
  }
}