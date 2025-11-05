import { prisma } from "@/lib/prisma"
import { Absent } from "@prisma/client"

export type DashboardData = {
  totalSiswa: number
  siswaLakiLaki: number
  siswaPerempuan: number
  absensiHariIni: {
    hadir: number
    izin: number
    sakit: number
    alfa: number
  }
  kehadiranMingguan: {
    name: string
    hadir: number
    total: number
  }[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const today = new Date()
  const todayLocalString = today.toLocaleDateString('sv-SE')

  const [year, month, day] = todayLocalString.split('-').map(Number)
  const startOfDayUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  const endOfDayUTC = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0))

  const startOfWeek = new Date(startOfDayUTC)
  startOfWeek.setDate(startOfDayUTC.getDate() - startOfDayUTC.getDay())

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  
  const [
    totalSiswa, 
    siswaLakiLaki, 
    siswaPerempuan, 
    absensiMingguIni
  ] = await Promise.all([
    prisma.siswa.count(),
    prisma.siswa.count({ where: { JK: "L" } }),
    prisma.siswa.count({ where: { JK: "P" } }),
    prisma.absensi.findMany({
      where: {
        tanggal: {
          gte: startOfWeek,
          lte: endOfWeek, 
        },
      },
      select: {
        keterangan: true,
        tanggal: true,
      },
    }),
  ])
  
  const absensiHariIniCounts = absensiMingguIni
    .filter(absensi => {
      return absensi.tanggal >= startOfDayUTC && absensi.tanggal < endOfDayUTC
    })
    .reduce((acc, curr) => {
      acc[curr.keterangan] = (acc[curr.keterangan] || 0) + 1
      return acc
    }, {} as Record<Absent, number>)

  const totalSiswaPerHari = totalSiswa
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  
  const hadirPerHariMap = new Map<string, number>()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    hadirPerHariMap.set(date.toDateString(), 0)
  }

  absensiMingguIni.forEach(absensi => {
    if (absensi.keterangan === "HADIR") {
      const dateString = absensi.tanggal.toDateString()
      if (hadirPerHariMap.has(dateString)) {
        hadirPerHariMap.set(dateString, hadirPerHariMap.get(dateString)! + 1)
      }
    }
  })

  const kehadiranMingguan = days.map((day, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)
    const dateString = date.toDateString()

    const hadirCount = hadirPerHariMap.get(dateString) || 0
    
    const percent = totalSiswaPerHari > 0 ? Math.round((hadirCount / totalSiswaPerHari) * 100) : 0

    return {
      name: day,
      hadir: percent,
      total: totalSiswaPerHari,
    }
  })

  const finalResult = {
    totalSiswa,
    siswaLakiLaki,
    siswaPerempuan,
    absensiHariIni: {
      hadir: absensiHariIniCounts.HADIR || 0,
      izin: absensiHariIniCounts.IZIN || 0,
      sakit: absensiHariIniCounts.SAKIT || 0,
      alfa: absensiHariIniCounts.ALPA || 0,
    },
    kehadiranMingguan,
  }

  return finalResult
}