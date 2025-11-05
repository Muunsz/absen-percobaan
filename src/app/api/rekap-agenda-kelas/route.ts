import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [kelas, jurusan, agendas, siswa] = await Promise.all([
      prisma.kelas.findMany({
        include: { Jurusan: true, Account_kelas_id_waliKelasToAccount: true },
      }),
      prisma.jurusan.findMany(),
      prisma.agenda_Kelas.findMany({
        include: { guru: true, mapel: true, kelas: true },
      }),
      prisma.siswa.findMany({
        include: { kelas: true },
      }),
    ])

    return NextResponse.json({ kelas, jurusan, agendas, siswa })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 })
  }
}