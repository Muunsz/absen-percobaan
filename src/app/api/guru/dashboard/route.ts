import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify, type JWTPayload } from "jose";

interface CustomJWTPayload extends JWTPayload {
  id: string;
  role: "GURU" | "ADMIN" | "SEKRETARIS" | "VIEW";
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}
const secret = new TextEncoder().encode(jwtSecret);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: CustomJWTPayload;
    try {
      const { payload: verified } = await jwtVerify(token, secret);
      payload = verified as CustomJWTPayload;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "GURU") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = Number(payload.id);
    if (isNaN(userId)) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const kelasWali = await prisma.kelas.findMany({
      where: { id_waliKelas: userId },
      select: { id: true },
    });
    const kelasIds = kelasWali.map(k => k.id);

    const absensiHariIni = await prisma.absensi.findMany({
      where: {
        id_kelas: { in: kelasIds },
        tanggal: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999),
        },
      },
      select: { keterangan: true },
    });

    const absensiCount = {
      hadir: absensiHariIni.filter(a => a.keterangan === "HADIR").length,
      izin: absensiHariIni.filter(a => a.keterangan === "IZIN").length,
      sakit: absensiHariIni.filter(a => a.keterangan === "SAKIT").length,
      alfa: absensiHariIni.filter(a => a.keterangan === "ALPA").length,
    };

    const totalSiswa = await prisma.siswa.count({
      where: { id_class: { in: kelasIds }, status: "Aktif" },
    });

    const agendaKelasGuruBulanIni = await prisma.agenda_Kelas.findMany({
      where: {
        id_guru: userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      include: {
        kelas: { select: { kelas: true, Jurusan: { select: { jurusan: true } } } },
        mapel: { select: { mapel: true } },
      },
      orderBy: {
        date: "asc",
      }
    });

    const agendaKhususBulanIni = await prisma.agenda_Khusus.findMany({
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      include: {
        kelas: { select: { kelas: true, Jurusan: { select: { jurusan: true } } } },
      },
      orderBy: {
        date: "asc",
      }
    });

    const allAgendaHariIni = await prisma.agenda_Kelas.findMany({
      where: {
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
      include: {
        guru: { select: { nama_lengkap: true, username: true } },
      },
    });

    const guruNames = new Set<string>();
    allAgendaHariIni.forEach(agenda => {
      const nama = agenda.guru.nama_lengkap || agenda.guru.username;
      if (nama) guruNames.add(nama);
    });

    return NextResponse.json({
      kelasSaya: {
        absensiHariIni: absensiCount,
        totalSiswa,
      },
      agenda: {
        agendaKelasGuru: agendaKelasGuruBulanIni.map(a => ({
          id: a.id.toString(),
          title: a.materi || "Agenda Kelas",
          date: a.date.toISOString().split("T")[0],
          description: a.keterangan || "",
          status: "aktif" as const,
          kelas: a.kelas ? `${a.kelas.kelas} ${a.kelas.Jurusan?.jurusan || ""}` : "Umum",
          mapel: a.mapel?.mapel || "Mapel Tidak Diketahui",
        })),
        agendaKhusus: agendaKhususBulanIni.map(a => ({
          id: a.id.toString(),
          title: a.materi,
          date: a.date.toISOString().split("T")[0],
          description: a.keterangan || "",
          kelas: a.kelas ? `${a.kelas.kelas} ${a.kelas.Jurusan?.jurusan || ""}` : "Umum",
          mapel: a.lokasi || "Kegiatan",
        })),
      },
      kpi: {
        guruBerpartisipasi: guruNames.size,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}