"use client";

import { useState, useEffect } from "react";
import JurusanCard from "../../components/Absensi/JurusanCard";
import DropdownJurusan from "../../components/Absensi/DropdownJurusan";
import Link from "next/link";

type JurusanItem = {
  id: number;
  jurusan: string;
};

export default function InpAbsen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [jurusanList, setJurusanList] = useState<JurusanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const jurusanData: Record<string, { color: string; icon: string }> = {
    Mesin: { color: "#ef4444", icon: "/images/Logo/Mesin.webp" },
    DGM: { color: "#ef4444", icon: "/images/Logo/DGM.png" },
    Elektronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png" },
    Mekatronika: { color: "#facc15", icon: "/images/Logo/MEKA.png" },
    Otomotif: { color: "#fb923c", icon: "/images/Logo/Otomotif.png" },
    TKR: { color: "#fb923c", icon: "/images/Logo/Otomotif.png" },
    Tekstil: { color: "#22c55e", icon: "/images/Logo/Tekstil.png" },
    TJKT: { color: "#3b82f6", icon: "/images/Logo/TKJ.png" },
    TKJ: { color: "#3b82f6", icon: "/images/Logo/TKJ.png" },
    RPL: { color: "#60a5fa", icon: "/images/Logo/PPLG.png" },
    PPLG: { color: "#60a5fa", icon: "/images/Logo/PPLG.png" },
    BP: { color: "#9ca3af", icon: "/images/Logo/BP.png" },
  };

  function getJurusanKey(jurusan: string) {
    const mapping: Record<string, string> = {
      Mesin: "Mesin",
      DGM: "DGM",
      Elektronika: "Elektronika",
      Mekatronika: "Mekatronika",
      Otomotif: "Otomotif",
      TKR: "TKR",
      Tekstil: "Tekstil",
      TJKT: "TJKT",
      TKJ: "TKJ",
      RPL: "RPL",
      BP: "BP",
      "Desain Gambar Mesin": "DGM",
      "Teknik Kendaraan Ringan": "TKR",
      "Rekayasa Perangkat Lunak": "RPL",
      "Teknik Komputer dan Jaringan": "TKJ",
      "Pengembangan Perangkat Lunak dan Gim": "PPLG",
      "Broadcasting dan Perfilman": "BP",
    };
    return mapping[jurusan] || jurusan.replace(/\s+/g, "");
  }

  useEffect(() => {
    async function fetchJurusan() {
      try {
        const res = await fetch("/api/absensi");
        const data = await res.json();
        setJurusanList(data);
      } catch (error) {
        console.error("Gagal mengambil data jurusan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJurusan();
  }, []);

  const filteredJurusan = jurusanList.filter((item) => {
    const matchesSearch = item.jurusan
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchesFilter = !filter || filter === item.jurusan;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="rounded-2xl p-6 mb-6 shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl shadow-md">
              📋
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Absensi Siswa</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Kelola absensi berdasarkan jurusan dan kelas
              </p>
            </div>
          </div>
        </header>

        {/* Filter Section — RESPONSIF */}
        <section className="rounded-2xl p-5 mb-6 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:flex-wrap">
            {/* Filter & Tombol Hapus */}
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
              <div className="w-full md:w-auto">
                <DropdownJurusan
                  selected={filter}
                  onSelect={setFilter}
                  jurusanList={jurusanList.map((j) => j.jurusan)}
                />
              </div>
              {filter && (
                <button
                  onClick={() => setFilter(null)}
                  className="h-10 px-3 rounded-lg text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-300 transition-colors whitespace-nowrap"
                >
                  ✖ Hapus Filter
                </button>
              )}
            </div>

            {/* Pencarian + Tombol Scan */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Input Pencarian */}
              <div className="relative w-full sm:w-[280px]">
                <input
                  type="text"
                  placeholder="Cari jurusan…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder:text-gray-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Tombol Scan Absen */}
              <Link
                href="/admin/absenscan"
                className="h-11 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap font-medium"
                aria-label="Isi Absen via Scan"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 12h2m-6 0h-2m0 0H8m4 0H8m0 0H6m6 0v.01M12 16h.01M16 16h.01M8 16h.01" />
                </svg>
                <span className="hidden xs:inline">Scan Absen</span>
                <span className="xs:hidden">Scan Absen</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Grid Jurusan */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredJurusan.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredJurusan.map((item) => {
                const jur = item.jurusan;
                const key = getJurusanKey(jur);
                const color = jurusanData[key]?.color || "#6B7280";
                const icon = jurusanData[key]?.icon || "🏫";
                return (
                  <JurusanCard
                    key={item.id}
                    jurusan={jur}
                    color={color}
                    icon={icon}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tidak ada jurusan yang cocok
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}