// app/api/agenda/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function timeStringToDate(timeStr: string | null): Date | null {
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return null;
  return new Date(`1970-01-01T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00Z`);
}

export async function GET() {
  try {
    const agendas = await prisma.agenda_Khusus.findMany({
      orderBy: { date: "asc" },
    });
    const transformed = agendas.map((a) => ({
      id: a.id.toString(),
      date: a.date.toISOString().split("T")[0],
      time_start: a.time_start ? a.time_start.toISOString().substring(11, 16) : "",
      time_end: a.time_end ? a.time_end.toISOString().substring(11, 16) : "",
      materi: a.materi || "",
      judul: a.deskripsi || "Agenda Tanpa Judul",
      deskripsi: a.keterangan || "",
      lokasi: a.lokasi || "",
      id_guru: a.id_guru,
      id_kelas: a.id_kelas,
      doc_path: a.doc_path || "",
    }));
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching agendas:", error);
    return NextResponse.json({ error: "Gagal mengambil data agenda" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const judul = (formData.get("judul") as string)?.trim();
    const tanggal = formData.get("tanggal") as string;
    const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
    const materi = (formData.get("materi") as string)?.trim() || "";
    const jamMulai = formData.get("jamMulai") as string | null;
    const jamSelesai = formData.get("jamSelesai") as string | null;
    const lokasi = (formData.get("lokasi") as string)?.trim() || "";
    const guruId = Number(formData.get("guruId"));
    const kelasId = formData.get("kelasId") ? Number(formData.get("kelasId")) : null;

    if (!judul || !tanggal || isNaN(guruId)) {
      return NextResponse.json({ error: "Judul, tanggal, dan guru wajib diisi" }, { status: 400 });
    }

    let docPath = null;
    const attachment = formData.get("attachment") as File | null;
    if (attachment) {
      docPath = `/uploads/${Date.now()}_${attachment.name}`;
      // TODO: Simpan file ke disk/cloud
    }

    const newAgenda = await prisma.agenda_Khusus.create({
      data: {
        deskripsi: judul,
        keterangan: deskripsi,
        date: new Date(tanggal),
        time_start: timeStringToDate(jamMulai) ?? new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
        time_end: timeStringToDate(jamSelesai) ?? new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
        materi: materi,
        lokasi: lokasi,
        id_guru: guruId,
        id_kelas: kelasId,
        doc_path: docPath,
      },
    });

    return NextResponse.json(
      {
        id: newAgenda.id.toString(),
        date: newAgenda.date.toISOString().split("T")[0],
        time_start: newAgenda.time_start ? newAgenda.time_start.toISOString().substring(11, 16) : "",
        time_end: newAgenda.time_end ? newAgenda.time_end.toISOString().substring(11, 16) : "",
        materi: newAgenda.materi,
        judul: newAgenda.deskripsi || "Agenda Baru",
        deskripsi: newAgenda.keterangan || "",
        lokasi: newAgenda.lokasi,
        id_guru: newAgenda.id_guru,
        id_kelas: newAgenda.id_kelas,
        doc_path: newAgenda.doc_path || "",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating agenda:", error);
    return NextResponse.json({ error: "Gagal menambahkan agenda" }, { status: 500 });
  }
}