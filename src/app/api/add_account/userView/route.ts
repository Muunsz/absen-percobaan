import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, nama_lengkap, password, role } = await request.json();

    if (!username || !password || role !== "VIEW") {
      return NextResponse.json(
        { error: "Username, password, and correct role are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.account.create({
      data: {
        username,
        nama_lengkap,
        password: hashedPassword,
        role: "VIEW",
      },
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Username sudah terdaftar" },
          { status: 409 }
        );
    }
    console.error("Error creating VIEW user:", error);
    return NextResponse.json(
      { error: "Failed to create VIEW user" },
      { status: 500 }
    );
  }
}