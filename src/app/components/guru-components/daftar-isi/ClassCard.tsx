import React from "react"
import { KelasListItem } from "@/utils/types"
import { getTingkatDariNamaKelas, getAngkatanByTingkat } from "@/utils/helpers"

export function ClassCard({
  kelas,
  isSelected,
  onToggle,
  onOpenDetail,
}: {
  kelas: KelasListItem
  isSelected: boolean
  onToggle: () => void
  onOpenDetail: () => void
}) {
  const tingkatKelas = getTingkatDariNamaKelas(kelas.kelas);
  const angkatanTahun = getAngkatanByTingkat(tingkatKelas);
  const isLulusan = tingkatKelas === "XII" && kelas.totalSiswaAktif === 0;

  return (
    <div
      className={`rounded-lg border p-4 transition-all flex flex-col justify-between h-full ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10 ring-2 ring-blue-500 shadow-lg"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-full w-1.5 rounded-full min-h-[40px] mt-0.5"
          style={{ backgroundColor: "#3b82f6" }} 
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate text-lg text-gray-900 dark:text-white mb-1">{kelas.kelas}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {kelas.jurusan.jurusan}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tingkat {tingkatKelas || "N/A"} • Angkatan {angkatanTahun || "N/A"}
          </p>
          <p className={`text-xs font-semibold mt-2 ${isLulusan ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {isLulusan ? "Kelas Lulusan" : `${kelas.totalSiswaAktif} Siswa Aktif`}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        <button
          onClick={onOpenDetail}
          disabled={isLulusan} 
          className="w-full text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          title="Lihat detail absensi"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  )
}