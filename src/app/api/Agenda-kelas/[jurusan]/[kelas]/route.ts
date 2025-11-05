import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFileToBox } from "@/lib/box-upload";

const formatTime = (d: Date) => d.toTimeString().split(" ")[0].substring(0, 5);

function createLocalDate(dateStr: string, timeStr: string): Date {
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return d;
}

async function parseFormDataWithBoxUpload(request: Request) {
  const formData = await request.formData();
  const result: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      result[key] = value;
    }
  });

  const file = formData.get('file') as File | null;
  if (file && file.size > 0) {
    try {
      const publicUrl = await uploadFileToBox(file);
      result.doc_path = publicUrl;
    } catch (error) {
      console.error("Box upload failed:", error);
      throw error;
    }
  } else {
    result.doc_path = null;
  }

  return result;
}

export async function GET(request: NextRequest, context: { params: Promise<{ jurusan: string; kelas: string }> }) {
  try {
    const params = await context.params;
    const { jurusan, kelas } = params;
    const { searchParams } = new URL(request.url);
    const fetchType = searchParams.get("fetch");
    const normalizedKelas = decodeURIComponent(kelas).replace(/-/g, " ");

    if (fetchType === "guru") {
      const teachers = await prisma.account.findMany({
        where: { role: "GURU", id_mapel: { not: null } },
        select: {
          id: true,
          nama_lengkap: true,
          mapel: { select: { mapel: true } },
        },
        orderBy: { nama_lengkap: "asc" },
      });
      const formattedTeachers = teachers.map((teacher) => ({
        id: teacher.id,
        namaGuru: teacher.nama_lengkap ?? "Guru Tidak Tersedia",
        namaMapel: teacher.mapel?.mapel ?? "Mata Pelajaran Tidak Tersedia",
      }));
      return NextResponse.json(formattedTeachers);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const startOfDay = new Date(`${todayStr}T00:00:00.000Z`);
    const nextDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const kelasData = await prisma.kelas.findFirst({
      where: { kelas: { contains: normalizedKelas, mode: "insensitive" } },
    });

    if (!kelasData) {
      return NextResponse.json({ error: "Kelas tidak ditemukan." }, { status: 404 });
    }

    const agenda = await prisma.agenda_Kelas.findMany({
      where: {
        id_class: kelasData.id,
        date: {
          gte: startOfDay,
          lt: nextDay
        },
      },
      select: {
        id: true,
        date: true,
        time_start: true,
        time_end: true,
        materi: true,
        keterangan: true,
        doc_path: true,
        guru: { select: { nama_lengkap: true } },
        mapel: { select: { mapel: true } },
      },
      orderBy: { time_start: "asc" },
    });

    const formattedAgenda = agenda.map((item) => ({
      id: item.id,
      tanggal: item.date.toISOString().split("T")[0],
      jam: `${formatTime(item.time_start)} - ${formatTime(item.time_end)}`,
      namaGuru: item.guru?.nama_lengkap ?? "Guru Tidak Diketahui",
      namaMapel: item.mapel?.mapel ?? "Mapel Tidak Diketahui",
      materi: item.materi,
      keterangan: item.keterangan ?? "",
      dokumentasi: item.doc_path ?? "",
      jamMulai: formatTime(item.time_start),
      jamSelesai: formatTime(item.time_end),
    }));

    return NextResponse.json(formattedAgenda);
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return NextResponse.json({ error: `Gagal mengambil data: ${(error as Error).message}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ jurusan: string; kelas: string }> }) {
  try {
    const params = await context.params;
    const { kelas } = params;
    const body = await parseFormDataWithBoxUpload(request);
    const { tanggal, namaGuru, jamMulai, jamSelesai, namaMapel, materi, keterangan, doc_path } = body;
    const normalizedKelas = decodeURIComponent(kelas).replace(/-/g, " ");

    const guru = await prisma.account.findFirst({ where: { nama_lengkap: namaGuru } });
    const mapel = await prisma.mapel.findFirst({ where: { mapel: namaMapel } });
    const kelasData = await prisma.kelas.findFirst({
      where: { kelas: { contains: normalizedKelas, mode: "insensitive" } },
    });

    if (!guru || !mapel || !kelasData) {
      return NextResponse.json(
        { error: "Guru, Mata Pelajaran, atau Kelas tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const dateOnly = new Date(`${tanggal}T00:00:00.000Z`);
    const timeStartSafe = createLocalDate(tanggal, jamMulai);
    const timeEndSafe = createLocalDate(tanggal, jamSelesai);

    const newAgenda = await prisma.agenda_Kelas.create({
      data: {
        date: dateOnly,
        id_class: kelasData.id,
        id_guru: guru.id,
        id_mapel: mapel.id,
        time_start: timeStartSafe,
        time_end: timeEndSafe,
        materi,
        keterangan,
        doc_path,
      },
      select: {
        id: true,
        date: true,
        time_start: true,
        time_end: true,
        materi: true,
        keterangan: true,
        doc_path: true,
        guru: { select: { nama_lengkap: true } },
        mapel: { select: { mapel: true } },
      },
    });

    const formattedNewAgenda = {
      id: newAgenda.id,
      tanggal: newAgenda.date.toISOString().split("T")[0],
      jam: `${formatTime(newAgenda.time_start)} - ${formatTime(newAgenda.time_end)}`,
      namaGuru: newAgenda.guru?.nama_lengkap ?? "Guru Tidak Diketahui",
      namaMapel: newAgenda.mapel?.mapel ?? "Mapel Tidak Diketahui",
      materi: newAgenda.materi,
      keterangan: newAgenda.keterangan ?? "",
      dokumentasi: newAgenda.doc_path ?? "",
      jamMulai,
      jamSelesai,
    };

    return NextResponse.json(formattedNewAgenda, { status: 201 });
  } catch (error: any) {
    console.error(`Error saving agenda: ${error}`);
    return NextResponse.json({ error: `Gagal menyimpan agenda: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ jurusan: string; kelas: string }> }) {
  try {
    const params = await context.params;
    const { kelas } = params;
    const body = await parseFormDataWithBoxUpload(request);
    const { id, tanggal, namaGuru, jamMulai, jamSelesai, namaMapel, materi, keterangan, doc_path } = body;
    const agendaId = parseInt(id);
    const normalizedKelas = decodeURIComponent(kelas).replace(/-/g, " ");

    if (isNaN(agendaId)) {
      return NextResponse.json({ error: "ID Agenda tidak valid." }, { status: 400 });
    }

    const guru = await prisma.account.findFirst({ where: { nama_lengkap: namaGuru } });
    const mapel = await prisma.mapel.findFirst({ where: { mapel: namaMapel } });
    const kelasData = await prisma.kelas.findFirst({
      where: { kelas: { contains: normalizedKelas, mode: "insensitive" } },
    });

    if (!guru || !mapel || !kelasData) {
      return NextResponse.json(
        { error: "Guru, Mata Pelajaran, atau Kelas tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const timeStartSafe = createLocalDate(tanggal, jamMulai);
    const timeEndSafe = createLocalDate(tanggal, jamSelesai);

    const existingAgenda = await prisma.agenda_Kelas.findUnique({
      where: { id: agendaId, id_class: kelasData.id },
      select: { doc_path: true }
    });

    if (!existingAgenda) {
      return NextResponse.json({ error: "Agenda tidak ditemukan." }, { status: 404 });
    }

    const updatedAgenda = await prisma.agenda_Kelas.update({
      where: { id: agendaId, id_class: kelasData.id },
      data: {
        id_guru: guru.id,
        id_mapel: mapel.id,
        time_start: timeStartSafe,
        time_end: timeEndSafe,
        materi,
        keterangan,
        doc_path: doc_path !== undefined ? doc_path : existingAgenda.doc_path,
      },
      select: {
        id: true,
        date: true,
        time_start: true,
        time_end: true,
        materi: true,
        keterangan: true,
        doc_path: true,
        guru: { select: { nama_lengkap: true } },
        mapel: { select: { mapel: true } },
      },
    });

    const formattedUpdatedAgenda = {
      id: updatedAgenda.id,
      tanggal: updatedAgenda.date.toISOString().split("T")[0],
      jam: `${formatTime(updatedAgenda.time_start)} - ${formatTime(updatedAgenda.time_end)}`,
      namaGuru: updatedAgenda.guru?.nama_lengkap ?? "Guru Tidak Diketahui",
      namaMapel: updatedAgenda.mapel?.mapel ?? "Mapel Tidak Diketahui",
      materi: updatedAgenda.materi,
      keterangan: updatedAgenda.keterangan ?? "",
      dokumentasi: updatedAgenda.doc_path ?? "",
      jamMulai,
      jamSelesai,
    };

    return NextResponse.json(formattedUpdatedAgenda, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating agenda: ${error}`);
    return NextResponse.json({ error: `Gagal memperbarui agenda: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ jurusan: string; kelas: string }> }) {
  try {
    const params = await context.params;
    const { kelas } = params;
    const body = await request.json();
    const { id } = body;
    const normalizedKelas = decodeURIComponent(kelas).replace(/-/g, " ");
    const kelasData = await prisma.kelas.findFirst({
      where: { kelas: { contains: normalizedKelas, mode: "insensitive" } },
    });
    if (!kelasData) {
      return NextResponse.json({ error: "Kelas tidak ditemukan." }, { status: 404 });
    }
    await prisma.agenda_Kelas.delete({
      where: { id, id_class: kelasData.id },
    });
    return NextResponse.json({ message: "Agenda berhasil dihapus." }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Agenda tidak ditemukan atau sudah dihapus." }, { status: 404 });
    }
    console.error(`Error deleting agenda: ${error}`);
    return NextResponse.json({ error: `Gagal menghapus agenda: ${error.message}` }, { status: 500 });
  }
}