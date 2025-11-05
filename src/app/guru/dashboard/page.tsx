// app/guru/dashboard/page.tsx (atau lokasi file Anda)
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  BookOpen,
  ClipboardList,
  BarChart3,
} from "lucide-react";

import StatsCard from "../../components/guru-components/guru-dashboard/StatsCard";
import QuickActionCard from "../../components/guru-components/guru-dashboard/QuickActionCard";
import KPICard from "../../components/guru-components/guru-dashboard/KPICard";
import TodayAgendaList from "../../components/guru-components/guru-dashboard/TodayAgendaList";
import MonthlyAgendaList from "../../components/guru-components/guru-dashboard/MonthlyAgendaList";

type DashboardData = {
  kelasSaya: {
    absensiHariIni: {
      hadir: number;
      izin: number;
      sakit: number;
      alfa: number;
    };
    totalSiswa: number;
  };
  agenda: {
    agendaKelasGuru: any[];
    agendaKhusus: any[];
  };
  kpi: {
    guruBerpartisipasi: number;
  };
};

export default function DashboardGuruPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/guru/dashboard");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const dashboardData: DashboardData = await res.json();
      setData(dashboardData);
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefreshData = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen w-full flex items-center justify-center">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Selamat Datang, Guru
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ringkasan aktivitas mengajar dan agenda hari ini.
            </p>
          </div>
          <div className="mt-2 md:mt-0 md:ml-4">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              href="/guru/daftar-hadir"
              icon={ClipboardList}
              title="Lihat Absensi"
              color="text-blue-500"
            />
            <QuickActionCard
              href="/guru/isi-agenda"
              icon={Calendar}
              title="Isi Agenda"
              color="text-green-500"
            />
            <QuickActionCard
              href="/guru/kelas"
              icon={BookOpen}
              title="Lihat Kelas"
              color="text-amber-500"
            />
            <QuickActionCard
              href="/guru/calendar"
              icon={BarChart3}
              title="Lihat Kalender"
              color="text-purple-500"
            />
          </div>
        </section>

        {/* ✅ DIPERBAIKI: Layout responsif untuk sm (tablet kecil) */}
        <section
          aria-label="Ringkasan Kinerja"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
        >
          <KPICard
            title="Kehadiran Siswa"
            value={`${data.kelasSaya.absensiHariIni.hadir} Hadir`}
            subtitle={`${data.kelasSaya.totalSiswa} total siswa`}
            icon={ClipboardList}
            color="text-green-600"
          />
          <KPICard
            title="Agenda Kelas Saya"
            value={data.agenda.agendaKelasGuru.length}
            subtitle="Bulan ini"
            icon={Calendar}
            color="text-blue-600"
          />
          {/* ✅ Card ketiga: col-span-2 di sm, agar mengisi seluruh lebar di baris kedua */}
          <div className="sm:col-span-2 md:col-span-1">
            <KPICard
              title="Agenda Khusus"
              value={data.agenda.agendaKhusus.length}
              subtitle="Bulan ini"
              icon={BookOpen}
              color="text-amber-600"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status Kelas Saya Hari Ini
          </h2>
          <StatsCard data={data.kelasSaya} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayAgendaList
            agendas={data.agenda.agendaKelasGuru}
            onRefresh={handleRefreshData}
          />
          <MonthlyAgendaList
            agendas={data.agenda.agendaKhusus}
            onRefresh={handleRefreshData}
          />
        </section>
      </div>
    </div>
  );
}