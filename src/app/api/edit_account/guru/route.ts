import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    // [1] Terima 'nama_lengkap' dari request body
    const { id, username, nama_lengkap, password, id_mapel } = await req.json();

    if (!id || !username || !id_mapel) {
      return NextResponse.json(
        { error: "ID, username, dan mata pelajaran wajib diisi" },
        { status: 400 }
      );
    }

    const updateData: any = {
      username,
      nama_lengkap, // [2] Tambahkan 'nama_lengkap' ke data yang akan di-update
      id_mapel: Number(id_mapel),
    };

    if (password && password.length > 0) { // Hanya hash jika password tidak kosong
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Lakukan update terlebih dahulu
    await prisma.account.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // [3] Ambil lagi data yang sudah lengkap untuk dikirim kembali ke frontend
    const updatedUserWithDetails = await prisma.account.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        nama_lengkap: true, // Pastikan nama_lengkap ada di sini
        role: true,
        id_mapel: true,
        mapel: { 
          select: {
            mapel: true
          }
        }
      }
    });

    if (!updatedUserWithDetails) {
        return NextResponse.json({ error: "Gagal mengambil data setelah update" }, { status: 404 });
    }

    // [4] Format ulang respons agar sesuai dengan frontend
    const responseData = {
        id: updatedUserWithDetails.id,
        username: updatedUserWithDetails.username,
        nama_lengkap: updatedUserWithDetails.nama_lengkap, // Dan di sini
        role: updatedUserWithDetails.role,
        id_mapel: updatedUserWithDetails.id_mapel,
        mataPelajaran: updatedUserWithDetails.mapel?.mapel || 'N/A'
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui guru" },
      { status: 500 }
    );
  }
}

