// app/api/agenda/guru/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.account.findMany({
      where: { role: "GURU" },
      select: { id: true, nama_lengkap: true, username: true },
      orderBy: { nama_lengkap: "asc" },
    });

    const formattedTeachers = teachers.map((teacher) => ({
      id: teacher.id,
      nama_lengkap: teacher.nama_lengkap || teacher.username,
    }));

    return NextResponse.json(formattedTeachers);
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar guru" }, { status: 500 });
  }
}