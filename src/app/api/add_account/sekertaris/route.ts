import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, nama_lengkap, password, id_mapel, role } = await request.json();

    if (!username || !password || !id_mapel || !role) {
      return NextResponse.json({ error: 'Username, password, kelas, dan role wajib diisi.' }, { status: 400 });
    }

    const existingUser = await prisma.account.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.account.create({
      data: {
        username,
        nama_lengkap: nama_lengkap || null,
        password: hashedPassword,
        id_kelas: Number(id_mapel),
        role,
      },
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

    const formattedNewUser = {
      id: newUser.id,
      username: newUser.username,
      nama_lengkap: newUser.nama_lengkap,
      id_kelas: newUser.id_kelas ?? 0,
      kelas: newUser.kelas?.kelas ?? 'N/A',
      role: newUser.role,
    };

    return NextResponse.json(formattedNewUser, { status: 201 });
  } catch (error: any) {
    console.error('Error adding account:', error);
    return NextResponse.json({ error: error.message || 'Gagal menambah akun' }, { status: 500 });
  }
}
