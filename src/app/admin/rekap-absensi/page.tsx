"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react" 
import { RefreshCw, Info } from "lucide-react"
import { ThemedCard } from "../../components/RekapAbsensi/ThemedCard"
import { ClassCard } from "../../components/RekapAbsensi/ClassCard"
import { DateRangePicker } from "../../components/RekapAbsensi/DateRangePicker"
import { FilterAndActionPanel } from "../../components/RekapAbsensi/FilterandActionPanel"
import { ExportButton } from "../../components/RekapAbsensi/ExportButton"
import { ClassDetailPanel } from "../../components/RekapAbsensi/ClassDetailPanel"
import { getTingkatDariNamaKelas } from "@/utils/helpers"
import type { PrismaJurusan, KelasListItem, RekapAbsensiResult, FilterTab } from "@/utils/types"

export default function RekapAbsensiPage() {
  const [kelasList, setKelasList] = useState<KelasListItem[]>([])
  const [jurusans, setJurusans] = useState<PrismaJurusan[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterJurusan, setFilterJurusan] = useState<string>("")
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua")
  const [selectedKelasIds, setSelectedKelasIds] = useState<number[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  
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
            setKelasList(data.data || []);
            setJurusans(data.jurusans || []);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setIsFetchingInitial(false);
        }
    }
    fetchClasses();
  }, [])
  
  const fetchDetailData = useCallback(async (kelasIds: number[], startDate: string, endDate: string): Promise<RekapAbsensiResult[]> => {
    if (kelasIds.length === 0 || !startDate || !endDate) return [];
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

  const handleFetchDetailForModal = useCallback(async (classId: number, startDate: string, endDate: string) => {
    const data = await fetchDetailData([classId], startDate, endDate);
    setDetailData(data);
  }, [fetchDetailData]); 

  const filteredKelas = useMemo(() => {
    let list = [...kelasList].filter((k) => {
        const isSearchMatch = k.kelas.toLowerCase().includes(searchTerm.toLowerCase());
        const isJurusanMatch = filterJurusan === "" || k.id_jurusan.toString() === filterJurusan;
        
        return isSearchMatch && isJurusanMatch;
    });
    
    if (activeTab === "Lulusan") {
        list = list.filter((k) => getTingkatDariNamaKelas(k.kelas) === "XII" && k.totalSiswaAktif === 0);
    } else if (activeTab !== "Semua") {
      list = list.filter((k) => getTingkatDariNamaKelas(k.kelas) === activeTab)
    }

    if (activeTab !== 'Lulusan') {
        list = list.filter(k => k.totalSiswaAktif > 0);
    }
    
    const levelOrder = { XII: 0, XI: 1, X: 2, N_A: 3 }
    list.sort((a, b) => {
        const tingkatA = getTingkatDariNamaKelas(a.kelas) || "N_A" as const;
        const tingkatB = getTingkatDariNamaKelas(b.kelas) || "N_A" as const;

        const levelA = levelOrder[tingkatA] ?? 3;
        const levelB = levelOrder[tingkatB] ?? 3;
        if (levelA !== levelB) return levelA - levelB;
        return a.kelas.localeCompare(b.kelas);
    })

    return list
  }, [kelasList, activeTab, searchTerm, filterJurusan])

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
  const clearDates = () => setSelectedDates([])
  
  const resetFilter = () => {
    setSearchTerm("")
    setFilterJurusan("")
    setActiveTab("Semua")
    setSelectedKelasIds([])
  }
  
  const addDate = (d: string) => {
    if (!d || selectedDates.includes(d)) return
    setSelectedDates([...selectedDates, d].sort())
  }
  const removeDate = (d: string) => setSelectedDates(selectedDates.filter((x) => x !== d)) 

  const addToday = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const today = `${year}-${month}-${day}`
    addDate(today)
  }

  const addDateRange = (start: string, end: string) => {
    if (!start || !end) return

    const startDate = new Date(start + 'T00:00:00Z')
    const endDate = new Date(end + 'T00:00:00Z')

    if (startDate > endDate) return
    const arr: string[] = []
    const cur = new Date(startDate)

    while (cur <= endDate) {
      const year = cur.getUTCFullYear()
      const month = String(cur.getUTCMonth() + 1).padStart(2, '0')
      const day = String(cur.getUTCDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      if (!selectedDates.includes(dateStr)) {
          arr.push(dateStr)
      }

      cur.setUTCDate(cur.getUTCDate() + 1)
    }
    const merged = Array.from(new Set([...selectedDates, ...arr])).sort()
    setSelectedDates(merged)
  }

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
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Rekap Absensi Siswa</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gunakan filter di bawah untuk memilih kelas dan tanggal sebelum melihat detail atau mengekspor data.
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

        <FilterAndActionPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterJurusan={filterJurusan}
            onJurusanChange={setFilterJurusan}
            jurusanOptions={jurusans} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={resetFilter}
            onSelectAll={selectAllFiltered}
            onClearSelection={clearSelection}
            totalFilteredKelas={filteredKelas.length}
            totalSelectedKelas={selectedKelasIds.length}
            exportButton={
              <ExportButton
                classesToUse={classesToUse}
                selectedDates={selectedDates}
                onFetchDetailData={fetchDetailData} 
                isFetching={isFetchingDetail}
              />
            }
          />
        
        <DateRangePicker
          selectedDates={selectedDates}
          onAddDate={addDate}
          onRemoveDate={removeDate} 
          onAddToday={addToday}
          onAddRange={addDateRange}
          onClearDates={clearDates}
        />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Kelas ({filteredKelas.length} Ditemukan)</h2>
            {selectedDates.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Data akan direkap untuk **{selectedDates.length} hari**
              </span>
            )}
          </div>
          {isFetchingInitial ? (
             <ThemedCard className="text-center text-blue-600 dark:text-blue-400 py-8">
                <RefreshCw className="size-6 mx-auto animate-spin" />
                <p className="mt-2">Memuat daftar kelas...</p>
            </ThemedCard>
          ) : filteredKelas.length === 0 ? (
            <ThemedCard className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Info className="size-6 mx-auto mb-2 text-gray-400" />
                Tidak ada kelas ditemukan dengan kriteria filter yang dipilih.
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