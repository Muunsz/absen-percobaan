"use client"

import type { GuruAgenda } from "../../../../src/lib/agenda-guru-utils"

import { ArrowUpRight, Book, Clock, Edit3, Loader2, Trash2, User } from "lucide-react"

interface AgendaGuruCardProps {
  agenda: GuruAgenda
  onDelete: (id: number) => void
  onEdit: (agenda: GuruAgenda) => void
  isDeleting: boolean
}

export default function AgendaGuruCard({ agenda, onDelete, onEdit, isDeleting }: AgendaGuruCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500 transition-all shadow-md space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {agenda.jamMulai} - {agenda.jamSelesai}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(agenda)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group disabled:opacity-50"
            title="Edit Agenda"
            disabled={isDeleting}
          >
            <Edit3 className="size-4" />
          </button>
          <button
            onClick={() => onDelete(agenda.id)}
            className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group disabled:opacity-50"
            title="Hapus Agenda"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="size-4 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>
      <h3 className="text-2xl text-gray-900 dark:text-white font-extrabold leading-snug tracking-tight">
        {agenda.materi}
      </h3>
      <div className="space-y-2 text-sm pt-2">
        <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
          <Book className="size-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-gray-900 dark:text-white">{agenda.namaMapel}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
          <User className="size-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">{agenda.kelas}</span>
        </p>
      </div>
      {agenda.keterangan && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Keterangan:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">{agenda.keterangan}</p>
        </div>
      )}
      {agenda.dokumentasi ? (
        <a
          href={agenda.dokumentasi}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-1 mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 transition-colors"
        >
          Lihat Dokumentasi <ArrowUpRight className="size-3" />
        </a>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          Tidak ada tautan dokumentasi.
        </p>
      )}
    </div>
  )
}
