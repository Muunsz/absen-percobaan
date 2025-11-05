// File: src/app/admin/absensi/sakit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, User, AlertTriangle, CheckCircle, X } from "lucide-react";

// Definisikan tipe data sesuai dengan skema Prisma
// Gunakan string untuk tanggal karena API mengembalikan JSON
type Siswa = {
  NIS: string;
  Nama: string;
  JK: "L" | "P";
  id_class: number;
};

type Absensi = {
  id: number;
  id_siswa: string;
  keterangan: "HADIR" | "IZIN" | "SAKIT" | "ALPA";
  tanggal: string; // Tanggal sebagai string dari API
  deskripsi?: string | null;
  siswa?: Siswa;
  kelas?: { kelas: string };
};

// Fungsi untuk mengambil data dari API
async function fetchAbsensiSakit(): Promise<Absensi[]> {
  try {
    const res = await fetch(`/api/absensi/sakit`);
    if (!res.ok) {
      throw new Error("Gagal mengambil data absensi sakit");
    }
    const data = await res.json();
    return data.absensi || [];
  } catch (error) {
    console.error("Error fetching absensi sakit:", error);
    return [];
  }
}

export default function AbsensiSakitPage() {
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchAbsensiSakit();
        setAbsensiList(data);
        setError(null);
      } catch (err) {
        console.error("Error loading ", err);
        setError("Gagal memuat data absensi sakit.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter data hanya untuk sakit dan sesuai pencarian
  const filteredAbsensi = absensiList.filter(
    (a) =>
      a.keterangan === "SAKIT" &&
      (a.siswa?.Nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
       a.siswa?.NIS.toLowerCase().includes(searchTerm.toLowerCase()) ||
       a.kelas?.kelas.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSakit = filteredAbsensi.length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] dark:text-white">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h1 className="text-xl sm:text-2xl font-bold">Detail Absensi: Sakit</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kelola data siswa yang absen karena sakit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center sm:justify-start gap-2 bg-red-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Sakit Hari Ini</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalSakit}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Siswa</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Kelas Terlibat</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {[...new Set(filteredAbsensi.map(a => a.kelas?.kelas))].filter(Boolean).length}
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari siswa atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Memuat data absensi sakit...
          </p>
        ) : filteredAbsensi.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada data absensi sakit ditemukan.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1e293b]/70 backdrop-blur-lg shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[60px]">No</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[150px]">Nama Siswa</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[100px]">NIS</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[120px]">Kelas</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[120px]">Tanggal</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[200px]">Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAbsensi.map(({ id, siswa, kelas, tanggal, deskripsi }, index) => (
                  <tr
                    key={id}
                    className="hover:bg-gray-50 dark:hover:bg-[#27364f] transition-colors duration-200"
                  >
                    <td className="py-3 px-4 sm:px-5">{index + 1}</td>
                    <td className="py-3 px-4 sm:px-5 font-medium">{siswa?.Nama || "-"}</td>
                    <td className="py-3 px-4 sm:px-5">{siswa?.NIS || "-"}</td>
                    <td className="py-3 px-4 sm:px-5">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold">
                        {kelas?.kelas || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-5">{new Date(tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-4 sm:px-5 max-w-xs truncate" title={deskripsi || "-"}>{deskripsi || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}