"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  CheckCircle, 
  HospitalIcon, 
  PaperclipIcon, 
  XIcon 
} from "lucide-react";
import KPICard from "../../components/guru-components/guru-dashboard/KPICard";

export default function DashboardSekretarisClient({ data }: { data: any }) {
    const [absensiData, setAbsensiData] = useState<any>(null);

    useEffect(() => {
        setAbsensiData({
            totalHadir: data.absensiHariIni.hadir,
            totalTidakHadir:
                data.absensiHariIni.izin + data.absensiHariIni.sakit + data.absensiHariIni.alfa,
            totalSakit: data.absensiHariIni.sakit,
            totalIzin: data.absensiHariIni.izin,
            totalAlfa: data.absensiHariIni.alfa,
            presentaseKehadiran:
                data.totalSiswa > 0
                    ? Math.round((data.absensiHariIni.hadir / data.totalSiswa) * 100)
                    : 0,
        });
    }, [data]);

    return (
        <div className="flex-1 p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Selamat Datang, Sekretaris!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Ringkasan absensi hari ini.
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

                {/* Tombol Aksi Cepat - Responsif: Mobile = 1+2, Desktop = 3 berdampingan penuh */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Tombol Isi Absensi */}
                        <button
                            onClick={() => window.location.href = '/sekretaris/isi-absensi'}
                            className="sm:col-span-2 md:col-span-1 w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all transform hover:scale-105"
                        >
                            <Calendar className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Isi Absensi</span>
                        </button>

                        {/* Tombol Daftar Hadir */}
                        <button
                            onClick={() => window.location.href = '/sekretaris/rekapan-absen'}
                            className="sm:col-span-1 md:col-span-1 w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all transform hover:scale-105"
                        >
                            <BookOpen className="h-8 w-8 text-amber-500 dark:text-amber-400 mb-2" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Daftar Hadir</span>
                        </button>

                        {/* Tombol Lihat Kalender */}
                        <button
                            onClick={() => window.location.href = '/sekretaris/calendar'}
                            className="sm:col-span-1 md:col-span-1 w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all transform hover:scale-105"
                        >
                            <BarChart3 className="h-8 w-8 text-purple-500 dark:text-purple-400 mb-2" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Lihat Kalender</span>
                        </button>
                    </div>
                </section>

                {/* KPI Card Utama: Kehadiran Siswa */}
                <section className="mb-8">
                    <KPICard
                        title="Kehadiran Siswa"
                        value={absensiData ? `${absensiData.presentaseKehadiran}%` : "--%"}
                        subtitle={absensiData ? `${absensiData.totalHadir} Hadir` : "-- Hadir"}
                        icon={ClipboardList}
                        color="text-green-600"
                    />
                </section>

                {/* Ringkasan Kinerja: Sakit, Izin, Alfa - Layout seperti desain */}
                <section
                    aria-label="Ringkasan Kinerja"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
                >
                    {/* Baris Pertama: Sakit & Izin */}
                    <div className="sm:col-span-1">
                        <KPICard
                            title="Siswa Sakit"
                            value={absensiData ? `${absensiData.totalSakit} Sakit` : "-- Sakit"}
                            icon={HospitalIcon}
                            color="text-yellow-600"
                        />
                    </div>
                    <div className="sm:col-span-1">
                        <KPICard
                            title="Siswa Izin"
                            value={absensiData ? `${absensiData.totalIzin} Izin` : "-- Izin"}
                            icon={PaperclipIcon}
                            color="text-orange-600"
                        />
                    </div>

                    {/* Baris Kedua: Alfa - Lebar Penuh */}
                    <div className="sm:col-span-2">
                        <KPICard
                            title="Siswa Alfa"
                            value={absensiData ? `${absensiData.totalAlfa} Alfa` : "-- Alfa"}
                            icon={XIcon}
                            color="text-red-600"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}