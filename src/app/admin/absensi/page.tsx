"use client";

import { useState, useEffect } from "react";
import JurusanCard from "../../components/Absensi/JurusanCard";
import DropdownJurusan from "../../components/Absensi/DropdownJurusan";
import Image from "next/image"

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
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <header className="rounded-2xl p-6 mb-6 shadow-lg bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl grid place-items-center bg-blue-100 text-blue-600 dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-600">
              📋
            </div>
            <div>
              <h1 className="text-2xl font-bold">Absensi Siswa</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Kelola absensi siswa berdasarkan jurusan dan kelas
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl p-5 mb-6 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <DropdownJurusan
                selected={filter}
                onSelect={setFilter}
                jurusanList={jurusanList.map((j) => j.jurusan)}
              />
              {filter && (
                <button
                  onClick={() => setFilter(null)}
                  className="h-10 px-3 rounded-lg text-sm bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30"
                >
                  ✖ Hapus
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Cari jurusan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[350px] h-12 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
        </section>

        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            <p className="col-span-full text-center py-8 text-gray-400 dark:text-gray-500">
              Memuat data...
            </p>
          ) : filteredJurusan.length > 0 ? (
            filteredJurusan.map((item) => {
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
            })
          ) : (
            <p className="col-span-full text-center py-8 text-gray-400 dark:text-gray-500">
              Tidak ada jurusan ditemukan
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
