"use client";

import { useState, useEffect } from "react";
import JurusanCard from "../../components/Absensi/JurusanC";
import Image from "next/image";

type JurusanItem = {
  kelas: string;
  id: number;
  jurusan: string;
};

export default function InpAbsen() {
  const [jurusan, setJurusan] = useState<JurusanItem | null>(null);
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
        const res = await fetch("/api/absensi-sek");
        const data = await res.json();
        setJurusan(data);
      } catch (error) {
        console.error("Gagal mengambil data jurusan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJurusan();
  }, []);

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
                Kelola absensi siswa berdasarkan jurusan
              </p>
            </div>
          </div>
        </header>

        <main className="flex justify-center">
          {loading ? (
            <p className="text-gray-400 dark:text-gray-500 py-8">
              Memuat data...
            </p>
          ) : jurusan ? (
            (() => {
              const key = getJurusanKey(jurusan.jurusan);
              const color = jurusanData[key]?.color || "#6B7280";
              const icon = jurusanData[key]?.icon || "🏫";
              return (
                <JurusanCard
                  key={jurusan.id}
                  id={jurusan.id}
                  kelas={jurusan.kelas}
                  jurusan={jurusan.jurusan}
                  color={color}
                  icon={icon}
                />
              );
            })()
          ) : (
            <p className="text-gray-400 dark:text-gray-500 py-8">
              Jurusan tidak ditemukan
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
