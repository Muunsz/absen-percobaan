import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, nama_lengkap, password, role, id_mapel } = await req.json();

    if (!username || !nama_lengkap || !password || !role || !id_mapel) {
      return NextResponse.json(
        { error: "Username, nama lengkap, password, role, dan mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.account.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 } 
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data: any = {
      username,
      nama_lengkap,
      password: hashedPassword,
      role,
      id_mapel: Number(id_mapel),
    };

    const newUser = await prisma.account.create({ data });

    const userWithDetails = await prisma.account.findUnique({
        where: { id: newUser.id },
        select: {
            id: true,
            username: true,
            nama_lengkap: true,
            role: true,
            id_mapel: true,
            mapel: { 
                select: {
                    mapel: true
                }
            }
        }
    });

    if (!userWithDetails) {
        return NextResponse.json({ error: "Gagal mengambil data setelah pembuatan akun" }, { status: 500 });
    }

    const responseData = {
        id: userWithDetails.id,
        username: userWithDetails.username,
        nama_lengkap: userWithDetails.nama_lengkap,
        role: userWithDetails.role,
        id_mapel: userWithDetails.id_mapel,
        mataPelajaran: userWithDetails.mapel?.mapel || 'N/A'
    };

    return NextResponse.json(responseData, { status: 201 }); 

  } catch (error: any) {
    console.error("Add account error:", error);
    if (error.code === 'P2002') { 
        return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

