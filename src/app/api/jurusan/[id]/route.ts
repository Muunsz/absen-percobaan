import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.jurusan.delete({ where: { id: Number(id) } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Gagal menghapus jurusan" }, { status: 500 });
  }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const { jurusan } = await req.json();
      const { id } = await context.params;
      const updated = await prisma.jurusan.update({
        where: { id: Number(id) },
        data: { jurusan : jurusan },
      });
  
      return Response.json(updated);
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Gagal mengupdate jurusan" },
        { status: 500 }
      );
    }
  }

 export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idx = Number(id);
    if (isNaN(idx)) {
      return NextResponse.json({ error: "ID jurusan tidak valid" }, { status: 400 });
    }

    const jurusan = await prisma.jurusan.findUnique({
      where: { id: idx },
      select: {
        id: true,
        jurusan: true,
      },
    });

    if (!jurusan) {
      return NextResponse.json({ error: "Jurusan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      id: jurusan.id,
      nama_jurusan: jurusan.jurusan,
    });
  } catch (error) {
    console.error("Error fetching jurusan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data jurusan" },
      { status: 500 }
    );
  }
}