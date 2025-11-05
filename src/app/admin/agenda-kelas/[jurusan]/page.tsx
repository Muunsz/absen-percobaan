// app/admin/agenda-kelas/[jurusan]/JurusanPage.tsx

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";

import { Kelas, getJurusanStyle, pretty, JURUSAN_STYLE_DATA } from "@/lib/agenda-kelas-utils";
import { ThemedContainer } from "../../../components/Agenda-kelas/ThemedContainer";
import { BreadcrumbNav } from "../../../components/Agenda-kelas/BreadcrumbNav";
import { KelasCard } from "../../../components/Agenda-kelas/KelasCard"  ;


export default function JurusanPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tingkat, setTingkat] = useState<"Semua" | "X" | "XI" | "XII">("Semua");

  const params = useParams();
  const jurusanParam = params.jurusan as string;
  const decodedJurusan = pretty(jurusanParam);
  
  const { color, icon, displayName } = getJurusanStyle(decodedJurusan);

  const fetchKelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/Agenda-kelas/${jurusanParam}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengambil data kelas dari server.');
      }
      
      const data: Kelas[] = await response.json();
      setKelasList(data);
    } catch (e) {
      console.error(e);
      setError(`Gagal memuat data kelas: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [jurusanParam]);

  useEffect(() => {
    fetchKelas();
  }, [fetchKelas]);


  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return kelasList.filter((k) => {
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
  }, [kelasList, tingkat, search]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <ThemedContainer className="p-6 text-center">
            <Loader2 className="size-8 animate-spin mx-auto text-blue-500 mb-2" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Memuat data kelas untuk {displayName}...</p>
        </ThemedContainer>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        
        <ThemedContainer className="p-6 mb-6">
            <div className="flex items-center gap-4">
                <div
                className="h-16 w-16 rounded-full grid place-items-center text-2xl overflow-hidden relative flex-shrink-0"
                style={{
                    backgroundColor: `${color}20`,
                    border: `3px solid ${color}`,
                }}
                >
                    <Image
                        src={icon}
                        alt={`Icon ${displayName}`}
                        width={40}
                        height={40}
                        className="object-contain p-1 w-full h-full"
                        onError={(e) => { 
                            (e.currentTarget as HTMLImageElement).onerror = null; 
                            (e.currentTarget as HTMLImageElement).src = JURUSAN_STYLE_DATA["RPL"].icon;
                        }}
                    />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Daftar Agenda Kelas {displayName} ({pretty(decodedJurusan).toUpperCase().split(' ').join('-')})
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
                        Pilih kelas untuk melihat dan mengelola agenda pembelajaran
                    </p>
                </div>
            </div>
        </ThemedContainer>

        <BreadcrumbNav jurusan={jurusanParam} />

        {error && (
            <ThemedContainer variant="default" className="text-center text-red-500 py-6 mb-6">
                <p className="text-lg font-medium">⚠️ Error Integrasi Backend: {error}</p>
                <p className="text-sm mt-1">Pastikan rute API `/api/agenda-kelas/[jurusan]` Anda berjalan dengan benar.</p>
            </ThemedContainer>
        )}

        <ThemedContainer className="p-4 mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["Semua", "X", "XI", "XII"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTingkat(t)}
                  className={`h-10 px-4 rounded-xl transition font-semibold text-sm ${
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 size-5" />
              <input
                placeholder="Cari kelas…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-xl pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             bg-white text-gray-900 border border-gray-300 placeholder:text-gray-500 
                             dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
              />
            </label>
          </div>
        </ThemedContainer>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && !error ? (
            <ThemedContainer className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
              <p className="text-lg font-medium">
                Tidak ada kelas ditemukan untuk kriteria pencarian **{search || "kosong"}** dan tingkat **{tingkat}**.
              </p>
            </ThemedContainer>
          ) : (
            filtered.map((k) => (
              <KelasCard
                key={k.id}
                iconSrc={icon} 
                iconAlt={`Logo ${displayName}`}
                label={k.kelas}
                color={color}
                href={`/admin/agenda-kelas/${jurusanParam}/${encodeURIComponent(
                  k.kelas.toLowerCase().replace(/\s+/g, '-')
                )}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}