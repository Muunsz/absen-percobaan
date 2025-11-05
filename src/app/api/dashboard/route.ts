import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()
    const firstDayOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    )

    const agendaKhusus = await prisma.agenda_Khusus.findMany({
      where: {
        date: {
          gte: firstDayOfThisMonth,
          lt: firstDayOfNextMonth, 
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        guru: {
          select: {
            role: true,
            nama_lengkap: true,
          },
        },
        kelas: {
          select: {
            kelas: true,
          },
        },
      },
    })

    const formattedData = agendaKhusus.map((item) => ({
      id: item.id,
      tanggal: new Date(item.date).toISOString().split("T")[0],
      judul: item.materi,
      kelas: item.kelas ? item.kelas.kelas : "-",
      oleh: item.guru?.nama_lengkap ?? "Sistem",
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Gagal mengambil data agenda:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}