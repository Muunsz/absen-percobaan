import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const kelasId = searchParams.get("kelasId")
    const where = kelasId ? { id_class: Number(kelasId) } : undefined
    const list = await prisma.siswa.findMany({ where, orderBy: { Nama: "asc" } })
    const mapped = list.map((s) => ({
      id: Number(s.NIS) || s.NIS, // keep original NIS as id where possible
      nis: s.NIS,
      nama: s.Nama,
      jenisKelamin: s.JK === "L" ? "Laki-laki" : "Perempuan",
      status: s.status === "Aktif" ? "Aktif" : "Nonaktif",
      kelas_id: s.id_class,
      angkatan: new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    return NextResponse.json(mapped)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch siswa" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh membuat siswa" }, { status: 400 })
    const body = await req.json()
    const { nis, nama, jenisKelamin, status, kelas_id } = body
    if (!nis || !nama) return NextResponse.json({ error: "NIS dan nama wajib diisi" }, { status: 400 })
    const created = await prisma.siswa.create({
      data: {
        NIS: String(nis),
        Nama: String(nama),
        JK: jenisKelamin === "Laki-laki" ? "L" : "P",
        status: status === "Aktif" ? "Aktif" : "NonAktif",
        id_class: Number(kelas_id) || 0,
      },
    })
    return NextResponse.json({ nis: created.NIS, nama: created.Nama }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create siswa" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh mengubah siswa" }, { status: 400 })
    const body = await req.json()
    const { nis, nama, jenisKelamin, status, kelas_id } = body
    if (!nis) return NextResponse.json({ error: "NIS required" }, { status: 400 })
    const updated = await prisma.siswa.update({
      where: { NIS: String(nis) },
      data: {
        Nama: nama ? String(nama) : undefined,
        JK: jenisKelamin ? (jenisKelamin === "Laki-laki" ? "L" : "P") : undefined,
        status: status ? (status === "Aktif" ? "Aktif" : "NonAktif") : undefined,
        id_class: kelas_id != null ? Number(kelas_id) : undefined,
      },
    })
    return NextResponse.json({ nis: updated.NIS, nama: updated.Nama })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update siswa" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh menghapus siswa" }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const nis = searchParams.get("nis")
    if (!nis) return NextResponse.json({ error: "Missing nis" }, { status: 400 })
    // Remove dependent records (absensi) first to avoid foreign key constraint errors
    await prisma.absensi.deleteMany({ where: { id_siswa: String(nis) } }).catch(() => {})
    await prisma.siswa.delete({ where: { NIS: String(nis) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    // If delete failed because the record doesn't exist, return a helpful message
    return NextResponse.json({ error: (err as Error)?.message || "Failed to delete siswa" }, { status: 500 })
  }
}
