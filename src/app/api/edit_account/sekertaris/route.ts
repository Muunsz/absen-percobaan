import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const { id, username, nama_lengkap, password, id_kelas } = await request.json();

    if (!id || !username || !id_kelas) {
      return NextResponse.json({ error: 'ID, Username, dan Kelas wajib diisi' }, { status: 400 });
    }

    const updateData: any = {
      username,
      nama_lengkap: nama_lengkap || null,
      id_kelas: Number(id_kelas),
    };

    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const existingUser = await prisma.account.findFirst({
      where: {
        username,
        NOT: {
          id: id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan oleh akun lain' }, { status: 409 });
    }

    const updatedUser = await prisma.account.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        id_kelas: true,
        role: true,
        kelas: {
          select: {
            kelas: true,
          },
        },
      },
    });

    const formattedUpdatedUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      nama_lengkap: updatedUser.nama_lengkap,
      id_kelas: updatedUser.id_kelas ?? 0,
      kelas: updatedUser.kelas?.kelas ?? 'N/A',
      role: updatedUser.role,
    };

    return NextResponse.json(formattedUpdatedUser);
  } catch (error: any) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: error.message || 'Gagal memperbarui sekertaris' }, { status: 500 });
  }
}
