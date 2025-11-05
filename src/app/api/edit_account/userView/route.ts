import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const { id, username, nama_lengkap, password } = await request.json();

    if (!id || !username) {
      return NextResponse.json(
        { error: "ID and Username are required for update" },
        { status: 400 }
      );
    }

    const updateData: any = {
      username,
      nama_lengkap,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.account.update({
      where: {
        id: id,
        role: "VIEW", // Ensure only VIEW roles are updated here
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Username sudah terdaftar" },
          { status: 409 }
        );
    }
    if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "User tidak ditemukan atau bukan role VIEW" },
          { status: 404 }
        );
    }
    console.error("Error updating VIEW user:", error);
    return NextResponse.json(
      { error: "Failed to update VIEW user" },
      { status: 500 }
    );
  }
}