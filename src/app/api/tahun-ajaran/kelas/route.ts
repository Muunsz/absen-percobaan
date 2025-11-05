import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function detectTingkat(name: string): "X" | "XI" | "XII" {
  const m = name.match(/^\s*(XII|XI|X)\b/i)
  if (!m) return "X"
  const t = m[1].toUpperCase()
  if (t === "X") return "X"
  if (t === "XI") return "XI"
  return "XII"
}

export async function GET() {
  try {
    const list = await prisma.kelas.findMany({ include: { Jurusan: true } })
    const mapped = list.map((k) => ({
      id: k.id,
      name_kelas: k.kelas,
      jurusan_id: k.id_jurusan,
      kelas_tingkat: detectTingkat(k.kelas),
      wali_kelas_id: k.id_waliKelas,
      deskripsi: "",
      angkatan: new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_arsip: false,
      kapasitas_siswa: 30,
    }))
    return NextResponse.json(mapped)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch kelas" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Guard: if request comes from a simulated client, refuse mutation
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh membuat kelas" }, { status: 400 })
    const body = await req.json()
    const { name_kelas, jurusan_id, wali_kelas_id } = body
    if (!name_kelas) return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 })
    const jurId = Number(jurusan_id)
    if (!jurId) return NextResponse.json({ error: "Jurusan tidak valid" }, { status: 400 })
    const jur = await prisma.jurusan.findUnique({ where: { id: jurId } })
    if (!jur) return NextResponse.json({ error: "Jurusan tidak ditemukan di database" }, { status: 400 })

    const waliId = Number(wali_kelas_id)
    if (!waliId) return NextResponse.json({ error: "Wali kelas tidak valid" }, { status: 400 })
    const wali = await prisma.account.findUnique({ where: { id: waliId } })
    if (!wali) return NextResponse.json({ error: "Wali kelas tidak ditemukan di database" }, { status: 400 })

    const created = await prisma.kelas.create({
      data: {
        kelas: String(name_kelas),
        id_jurusan: jurId,
        id_waliKelas: waliId,
      },
    })
    return NextResponse.json({ id: created.id, name_kelas: created.kelas }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create kelas" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh mengubah kelas" }, { status: 400 })
    const body = await req.json()
    const { id, name_kelas, jurusan_id, wali_kelas_id } = body
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    // validate jurusan and wali if provided
    if (jurusan_id != null) {
      const jId = Number(jurusan_id)
      if (!jId) return NextResponse.json({ error: "Jurusan tidak valid" }, { status: 400 })
      const jur = await prisma.jurusan.findUnique({ where: { id: jId } })
      if (!jur) return NextResponse.json({ error: "Jurusan tidak ditemukan di database" }, { status: 400 })
    }
    if (wali_kelas_id != null) {
      const wId = Number(wali_kelas_id)
      if (!wId) return NextResponse.json({ error: "Wali kelas tidak valid" }, { status: 400 })
      const wali = await prisma.account.findUnique({ where: { id: wId } })
      if (!wali) return NextResponse.json({ error: "Wali kelas tidak ditemukan di database" }, { status: 400 })
    }
    const updated = await prisma.kelas.update({
      where: { id: Number(id) },
      data: {
        kelas: name_kelas ? String(name_kelas) : undefined,
        id_jurusan: jurusan_id != null ? Number(jurusan_id) : undefined,
        id_waliKelas: wali_kelas_id != null ? Number(wali_kelas_id) : undefined,
      },
    })
    return NextResponse.json({ id: updated.id, name_kelas: updated.kelas })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update kelas" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const simHeader = req.headers.get("x-mode-simulasi")
    if (simHeader === "true") return NextResponse.json({ error: "Mode Simulasi aktif - tidak boleh menghapus kelas" }, { status: 400 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const nid = Number(id)
    // Attempt to clean up related data that may reference the class to avoid FK constraint errors.
    // Order matters: update optional relations to null, delete dependent records, then delete class.
    try {
      // Null out optional links from accounts (some accounts may reference a class via id_kelas)
      await prisma.account.updateMany({ where: { id_kelas: nid }, data: { id_kelas: null } })
      // Remove attendance and schedule related rows
      await prisma.absensi.deleteMany({ where: { id_kelas: nid } })
      await prisma.rekap_Agenda.deleteMany({ where: { id_class: nid } })
      await prisma.jadwal.deleteMany({ where: { id_class: nid } })
      await prisma.agenda_Kelas.deleteMany({ where: { id_class: nid } })
      // agenda_khusus.id_kelas is optional: set to null so we don't lose agenda entries
      await prisma.agenda_Khusus.updateMany({ where: { id_kelas: nid }, data: { id_kelas: null } })
      // delete siswa in that class (if any)
      await prisma.siswa.deleteMany({ where: { id_class: nid } })

      // Finally delete the class
      await prisma.kelas.delete({ where: { id: nid } })
      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error('Failed to delete kelas and its dependents:', e)
      return NextResponse.json({ error: 'Failed to delete kelas. See server logs for details.' }, { status: 500 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete kelas" }, { status: 500 })
  }
}
