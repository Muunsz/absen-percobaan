import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.mapel.delete({ where: { id: Number(id) } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Gagal menghapus mapel" }, { status: 500 });
  }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const { nama } = await req.json();
      const { id } = await context.params;
      const updated = await prisma.mapel.update({
        where: { id: Number(id) },
        data: { mapel : nama }, // ✅ update the correct field
      });
  
      return Response.json(updated);
    } catch (error) {
      console.error(error);
      return Response.json(
        { error: "Gagal mengupdate mata pelajaran" },
        { status: 500 }
      );
    }
  }