// app/api/guru/calendar/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(time: Date | null): string {
  if (!time) return "";
  return time.toISOString().substring(11, 16);
}

export async function GET() {
  try {
    const agendas = await prisma.agenda_Khusus.findMany({
      orderBy: { date: "asc" },
    });

    const transformed = agendas.map(a => ({
      id: a.id.toString(),
      date: formatDate(a.date),
      time_start: formatTime(a.time_start),
      time_end: formatTime(a.time_end),
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
    console.error("Error fetching guru calendar:", error);
    return NextResponse.json({ error: "Gagal mengambil data agenda" }, { status: 500 });
  }
}