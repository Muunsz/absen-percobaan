import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Absent } from "@prisma/client"

type RouteContext = { params: Promise <{ jurusan: string; kelas: string }> }

function getUTCDateStart(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const url = new URL(req.url)
    const checkOnly = url.searchParams.get('checkOnly') === 'true'
    const tanggalParam = url.searchParams.get('tanggal')

    const { jurusan, kelas } = await params;

    const decodedJurusan = decodeURIComponent(jurusan).trim()
    const decodedKelas = decodeURIComponent(kelas).trim()

    const foundKelas = await prisma.kelas.findFirst({
      where: {
        kelas: { equals: decodedKelas, mode: "insensitive" },
        Jurusan: { jurusan: { equals: decodedJurusan, mode: "insensitive" } },
      },
      include: { siswa: true, Jurusan: true },
    })

    if (!foundKelas) {
      return NextResponse.json({ message: "Kelas tidak ditemukan" }, { status: 404 })
    }

    if (checkOnly && tanggalParam) {
      const tanggal = getUTCDateStart(tanggalParam)

      const existing = await prisma.absensi.findMany({
        where: { id_kelas: foundKelas.id, tanggal },
        select: { id_siswa: true },
      })

      if (existing.length > 0) {
        const duplikat = Array.from(new Set(existing.map((e) => e.id_siswa)))
        return NextResponse.json(
          {
            message: "Sudah ada absensi untuk beberapa/semua siswa pada tanggal tersebut",
            duplikat,
          },
          { status: 409 },
        )
      }

      return NextResponse.json({ message: "Belum ada absensi untuk tanggal ini" }, { status: 200 })
    }

    const siswaValid = foundKelas.siswa

    let absensiHarian:
  | { id_siswa: string; id_kelas: number | null; keterangan: Absent; deskripsi: string | null }[]
  | [] = [];
  
    if (tanggalParam) {
      const tanggal = getUTCDateStart(tanggalParam)

      absensiHarian = await prisma.absensi.findMany({
        where: { id_kelas: foundKelas.id, tanggal },
      })
    }

    const siswaDenganAbsen = siswaValid.map((s) => {
      const absen = absensiHarian.find(a => a.id_siswa === s.NIS)
      return {
        NIS: s.NIS,
        Nama: s.Nama,
        JK: s.JK,
        status: s.status,
        absen: absen ? { status: absen.keterangan, deskripsi: absen.deskripsi || "" } : null
      }
    })

    return NextResponse.json({
      message: "Data siswa berhasil diambil",
      kelas: foundKelas.kelas,
      jurusan: foundKelas.Jurusan.jurusan,
      siswa: siswaDenganAbsen,
    })
  } catch (error) {
    console.error("Error fetching siswa:", error)
    return NextResponse.json({ message: "Server error", details: (error as Error).message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const body = await req.json()
    const list = Array.isArray(body?.absensi) ? body.absensi : null
    if (!list || list.length === 0) {
      return NextResponse.json({ message: "Data absensi tidak valid atau kosong" }, { status: 400 })
    }

    const dateStr: string | undefined = typeof body?.tanggal === "string" ? body.tanggal : undefined
    const currentDateString = new Date().toISOString().split("T")[0];
    const tanggal = dateStr ? getUTCDateStart(dateStr) : getUTCDateStart(currentDateString);

    const { jurusan, kelas } = await params;

    const decodedJurusan = decodeURIComponent(jurusan).trim()
    const decodedKelas = decodeURIComponent(kelas).trim()

    const foundKelas = await prisma.kelas.findFirst({
      where: {
        kelas: { equals: decodedKelas, mode: "insensitive" },
        Jurusan: { jurusan: { equals: decodedJurusan, mode: "insensitive" } },
      },
      select: { id: true },
    })

    if (!foundKelas) {
      return NextResponse.json({ message: "Kelas tidak ditemukan" }, { status: 404 })
    }

    const data = list.map((item: any) => ({
      id_kelas: foundKelas.id,
      id_siswa: String(item.NIS),
      keterangan: (String(item.status).toUpperCase() as Absent) ?? "HADIR",
      tanggal,
      deskripsi: item.deskripsi ? String(item.deskripsi) : null,
    }))

    await prisma.$transaction([
        prisma.absensi.deleteMany({
          where: { id_kelas: foundKelas.id, tanggal },
        }),
        prisma.absensi.createMany({ data })
    ])

    return NextResponse.json({ message: "Absensi berhasil diperbarui", total: data.length })
  } catch (error) {
    console.error("Error saving absensi (DB Transaction Failed):", error)
    return NextResponse.json({ 
        message: "Server error: Gagal menyimpan/memperbarui absensi. Periksa konfigurasi koneksi.", 
        details: (error as Error).message 
    }, { status: 500 })
  }
}