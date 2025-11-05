import React from "react"
import { Search, RefreshCw } from "lucide-react"
import { ThemedCard } from "./ThemedCard"
import { PrismaJurusan, FilterTab } from "@/utils/types"

export function FilterAndActionPanel({
    searchTerm,
    onSearchChange,
    filterJurusan,
    onJurusanChange,
    jurusanOptions,
    activeTab,
    onTabChange,
    onReset,
    onSelectAll,
    onClearSelection,
    totalFilteredKelas,
    exportButton,
    totalSelectedKelas,
}: {
    searchTerm: string
    onSearchChange: (v: string) => void
    filterJurusan: string
    onJurusanChange: (v: string) => void
    jurusanOptions: PrismaJurusan[]
    activeTab: FilterTab
    onTabChange: (tab: FilterTab) => void
    onReset: () => void
    onSelectAll: () => void
    onClearSelection: () => void
    totalFilteredKelas: number
    exportButton: React.ReactNode
    totalSelectedKelas: number
}) {
    return (
      <ThemedCard className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Cari kelas (contoh: X RPL 1)..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {exportButton}
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div>
            <select
              value={filterJurusan}
              onChange={(e) => onJurusanChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Jurusan</option>
              {jurusanOptions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.jurusan}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={onReset}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1 transition-colors"
          >
            <RefreshCw size={14} /> Reset Filter
          </button>
        </div>
  
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 lg:w-1/3">
            <button
              onClick={onSelectAll}
              className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              title={totalSelectedKelas > 0 ? "Pilih Semua kelas yang saat ini terfilter" : "Batalkan semua pilihan"}
            >
              Pilih Semua ({totalFilteredKelas})
            </button>
            <button
              onClick={onClearSelection}
              disabled={totalSelectedKelas === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bersihkan Pilihan
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 lg:flex-1 lg:justify-end">
            {(["Semua", "X", "XI", "XII", "Lulusan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tab === "Semua" ? "Semua Kelas" : tab === "Lulusan" ? "Kelas Lulusan" : `Kelas ${tab}`}
              </button>
            ))}
          </div>
        </div>
      </ThemedCard>
    )
}