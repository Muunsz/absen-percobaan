import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_kelas = parseInt(searchParams.get("id_kelas") || "0");

  if (!id_kelas) {
    return NextResponse.json({ error: "id_kelas tidak ditemukan" }, { status: 400 });
  }

  const students = await prisma.siswa.findMany({
    where: { id_class: id_kelas },
    select: { NIS: true, Nama: true, JK: true },
    orderBy: { Nama: "asc" },
  });

  return NextResponse.json(students);
}
