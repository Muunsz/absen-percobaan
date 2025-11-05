// components/guru-components/calendar/KPISection.tsx
"use client";
import { useMemo } from "react";

type Props = {
  monthEvents: {
    id_guru: number;
    id_kelas?: number | null;
  }[];
};

export default function KPISection({ monthEvents }: Props) {
  // Hitung guru unik
  const uniqueGuru = useMemo(() => {
    const set = new Set<number>();
    monthEvents.forEach(event => {
      if (event.id_guru) set.add(event.id_guru);
    });
    return set.size;
  }, [monthEvents]);

  // Hitung kelas unik (abaikan null/undefined)
  const uniqueKelas = useMemo(() => {
    const set = new Set<number>();
    monthEvents.forEach(event => {
      if (event.id_kelas != null) set.add(event.id_kelas);
    });
    return set.size;
  }, [monthEvents]);

  return (
    <section aria-label="Ringkasan bulan ini" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="rounded-xl p-4 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-600 dark:text-gray-300">Agenda Bulan Ini</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{monthEvents.length}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">agenda dalam bulan ini</p>
      </div>
      <div className="rounded-xl p-4 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm text-blue-600 dark:text-blue-300">Guru Berpartisipasi</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{uniqueGuru}</p>
        <p className="text-xs text-blue-700 dark:text-blue-400">guru terlibat bulan ini</p>
      </div>
      <div className="rounded-xl p-4 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border border-green-200 dark:border-green-800">
        <h3 className="text-sm text-green-600 dark:text-green-300">Kelas Terlibat</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{uniqueKelas}</p>
        <p className="text-xs text-green-700 dark:text-green-400">kelas yang terlibat</p>
      </div>
    </section>
  );
}