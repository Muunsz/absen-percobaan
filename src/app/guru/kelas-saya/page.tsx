// app/guru/kelas-saya/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import KelasSayaCard from "../../components/guru-components/kelas-saya/KelasSayaCard";

type Kelas = {
  id: string;
  nama: string;
  jenjang: string;
  jurusan: string;
};

export default function KelasSayaPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("Semua");
  const [filterJurusan, setFilterJurusan] = useState("Semua");

  const isDark = isClient && resolvedTheme === "dark";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data dari API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await fetch("/api/guru/kelas-saya");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Gagal mengambil data");
        }
        const data: Kelas[] = await res.json();
        setKelasList(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchKelas();
  }, []);

  // Daftar jenjang & jurusan unik
  const jenjangList = useMemo(() => {
    const jenjang = new Set(kelasList.map(k => k.jenjang));
    return ["Semua", ...Array.from(jenjang).sort()];
  }, [kelasList]);

  const jurusanList = useMemo(() => {
    const jurusan = new Set(kelasList.map(k => k.jurusan));
    return ["Semua", ...Array.from(jurusan).sort()];
  }, [kelasList]);

  // Filter data
  const filteredKelas = useMemo(() => {
    return kelasList.filter(k => {
      const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase()) ||
                          k.jurusan.toLowerCase().includes(search.toLowerCase());
      const matchJenjang = filterJenjang === "Semua" || k.jenjang === filterJenjang;
      const matchJurusan = filterJurusan === "Semua" || k.jurusan === filterJurusan;
      return matchSearch && matchJenjang && matchJurusan;
    });
  }, [kelasList, search, filterJenjang, filterJurusan]);

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen dark:bg-gray-900 dark:text-white flex items-center justify-center">
        <p>Memuat kelas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen dark:bg-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Header */}
        <header className={`rounded-2xl p-6 mb-6 shadow-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"}`}>
          <h1 className="text-2xl font-bold">Kelas Saya</h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
            Kelola absensi dan jadwal mengajar untuk kelas yang Anda wali
          </p>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari kelas atau jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
          />
          <select
            value={filterJenjang}
            onChange={(e) => setFilterJenjang(e.target.value)}
            className={`px-4 py-2 rounded-xl border w-full md:w-40 ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            {jenjangList.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            className={`px-4 py-2 rounded-xl border w-full md:w-48 ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          >
            {jurusanList.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* Daftar Kelas */}
        {filteredKelas.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"}`}>
            <p className="text-gray-500">Tidak ada kelas yang diwali.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredKelas.map(kelas => (
              <KelasSayaCard
                key={kelas.id}
                id={kelas.id}
                nama={kelas.nama}
                jenjang={kelas.jenjang}
                jurusan={kelas.jurusan}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Klik pada kelas untuk melihat daftar siswa dan kehadiran siswa.</p>
        </div>
      </div>
    </div>
  );
}