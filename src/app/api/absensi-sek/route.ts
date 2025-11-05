import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const idClass = cookieStore.get("id_kelas")?.value;
    try {
      const myKelas = await prisma.kelas.findUnique({
        where: {
          id: Number(idClass),
        },
        select: {
          id: true,
          kelas: true,
          Jurusan: {
            select:
            {
              id: true,
              jurusan: true
            }
          },
        },
      });

      const kelas = myKelas?.kelas;
      const jurusan = myKelas?.Jurusan.jurusan;

      const getAll = {
        id: myKelas?.id,
        kelas: kelas,
        jurusan: jurusan
      };

      return NextResponse.json(getAll);
    } catch (error) {
      console.error("Error fetching jurusans:", error);
      return NextResponse.json({ error: "Gagal mengambil data jurusan" }, { status: 500 });
    }
}