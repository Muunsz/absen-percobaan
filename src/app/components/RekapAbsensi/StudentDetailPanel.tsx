import React, { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { XIcon } from "lucide-react"
import { AbsentStatus, RekapAbsensiResult } from "@/utils/types"
import { getStatusClasses } from "@/utils/helpers"

export function StudentDetailPanel({
  open,
  onClose,
  siswa,
  allAbsensi,
}: {
  open: boolean
  onClose: () => void
  siswa: RekapAbsensiResult
  allAbsensi: RekapAbsensiResult[]
}) {
  const perDate = useMemo(() => {
    const data = allAbsensi.find(s => s.NIS === siswa.NIS);
    return data ? data.absensi : [];
  }, [allAbsensi, siswa.NIS])
  
  const total = useMemo(() => {
    return perDate.reduce(
      (acc, r) => {
        acc[r.keterangan] = (acc[r.keterangan] || 0) + 1;
        acc.total++;
        return acc;
      },
      { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, total: 0 } as Record<AbsentStatus | "total", number>,
    )
  }, [perDate]);

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])
  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-lg bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{siswa.Nama}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">NIS: {siswa.NIS} | Status: {siswa.status}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Detail Siswa"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XIcon className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Ringkasan Absensi ({total.total} Hari)</h4>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: "Hadir", value: total.HADIR, status: "HADIR" },
                  { label: "Izin", value: total.IZIN, status: "IZIN" },
                  { label: "Sakit", value: total.SAKIT, status: "SAKIT" },
                  { label: "Alpa", value: total.ALPA, status: "ALPA" },
                ] as const
              ).map((i) => (
                <div
                  key={i.label}
                  className={`flex flex-col items-center justify-center border rounded-lg p-3 ${getStatusClasses(i.status).replace('bg-', 'border-').replace('text-', 'text-')}`}
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{i.label}</span>
                  <span className={`text-2xl font-bold ${getStatusClasses(i.status).replace(/bg-[a-z]+-[0-9]+\s/g, '').replace(/dark:bg-[a-z]+-[0-9]+\/20\s/g, '')}`}>{i.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mt-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Riwayat per Tanggal</h4>
          </div>
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="text-left px-4 py-3 font-medium w-1/2">Tanggal</th>
                <th className="text-left px-4 py-3 font-medium w-1/2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {perDate.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data absensi dalam rentang tanggal ini.
                  </td>
                </tr>
              )}
              {perDate.map((r) => (
                <tr key={r.tanggal} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                    {new Date(r.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(r.keterangan)}`}
                      title={r.deskripsi || undefined}
                    >
                      {r.keterangan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </div>,
    document.body,
  )
}