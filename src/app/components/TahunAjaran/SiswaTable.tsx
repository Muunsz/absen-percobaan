import React from "react"
import { Edit, Trash2 } from "lucide-react"
import type { Siswa } from "./types"

export default function SiswaTable({ siswaList, onEdit, onDelete }: { siswaList: Siswa[]; onEdit?: (s: Siswa) => void; onDelete?: (id: number) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">NIS</th>
            <th className="py-3 px-4 text-left font-semibold">Nama</th>
            <th className="py-3 px-4 text-left font-semibold">JK</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Angkatan</th>
            <th className="py-3 px-4 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {siswaList.length > 0 ? (
            siswaList.map((siswa) => (
              <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-[#27364f] transition-colors duration-200">
                <td className="py-3 px-4">{siswa.nis}</td>
                <td className="py-3 px-4 font-medium">{siswa.nama}</td>
                <td className="py-3 px-4">{siswa.jenisKelamin === "Laki-laki" ? "L" : "P"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      siswa.status === "Aktif"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : siswa.status === "Nonaktif"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : siswa.status === "Lulus"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {siswa.status}
                  </span>
                </td>
                <td className="py-3 px-4">{siswa.angkatan}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(siswa)}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium transition text-xs"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(siswa.id)}
                      className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 font-medium transition text-xs"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                Tidak ada siswa yang sesuai filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
