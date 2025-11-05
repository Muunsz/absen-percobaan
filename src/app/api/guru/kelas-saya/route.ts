// app/api/guru/kelas-saya/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify, type JWTPayload } from "jose";

// Custom JWT payload (sesuaikan dengan struktur token Anda)
interface CustomJWTPayload extends JWTPayload {
  id: string;
  username: string;
  role: "ADMIN" | "GURU" | "SEKRETARIS" | "VIEW";
}

// Ambil secret dari env
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const secret = new TextEncoder().encode(jwtSecret);

export async function GET(request: NextRequest) {
  try {
    // 1. Ambil token dari cookie
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
    }

    // 2. Verifikasi JWT
    let payload: CustomJWTPayload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload as CustomJWTPayload;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // 3. Pastikan role adalah GURU
    if (payload.role !== "GURU") {
      return NextResponse.json({ error: "Forbidden: Role not allowed" }, { status: 403 });
    }

    // 4. Ambil ID user
    const userId = Number(payload.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID in token" }, { status: 400 });
    }

    // 5. Ambil data guru + kelas yang diwali
    const guru = await prisma.account.findUnique({
      where: { id: userId },
      include: {
        kelas_kelas_id_waliKelasToAccount: {
          select: {
            id: true,
            kelas: true,
            Jurusan: { select: { jurusan: true } },
          },
        },
      },
    });

    if (!guru) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    // 6. Format data kelas
    const kelasList = guru.kelas_kelas_id_waliKelasToAccount.map(k => ({
      id: k.id.toString(),
      nama: k.Jurusan ? `${k.kelas} ${k.Jurusan.jurusan}` : k.kelas,
      jenjang: k.kelas.split(" ")[0] || k.kelas,
      jurusan: k.Jurusan?.jurusan || "Umum",
    }));

    return NextResponse.json(kelasList);
  } catch (error) {
    console.error("Error fetching kelas saya:", error);
    return NextResponse.json({ error: "Gagal mengambil data kelas" }, { status: 500 });
  }
}