import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
export async function GET() {
  try {
    const today = new Date()
    const todayLocalString = today.toLocaleDateString('sv-SE') 
    const startOfDayUTC = new Date(Date.UTC(
      parseInt(todayLocalString.split('-')[0]),
      parseInt(todayLocalString.split('-')[1]) - 1,
      parseInt(todayLocalString.split('-')[2]),
      0, 0, 0, 0
    ));
    const endOfDayUTC = new Date(Date.UTC(
      parseInt(todayLocalString.split('-')[0]),
      parseInt(todayLocalString.split('-')[1]) - 1,
      parseInt(todayLocalString.split('-')[2]) + 1,
      0, 0, 0, 0
    ));

    const absensiSakit = await prisma.absensi.findMany({
      where: {
        keterangan: "SAKIT",
        tanggal: {
          gte: startOfDayUTC,
          lt: endOfDayUTC,
        }
      },
      include: {
        siswa: true, 
        kelas: true, 
      },
    });

    const formattedAbsensi = absensiSakit.map(a => ({
      ...a,
      tanggal: a.tanggal,
    }));

    return NextResponse.json({ absensi: formattedAbsensi });
  } catch (error) {
    console.error("API Error fetching absensi sakit:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}