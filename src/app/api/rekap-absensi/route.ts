import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Absent, Gender, Jurusan, kelas, Siswa } from '@prisma/client';

// Tipe data untuk respons GET (daftar kelas)
export type ClassListItem = {
    id: number;
    kelas: string;
    id_jurusan: number;
    jurusan: Jurusan;
    totalSiswaAktif: number;
};

// Tipe data untuk respons POST (detail rekap)
export type RekapDetailItem = {
    NIS: string;
    Nama: string;
    JK: Gender;
    status: string; // Status Siswa (Aktif/NonAktif)
    absensi: {
        tanggal: string; // YYYY-MM-DD
        keterangan: Absent; // HADIR, SAKIT, IZIN, ALPA
        deskripsi: string | null;
    }[];
};

/**
 * Endpoint GET: Mengambil daftar semua kelas dengan ringkasan jumlah siswa aktif.
 * Digunakan untuk tampilan kartu di halaman utama.
 */
export async function GET() {
    try {
        const classes = await prisma.kelas.findMany({
            select: {
                id: true,
                kelas: true,
                id_jurusan: true,
                Jurusan: {
                    select: {
                        id: true,
                        jurusan: true, // Nama Jurusan
                    },
                },
                siswa: {
                    where: {
                        status: 'Aktif',
                    },
                    select: {
                        NIS: true,
                    },
                },
            },
            orderBy: {
                kelas: 'asc',
            },
        });

        const classList: ClassListItem[] = classes.map(c => ({
            id: c.id,
            kelas: c.kelas,
            id_jurusan: c.id_jurusan,
            jurusan: c.Jurusan as Jurusan,
            totalSiswaAktif: c.siswa.length,
        }));

        const jurusans = await prisma.jurusan.findMany({
            select: { id: true, jurusan: true }
        });

        return NextResponse.json({ 
            data: classList,
            jurusans: jurusans,
        }, { status: 200 });
    } catch (error) {
        console.error('API Error (GET rekap-absensi):', error);
        return NextResponse.json({ message: 'Gagal mengambil data kelas.' }, { status: 500 });
    }
}

/**
 * Endpoint POST: Mengambil detail absensi untuk ID kelas dan rentang tanggal tertentu.
 * Digunakan untuk tampilan detail dan ekspor Excel.
 */
export async function POST(req: Request) {
    try {
        const { kelasIds, startDate, endDate } = await req.json();

        if (!kelasIds || !startDate || !endDate || !Array.isArray(kelasIds)) {
            return NextResponse.json({ message: 'Parameter kelasIds, startDate, dan endDate wajib diisi.' }, { status: 400 });
        }

        // 1. Ambil semua siswa yang relevan (Aktif & NonAktif, karena kita mungkin merekap kelas lulusan)
        const siswaData = await prisma.siswa.findMany({
            where: {
                id_class: {
                    in: kelasIds,
                },
            },
            select: {
                NIS: true,
                Nama: true,
                JK: true,
                status: true,
                id_class: true,
                absensi: {
                    where: {
                        tanggal: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                    select: {
                        tanggal: true,
                        keterangan: true,
                        deskripsi: true,
                    },
                    orderBy: {
                        tanggal: 'asc',
                    },
                },
            },
        });

        // 2. Format hasil
        const formattedData = siswaData.map(siswa => {
            // Ubah objek Date menjadi string YYYY-MM-DD
            const absensiFormatted = siswa.absensi.map(abs => ({
                tanggal: abs.tanggal.toISOString().split('T')[0],
                keterangan: abs.keterangan,
                deskripsi: abs.deskripsi,
            }));

            // Filter out any siswa yang tidak ada di range tanggal (walaupun harusnya tidak terjadi)
            if (absensiFormatted.length === 0) return null;

            return {
                NIS: siswa.NIS,
                Nama: siswa.Nama,
                JK: siswa.JK,
                status: siswa.status,
                id_class: siswa.id_class,
                absensi: absensiFormatted,
            };
        }).filter((item): item is typeof item & { absensi: { tanggal: string, keterangan: Absent, deskripsi: string | null }[] } => item !== null);

        return NextResponse.json({ data: formattedData }, { status: 200 });

    } catch (error) {
        console.error('API Error (POST rekap-absensi):', error);
        return NextResponse.json({ message: 'Gagal mengambil data absensi detail.' }, { status: 500 });
    }
}