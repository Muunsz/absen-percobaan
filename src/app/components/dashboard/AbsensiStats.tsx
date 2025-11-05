import { prisma } from "@/lib/prisma";
import { Absent } from "@prisma/client";
import Keterangan from "./Keterangan";

export default async function AbsensiStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalSiswa = await prisma.siswa.count({
    where: { status: "Aktif" },
  });

  const absensiHarian = await prisma.absensi.findMany({
    where: { tanggal: today },
    select: { keterangan: true },
  });

  const hadir = absensiHarian.filter(a => a.keterangan === "HADIR").length;
  const sakit = absensiHarian.filter(a => a.keterangan === "SAKIT").length;
  const izin = absensiHarian.filter(a => a.keterangan === "IZIN").length;
  const alfa = absensiHarian.filter(a => a.keterangan === "ALPA").length;

  const persentase = totalSiswa > 0 ? Math.round((hadir / totalSiswa) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-[#1f2937] rounded-lg p-4 shadow-md h-[200px] border border-gray-700">
          <h2 className="text-gray-300 text-sm">Persentase Kehadiran</h2>
          <div className="mt-5">
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-white">{persentase}</span>
              <span className="text-2xl text-gray-400 mb-1">%</span>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-gray-700">
              <div
                className="h-3 rounded-full bg-[#10b981]"
                style={{ width: `${persentase}%` }}
                aria-valuenow={persentase}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${persentase}%`}
                aria-label="Persentase kehadiran hari ini"
                role="progressbar"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">Hari ini</p>
            <p className="sr-only">{`Persentase kehadiran hari ini ${persentase} persen`}</p>
          </div>
        </section>

        <section className="bg-[#1f2937] rounded-lg p-4 shadow-md h-[200px] border border-gray-700">
          <h2 className="text-gray-300 text-sm">Total Siswa</h2>
          <p className="mt-4 text-3xl font-bold text-white">{totalSiswa}</p>
          <div className="mt-4">
            <p className="text-gray-400 text-xs">Hadir: {hadir}</p>
            <p className="text-gray-400 text-xs">Tidak Hadir: {totalSiswa - hadir}</p>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Keterangan sakit={sakit} izin={izin} alfa={alfa} />
      </div>
    </div>
  );
}