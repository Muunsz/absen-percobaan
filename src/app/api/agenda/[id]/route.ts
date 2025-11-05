// app/api/agenda/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * @brief Helper untuk mengubah string waktu "HH:mm" menjadi format "HH:mm:ss"
 */
function timeStringToDate(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return null;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
}

/**
 * @brief GET /api/agenda/[id]
 * Mengambil detail satu agenda berdasarkan ID.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const agenda = await prisma.agenda_Khusus.findUnique({
      where: { id },
    });

    if (!agenda) {
      return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
    }

    // Kembalikan data yang telah ditransformasi
    return NextResponse.json({
      id: agenda.id.toString(),
      date: agenda.date.toISOString().split("T")[0],
      time_start: agenda.time_start ? agenda.time_start.toISOString().substring(11, 16) : "",
      time_end: agenda.time_end ? agenda.time_end.toISOString().substring(11, 16) : "",
      materi: agenda.materi || "",
      judul: agenda.deskripsi || "Agenda Tanpa Judul", // deskripsi DB → judul FE
      deskripsi: agenda.keterangan || "", // keterangan DB → deskripsi FE
      lokasi: agenda.lokasi || "",
      id_guru: agenda.id_guru,
      id_kelas: agenda.id_kelas,
      doc_path: agenda.doc_path || "",
    });
  } catch (error) {
    console.error("Error fetching agenda by ID:", error);

    // Tangani error khusus Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Gagal mengambil detail agenda" }, { status: 500 });
  }
}

/**
 * @brief PUT /api/agenda/[id]
 * Memperbarui satu agenda berdasarkan ID.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await request.formData();
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string | null;
    const materi = formData.get("materi") as string | null;
    const tanggal = formData.get("tanggal") as string;
    const jamMulai = formData.get("jamMulai") as string | null;
    const jamSelesai = formData.get("jamSelesai") as string | null;
    const lokasi = formData.get("lokasi") as string | null;
    const guruId = Number(formData.get("guruId"));
    const kelasId = formData.get("kelasId") ? Number(formData.get("kelasId")) : null;

    // Validasi data wajib
    if (!judul?.trim() || !tanggal || isNaN(guruId)) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    
    // Update data di database
const updated = await prisma.agenda_Khusus.update({
  where: { id },
  data: { // ✅ Tambahkan ``
    deskripsi: judul.trim(),
    keterangan: deskripsi?.trim() || null,
    date: new Date(tanggal),
    time_start: timeStringToDate(jamMulai) ? new Date(`1970-01-01T${timeStringToDate(jamMulai)}Z`) : "0",
    time_end: timeStringToDate(jamSelesai) ? new Date(`1970-01-01T${timeStringToDate(jamSelesai)}Z`) : "0",
    materi: materi || "",
    lokasi: lokasi || "",
    id_guru: guruId,
    id_kelas: kelasId,
  },
});

    // Kembalikan data yang telah diperbarui
    return NextResponse.json({
      id: updated.id.toString(),
      date: updated.date.toISOString().split("T")[0],
      time_start: updated.time_start ? updated.time_start.toISOString().substring(11, 16) : "",
      time_end: updated.time_end ? updated.time_end.toISOString().substring(11, 16) : "",
      materi: updated.materi || "",
      judul: updated.deskripsi || "Agenda Diperbarui", // deskripsi DB → judul FE
      deskripsi: updated.keterangan || "", // keterangan DB → deskripsi FE
      lokasi: updated.lokasi || "",
      id_guru: updated.id_guru,
      id_kelas: updated.id_kelas,
      doc_path: updated.doc_path || "",
    });
  } catch (error) {
    console.error("Error updating agenda:", error);

    // Tangani error khusus Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Agenda tidak ditemukan untuk diperbarui" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Gagal memperbarui agenda" }, { status: 500 });
  }
}

/**
 * @brief DELETE /api/agenda/[id]
 * Menghapus satu agenda berdasarkan ID.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Hapus data dari database
    await prisma.agenda_Khusus.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agenda:", error);

    // Tangani error khusus Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Agenda tidak ditemukan untuk dihapus" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Gagal menghapus agenda" }, { status: 500 });
  }
}