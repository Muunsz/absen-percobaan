// app/api/calendar/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Helper: Konversi string "HH:mm" ke Date (UTC 1970-01-01)
 */
function timeStringToDate(timeStr: string | null): Date | null {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return null;
  return new Date(Date.UTC(1970, 0, 1, hour, minute, 0));
}

/**
 * @brief GET /api/calendar/[id]
 * Mengambil detail agenda berdasarkan ID.
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

    return NextResponse.json({
      id: agenda.id.toString(),
      date: agenda.date.toISOString().split("T")[0],
      time_start: agenda.time_start ? agenda.time_start.toISOString().substring(11, 16) : "",
      time_end: agenda.time_end ? agenda.time_end.toISOString().substring(11, 16) : "",
      materi: agenda.materi || "",
      judul: agenda.deskripsi || "Agenda Tanpa Judul",
      deskripsi: agenda.keterangan || "",
      lokasi: agenda.lokasi || "", // ✅ Pastikan string
      id_guru: agenda.id_guru,
      id_kelas: agenda.id_kelas,
      doc_path: agenda.doc_path || "",
    });
  } catch (error) {
    console.error("Error fetching agenda:", error);
    return NextResponse.json({ error: "Gagal mengambil detail agenda" }, { status: 500 });
  }
}

/**
 * @brief PUT /api/calendar/[id]
 * Memperbarui agenda berdasarkan ID.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await request.formData();
    const judul = (formData.get("judul") as string)?.trim();
    const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
    const materi = (formData.get("materi") as string)?.trim() || "";
    const tanggal = formData.get("tanggal") as string;
    const jamMulai = formData.get("jamMulai") as string | null;
    const jamSelesai = formData.get("jamSelesai") as string | null;
    const lokasi = (formData.get("lokasi") as string)?.trim() || ""; // ✅ JANGAN kirim null
    const guruId = Number(formData.get("guruId"));
    const kelasId = formData.get("kelasId") ? Number(formData.get("kelasId")) : null;

    if (!judul || !tanggal || isNaN(guruId)) {
      return NextResponse.json({ error: "Judul, tanggal, dan guru wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.agenda_Khusus.update({
      where: { id },
      data: {
        deskripsi: judul,
        keterangan: deskripsi,
        date: new Date(tanggal),
        time_start: timeStringToDate(jamMulai) ?? new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
        time_end: timeStringToDate(jamSelesai) ?? new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
        materi: materi,
        lokasi: lokasi, // ✅ string, bukan null → sesuai Prisma
        id_guru: guruId,
        id_kelas: kelasId,
      },
    });

    return NextResponse.json({
      id: updated.id.toString(),
      date: updated.date.toISOString().split("T")[0],
      time_start: updated.time_start ? updated.time_start.toISOString().substring(11, 16) : "",
      time_end: updated.time_end ? updated.time_end.toISOString().substring(11, 16) : "",
      materi: updated.materi || "",
      judul: updated.deskripsi || "Agenda Diperbarui",
      deskripsi: updated.keterangan || "",
      lokasi: updated.lokasi || "",
      id_guru: updated.id_guru,
      id_kelas: updated.id_kelas,
      doc_path: updated.doc_path || "",
    });
  } catch (error) {
    console.error("Error updating agenda:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Gagal memperbarui agenda" }, { status: 500 });
  }
}

/**
 * @brief DELETE /api/calendar/[id]
 * Menghapus agenda berdasarkan ID.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.agenda_Khusus.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agenda:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Agenda tidak ditemukan untuk dihapus" }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Gagal menghapus agenda" }, { status: 500 });
  }
}