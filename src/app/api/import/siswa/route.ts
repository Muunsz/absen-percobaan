// src/app/api/import/siswa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Workbook } from 'exceljs';
import { prisma } from '@/lib/prisma';
import { Buffer } from 'buffer';

export const dynamic = 'force-dynamic';
// export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak didukung. Gunakan .xlsx' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer)); // ✅ works in Node runtime

    const workbook = new Workbook();
    // Cast only for TS, not runtime
    await workbook.xlsx.load(buffer as unknown as any);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ error: 'Sheet pertama tidak ditemukan' }, { status: 400 });
    }

    const headerRow = worksheet.getRow(1).values as any[];
    const expected = ['NIS', 'NAMA SISWA', 'JK', 'KELAS', 'JURUSAN', 'STATUS'];
    const actual = headerRow.slice(1, 7).map((h: any) => (h?.toString() || '').trim());
    if (!expected.every((h, i) => actual[i] === h)) {
      return NextResponse.json({ error: `Header tidak sesuai. Diperlukan: ${expected.join(', ')}` }, { status: 400 });
    }

    // Preload reference data
    const jurusans = await prisma.jurusan.findMany();
    const jurusanMap = new Map(jurusans.map(j => [j.jurusan, j.id]));

    const kelasList = await prisma.kelas.findMany({
      include: { Jurusan: true }
    });
    const kelasMap = new Map(
      kelasList.map(k => [`${k.kelas}|${k.Jurusan.jurusan}`, k.id])
    );

    const created: { nis: string; nama: string }[] = [];
    const errors: string[] = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const cells = row.values as any[];
      if (cells.length <= 1 || cells.slice(1).every((c: any) => !c?.toString()?.trim())) continue;

      const [_, nisStr, nama, jk, kelas, jurusan, statusStr] = cells.map((c: any) => (c?.toString()?.trim() || ''));

      if (!nisStr || !nama || !kelas) continue;

      if (!/^\d+$/.test(nisStr)) {
        errors.push(`Baris ${i}: NIS "${nisStr}" tidak valid, harus berupa angka.`);
        continue;
      }

      if (await prisma.siswa.findUnique({ where: { NIS: nisStr } })) {
        errors.push(`Baris ${i}: NIS ${nisStr} sudah ada`);
        continue;
      }

      const jkClean = jk.toUpperCase();
      if (jkClean !== 'L' && jkClean !== 'P') {
        errors.push(`Baris ${i}: JK harus L/P`);
        continue;
      }

      const status = statusStr === 'Aktif' ? 'Aktif' : 'NonAktif';

      const jurusanId = jurusanMap.get(jurusan);
      if (!jurusanId) {
        errors.push(`Baris ${i}: Jurusan "${jurusan}" tidak dikenal`);
        continue;
      }

      const kelasId = kelasMap.get(`${kelas}|${jurusan}`);
      if (!kelasId) {
        errors.push(`Baris ${i}: Kelas "${kelas}" tidak ditemukan di jurusan "${jurusan}"`);
        continue;
      }

      await prisma.siswa.create({
        data: {
          NIS: nisStr,
          Nama: nama,
          JK: jkClean,
          status,
          id_class: kelasId,
        },
      });

      created.push({ nis: nisStr, nama });
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${created.length} siswa`,
      imported: created,
      errors,
    });
  } catch (error) {
    console.error('Import error:', error);
    if (error instanceof Error) {
      // Cek jika error dari Prisma
      if ('code' in error && 'meta' in error) {
        return NextResponse.json({ error: 'Terjadi kesalahan pada database.', details: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengimpor data' }, { status: 500 });
  }
}

