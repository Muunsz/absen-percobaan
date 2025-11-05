"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "../../../components/Absensi/BreadcrumbK";
import KelasCard from "../../../components/Absensi/KelasCard";
import Image from "next/image";

type Kelas = {
  id: number;
  kelas: string;
  id_jurusan: number;
  id_waliKelas: number;
};

type Jurusan = {
  id: number;
  jurusan: string;
  kelas: Kelas[];
};

type KelasResponse = {
  message: string;
  kelas: number;
  nama_kelas: string;
  id_jurusan: number;
  jurusan: string;
  id_waliKelas: number;
};

const jurusanData: Record<string, { color: string; icon: string }> = {
  Mesin: { color: "#ef4444", icon: "/images/Logo/Mesin.webp" },
  DGM: { color: "#ef4444", icon: "/images/Logo/Mesin.webp" },
  Elektronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png" },
  Mekatronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png" },
  Otomotif: { color: "#fb923c", icon: "/images/Logo/Otomotif.png" },
  TKR: { color: "#fb923c", icon: "/images/Logo/Otomotif.png" },
  Tekstil: { color: "#22c55e", icon: "/images/Logo/Tekstil.png" },
  TJKT: { color: "#3b82f6", icon: "/images/Logo/TKJ.png" },
  TKJ: { color: "#3b82f6", icon: "/images/Logo/TKJ.png" },
  RPL: { color: "#60a5fa", icon: "/images/Logo/PPLG.png" },
  PPLG: { color: "#60a5fa", icon: "/images/Logo/PPLG.png" },
  BP: { color: "#9ca3af", icon: "/images/Logo/BP.png" },
};

function pretty(v: string) {
  try {
    return decodeURIComponent(v).replace(/_/g, " ");
  } catch {
    return v.replace(/_/g, " ");
  }
}

export default function JurusanPage() {
  const [jurusan, setJurusan] = useState<Jurusan | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tingkat, setTingkat] = useState<"Semua" | "X" | "XI" | "XII">("Semua");

  const params = useParams();
  const jurusanParam = params.jurusan as string;
  const decodedJurusan = pretty(jurusanParam);

  const matchedKey = Object.keys(jurusanData).find(
    (key) => key.toLowerCase() === decodedJurusan.toLowerCase()
  );

  const { color = "#9ca3af", icon = "/images/Logo/Default.png" } =
    matchedKey ? jurusanData[matchedKey] : {};

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/absensi-sek/${jurusanParam}`);
        const data: KelasResponse = await res.json();

        // Wrap single class in an array
        setJurusan({
          id: data.id_jurusan,
          jurusan: data.jurusan,
          kelas: [
            {
              id: data.kelas,
              kelas: data.nama_kelas,
              id_jurusan: data.id_jurusan,
              id_waliKelas: data.id_waliKelas,
            },
          ],
        });
      } catch {
        setJurusan(null);
      } finally {
        setLoading(false);
      }
    }

    if (jurusanParam) fetchData();
  }, [jurusanParam]);

  const filtered = useMemo(() => {
    if (!jurusan?.kelas) return [];
    const term = search.trim().toLowerCase();
    return jurusan.kelas.filter((k) => {
      const kelasName = k.kelas.toUpperCase();
      const level = kelasName.startsWith("XII")
        ? "XII"
        : kelasName.startsWith("XI")
        ? "XI"
        : kelasName.startsWith("X")
        ? "X"
        : "Semua";

      const matchTingkat = tingkat === "Semua" ? true : level === tingkat;
      const matchSearch = term ? k.kelas.toLowerCase().includes(term) : true;

      return matchTingkat && matchSearch;
    });
  }, [jurusan, search, tingkat]);

  const KelasCardIcon = icon.startsWith("/") ? (
    <div className="relative h-full w-full">
      <Image
        src={icon}
        alt={`Icon ${decodedJurusan}`}
        fill
        sizes="64px"
        className="object-contain p-1"
      />
    </div>
  ) : (
    <span className="text-2xl">{icon}</span>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p>Sedang memuat data kelas...</p>
      </div>
    );
  }

  if (!jurusan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold">Jurusan tidak ditemukan</h2>
          <a
            href="/sekretaris/isi-absensi"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Kembali ke Daftar Jurusan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <header className="rounded-2xl p-6 mb-6 shadow-lg bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full grid place-items-center text-2xl overflow-hidden relative"
              style={{
                backgroundColor: `${color}20`,
                border: `2px solid ${color}`,
                color: color,
              }}
            >
              {KelasCardIcon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Jurusan {decodedJurusan}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Pilih kelas untuk mengelola absensi
              </p>
            </div>
          </div>
        </header>

        <Breadcrumb jurusan={decodedJurusan} />

        <section className="rounded-2xl p-4 mb-6 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["Semua", "X", "XI", "XII"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTingkat(t)}
                  className={`h-10 px-3 rounded-lg transition ${
                    tingkat === t
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <label className="relative block md:w-[360px]">
              <input
                placeholder="Cari kelas…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border border-gray-300 placeholder:text-gray-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
              />
            </label>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
              Tidak ada kelas ditemukan
            </p>
          ) : (
            filtered.map((k) => (
              <KelasCard
                key={k.id}
                icon={KelasCardIcon}
                label={k.kelas}
                color={color}
                href={`/sekretaris/isi-absensi/${jurusanParam}/${encodeURIComponent(
                  k.kelas
                )}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
