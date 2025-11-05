// components/guru-components/guru-dashboard/StatsCard.tsx
"use client";

type StatsCardProps = {
  data: {
    absensiHariIni: {
      hadir: number;
      izin: number;
      sakit: number;
      alfa: number;
    };
    totalSiswa: number;
  };
};

export default function StatsCard({ data }: StatsCardProps) {
  const { hadir, izin, sakit, alfa } = data.absensiHariIni;
  const totalAbsen = izin + sakit + alfa;
  const presentase = data.totalSiswa > 0 ? Math.round((hadir / data.totalSiswa) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Kehadiran Kelas Hari Ini</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{hadir}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Hadir</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{sakit}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Sakit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{izin}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Izin</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{alfa}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Alfa</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Siswa</span>
          <span className="font-medium text-gray-900 dark:text-white">{data.totalSiswa}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">Presentase Hadir</span>
          <span className="font-medium text-green-600 dark:text-green-400">{presentase}%</span>
        </div>
      </div>
    </div>
  );
}