import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jurusans = await prisma.jurusan.findMany({
      select: {
        id: true,
        jurusan: true,
      },
    });

    return NextResponse.json(jurusans);
  } catch (error) {
    console.error("Error fetching jurusans:", error);
    return NextResponse.json({ error: "Gagal mengambil data jurusan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const { jurusan } = await req.json();

        if (!jurusan) {
            return NextResponse.json(
                { error: "Jurusan name are required" },
                { status: 400 }
            );
        }

        const newJurusan = await prisma.jurusan.create({
            data: {
              jurusan : jurusan,
            },
          });

          return NextResponse.json(newJurusan, { status: 201 });
    } catch (error) {
        console.error("add jurusan error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}