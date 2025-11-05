"use client"

import type { GuruAgenda } from "../../../../src/lib/agenda-guru-utils"
import { BookOpen, Clock, Edit3, Loader2, Trash2 } from "lucide-react"

interface AgendaGuruTableProps {
  agendaList: GuruAgenda[]
  deletingId: number | null
  onDelete: (id: number) => void
  onEdit: (agenda: GuruAgenda) => void
}

export default function AgendaGuruTable({ agendaList, deletingId, onDelete, onEdit }: AgendaGuruTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th className="min-w-[120px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Jam
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Guru
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Kelas
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th className="min-w-[170px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Materi
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider hidden md:table-cell">
                Keterangan
              </th>
              <th className="min-w-[120px] px-4 py-3 text-center font-bold text-gray-900 dark:text-white uppercase tracking-wider hidden sm:table-cell">
                Dokumentasi
              </th>
              <th className="min-w-[100px] px-4 py-3 text-center font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {agendaList.map((agenda, idx) => {
              const isEven = idx % 2 === 0
              const isDeleting = deletingId === agenda.id

              return (
                <tr
                  key={agenda.id}
                  className={`border-b border-gray-100 dark:border-gray-700 transition-colors last:border-b-0 ${
                    isEven
                      ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80"
                      : "bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {/* JAM */}
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-blue-500 dark:text-blue-400" />
                      {agenda.jamMulai} - {agenda.jamSelesai}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{agenda.namaGuru}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{agenda.kelas}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{agenda.namaMapel}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-sm font-medium">{agenda.materi}</td>

                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    {agenda.keterangan ? (
                        <span className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                        {agenda.keterangan}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-600 flex justify-center items-center">-</span>
                    )}
                    </td>

                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {agenda.dokumentasi ? (
                      <a
                        href={agenda.dokumentasi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-all text-xs font-medium"
                      >
                        <BookOpen className="size-3" /> Lihat
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(agenda)}
                        className="inline-flex items-center justify-center size-7 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        title="Edit Agenda"
                        disabled={isDeleting}
                      >
                        <Edit3 className="size-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(agenda.id)}
                        className="inline-flex items-center justify-center size-7 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-50"
                        title="Hapus Agenda"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
