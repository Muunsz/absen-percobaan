"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react" 
import { RefreshCw, Info } from "lucide-react"
import { ThemedCard } from "../../components/RekapAbsensi/ThemedCard"
import { ClassCard } from "../../components/guru-components/daftar-isi/ClassCard"
import { ClassDetailPanel } from "../../components/RekapAbsensi/ClassDetailPanel"
import { getTingkatDariNamaKelas } from "@/utils/helpers"
import type { KelasListItem, RekapAbsensiResult } from "@/utils/types"

const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function RekapAbsensiPage() {
  const [kelasList, setKelasList] = useState<KelasListItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKelasIds, setSelectedKelasIds] = useState<number[]>([])
  const todayDate = useMemo(getTodayDateString, [])
  const [selectedDates] = useState<string[]>([todayDate])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailKelas, setDetailKelas] = useState<KelasListItem | null>(null)
  const [detailData, setDetailData] = useState<RekapAbsensiResult[]>([])
  const [isFetchingInitial, setIsFetchingInitial] = useState(true)
  const [isFetchingDetail, setIsFetchingDetail] = useState(false)

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch('/api/rekap-absensi');
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();

        let list: KelasListItem[] = (data.data || []).filter((k: KelasListItem) => k.totalSiswaAktif > 0);
        const levelOrder = { XII: 0, XI: 1, X: 2, N_A: 3 }
        list.sort((a, b) => {
          const tingkatA = getTingkatDariNamaKelas(a.kelas) || "N_A" as const;
          const tingkatB = getTingkatDariNamaKelas(b.kelas) || "N_A" as const;
          const levelA = levelOrder[tingkatA] ?? 3;
          const levelB = levelOrder[tingkatB] ?? 3;
          if (levelA !== levelB) return levelA - levelB;
          return a.kelas.localeCompare(b.kelas);
        })

        setKelasList(list);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsFetchingInitial(false);
      }
    }
    fetchClasses();
  }, [])

  const fetchDetailData = useCallback(async (kelasIds: number[], startDate: string, endDate: string): Promise<RekapAbsensiResult[]> => {
    if (kelasIds.length === 0 || !startDate || !endDate || startDate !== endDate) return []; 
    setIsFetchingDetail(true);
    try {
      const response = await fetch('/api/rekap-absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kelasIds, startDate, endDate }),
      });
      if (!response.ok) throw new Error('Failed to fetch detail absensi');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching detail data:', error);
      return [];
    } finally {
      setIsFetchingDetail(false);
    }
  }, [setIsFetchingDetail]); 

  const handleFetchDetailForModal = useCallback(async (classId: number) => {
    const data = await fetchDetailData([classId], todayDate, todayDate); 
    setDetailData(data);
  }, [fetchDetailData, todayDate]); 

  // Filter kelas berdasarkan searchTerm (case insensitive)
  const filteredKelas = useMemo(() => {
    if (!searchTerm.trim()) return kelasList;
    const lowerSearch = searchTerm.toLowerCase();
    return kelasList.filter(k => k.kelas.toLowerCase().includes(lowerSearch));
  }, [kelasList, searchTerm]);

  const classesToUse = useMemo(
    () => (selectedKelasIds.length > 0 ? kelasList.filter((k) => selectedKelasIds.includes(k.id)) : filteredKelas),
    [kelasList, filteredKelas, selectedKelasIds],
  )

  const totalSiswa = classesToUse.reduce((acc, k) => acc + k.totalSiswaAktif, 0)
  const totalKelas = classesToUse.length

  const toggleKelasSelection = (id: number) =>
    setSelectedKelasIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const selectAllFiltered = () => {
    setSelectedKelasIds(filteredKelas.map((k) => k.id))
  }
  const clearSelection = () => setSelectedKelasIds([])

  const openDetail = (kelasItem: KelasListItem) => {
    setDetailKelas(kelasItem)
    setDetailData([]); 
    setDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <ThemedCard className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Absensi Siswa Hari Ini</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan rekap absensi untuk tanggal <span className="font-semibold text-blue-600 dark:text-blue-400">{todayDate}</span>.
            </p>
          </div>
          <div className="flex gap-4">
            <ThemedCard className="p-3 text-center border-blue-500/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Siswa Direkap</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSiswa}</p>
            </ThemedCard>
            <ThemedCard className="p-3 text-center border-blue-500/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">Kelas Direkap</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalKelas}</p>
            </ThemedCard>
          </div>
        </ThemedCard>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-lg p-4 dark:bg-gray-800">
          <div className="flex-1">
            <label htmlFor="searchKelas" className="block mb-1 font-bold text-gray-900 dark:text-white">
              Cari Kelas
            </label>
            <input
              type="text"
              id="searchKelas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama kelas..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Data akan direkap untuk <strong>Hari Ini</strong> ({todayDate})
            </span>
          </div>
          {isFetchingInitial ? (
            <ThemedCard className="text-center text-blue-600 dark:text-blue-400 py-8">
              <RefreshCw className="size-6 mx-auto animate-spin" />
              <p className="mt-2">Memuat daftar kelas...</p>
            </ThemedCard>
          ) : filteredKelas.length === 0 ? (
            <ThemedCard className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Info className="size-6 mx-auto mb-2 text-gray-400" />
              Tidak ada kelas aktif yang ditemukan.
            </ThemedCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredKelas.map((k) => (
                <ClassCard
                  key={k.id}
                  kelas={k}
                  isSelected={selectedKelasIds.includes(k.id)}
                  onToggle={() => toggleKelasSelection(k.id)}
                  onOpenDetail={() => openDetail(k)} 
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {detailOpen && detailKelas && (
        <ClassDetailPanel
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          kelas={detailKelas}
          selectedDates={selectedDates}
          onFetchDetailData={handleFetchDetailForModal} 
          detailData={detailData}
          isFetchingDetail={isFetchingDetail}
        />
      )}
    </div>
  )
}
