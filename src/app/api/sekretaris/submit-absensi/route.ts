import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma, Absent } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { absensi, id_kelas } = (await req.json()) as {
      absensi: Record<string, unknown>;
      id_kelas: number | string;
    };

    if (!absensi || !id_kelas) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const data: Prisma.AbsensiCreateManyInput[] = Object.entries(absensi).map(
      ([nis, keterangan]) => ({
        id_siswa: nis,
        keterangan: keterangan as Absent,
        tanggal: new Date(),
        id_kelas: Number(id_kelas),
      })
    );

    await prisma.absensi.createMany({ data });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
