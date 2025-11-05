// components/guru-components/kelas-saya/KelasDetailPanel.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import { Calendar, UserCheck, UserX, CalendarDays, X } from "lucide-react";
import { createPortal } from "react-dom";

type Absensi = {
  tanggal: string;
  keterangan: "HADIR" | "SAKIT" | "IZIN" | "ALPA";
  deskripsi: string | null;
};

type Siswa = {
  NIS: string;
  Nama: string;
  JK: "L" | "P";
  absensi: Absensi[];
};

type Kelas = {
  id: number;
  nama: string;
  jurusan: string;
  totalSiswa: number;
};

type Rekap = {
  HADIR: number;
  SAKIT: number;
  IZIN: number;
  ALPA: number;
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "HADIR": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "SAKIT": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "IZIN": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "ALPA": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function KelasDetailPanel({
  open,
  onClose,
  kelas,
  siswa,
  rekap,
}: {
  open: boolean;
  onClose: () => void;
  kelas: Kelas;
  siswa: Siswa[];
  rekap: Rekap;
}) {
  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // Filter hanya absensi hari ini
  const absensiHariIni = useMemo(() => {
    const data: { siswa: Siswa; absensi: Absensi }[] = [];
    siswa.forEach(s => {
      s.absensi.forEach(a => {
        if (a.tanggal === today) {
          data.push({ siswa: s, absensi: a });
        }
      });
    });
    return data.sort((a, b) => a.siswa.Nama.localeCompare(b.siswa.Nama));
  }, [siswa, today]);

  // Handle keyboard
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{kelas.nama}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Jurusan {kelas.jurusan} • {kelas.totalSiswa} Siswa Aktif
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Rekap Kehadiran */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Rekap Kehadiran Hari Ini ({new Date().toLocaleDateString("id-ID")})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{rekap.HADIR}</div>
              <div className="text-xs text-green-600 dark:text-green-300">HADIR</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{rekap.SAKIT}</div>
              <div className="text-xs text-red-600 dark:text-red-300">SAKIT</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{rekap.IZIN}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-300">IZIN</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">{rekap.ALPA}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">ALPA</div>
            </div>
          </div>
        </div>

        {/* Tabel Absensi Hari Ini */}
        <div className="flex-1 overflow-auto p-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Daftar Absensi Hari Ini
          </h4>
          {absensiHariIni.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Tidak ada data absensi untuk hari ini.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                <tr>
                  <th className="text-left p-3 font-medium">NIS</th>
                  <th className="text-left p-3 font-medium">Nama</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Keterangan</th>
                  <th className="text-right p-3 font-medium">JK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {absensiHariIni.map(item => (
                  <tr key={`${item.siswa.NIS}-${item.absensi.tanggal}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono">{item.siswa.NIS}</td>
                    <td className="px-4 py-3 font-medium">{item.siswa.Nama}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(item.absensi.keterangan)}`}>
                        {item.absensi.keterangan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {item.absensi.deskripsi || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.siswa.JK === "L" ? "L" : "P"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}