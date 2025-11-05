// app/guru/kelas-saya/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KelasDetailPanel from "../../../components/guru-components/kelas-saya/KelasDetailPanel";
import React from "react";

type KelasData = {
  kelas: {
    id: number;
    nama: string;
    jurusan: string;
    totalSiswa: number;
  };
  siswa: {
    NIS: string;
    Nama: string;
    JK: "L" | "P";
    absensi: {
      tanggal: string;
      keterangan: "HADIR" | "SAKIT" | "IZIN" | "ALPA";
      deskripsi: string | null;
    }[];
  }[];
  rekap: {
    HADIR: number;
    SAKIT: number;
    IZIN: number;
    ALPA: number;
  };
};

export default function KelasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<KelasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = React.use(params);
  const classId = id

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await fetch(`/api/guru/kelas-saya/${classId}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Gagal mengambil data");
        }
        const kelasData: KelasData = await res.json();
        setData(kelasData);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchKelas();
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
          <div className="text-gray-400 text-2xl mb-2">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Tidak Ditemukan</h3>
          <button
            onClick={() => router.push("/guru/kelas-saya")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Daftar Kelas
          </button>
        </div>
      </div>
    );
  }

  return (
    <KelasDetailPanel
      open={true}
      onClose={() => router.push("/guru/kelas-saya")}
      kelas={data.kelas}
      siswa={data.siswa}
      rekap={data.rekap}
    />
  );
}