import React, { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { XIcon, RefreshCw, CalendarDays, Clock, Calendar } from "lucide-react"
import { KelasListItem, RekapAbsensiResult, FilterType, MONTH_NAMES_ID } from "@/utils/types"
import { getTingkatDariNamaKelas, getAngkatanByTingkat, getStatusClasses } from "@/utils/helpers"
import { StudentDetailPanel } from "./StudentDetailPanel"

export function ClassDetailPanel({
  open,
  onClose,
  kelas,
  selectedDates,
  onFetchDetailData,
  detailData,
  isFetchingDetail,
}: {
  open: boolean
  onClose: () => void
  kelas: KelasListItem
  selectedDates: string[]
  onFetchDetailData: (classId: number, startDate: string, endDate: string) => void
  detailData: RekapAbsensiResult[]
  isFetchingDetail: boolean
}) {
  const sortedDates = useMemo(() => selectedDates.slice().sort(), [selectedDates])

  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterSingleDate, setFilterSingleDate] = useState<string>("")

  useEffect(() => {
    if (open && sortedDates.length > 0) {
      setFilterType("all")
      setFilterMonth("all")
      setFilterSingleDate("")
      onFetchDetailData(kelas.id, sortedDates[0], sortedDates[sortedDates.length - 1])
    }
  }, [open, kelas.id, sortedDates, onFetchDetailData])

  const availableMonths = useMemo(() => {
    const monthNumbers = new Set<string>()
    for (const dateStr of sortedDates) {
      monthNumbers.add(dateStr.substring(5, 7))
    }
    return Array.from(monthNumbers).sort()
  }, [sortedDates])

  const filteredResults = useMemo(() => {
    let filteredAbsensi: {
      siswa: RekapAbsensiResult
      abs: RekapAbsensiResult["absensi"][0]
    }[] = []


    for (const siswa of detailData) {
      for (const abs of siswa.absensi) {
        let isDateMatch = false

        if (filterType === "byDate" && filterSingleDate) {
          isDateMatch = abs.tanggal === filterSingleDate
        } else if (filterType === "byMonth" && filterMonth !== "all") {
          isDateMatch = abs.tanggal.substring(5, 7) === filterMonth
        } else if (filterType === "all") {
          isDateMatch = true
        }

        if (isDateMatch) {
          filteredAbsensi.push({ siswa, abs })
        }
      }
    }

    filteredAbsensi.sort((a, b) => {
      if (a.abs.tanggal !== b.abs.tanggal) {
        return a.abs.tanggal.localeCompare(b.abs.tanggal)
      }
      return a.siswa.Nama.localeCompare(b.siswa.Nama)
    })

    return filteredAbsensi

  }, [detailData, filterType, filterMonth, filterSingleDate])

  const filterDescription = useMemo(() => {
    if (filterType === "byDate" && filterSingleDate) {
      return `Data difilter untuk tanggal: ${new Date(filterSingleDate).toLocaleDateString("id-ID")}`
    }
    if (filterType === "byMonth" && filterMonth !== "all") {
      const monthName = MONTH_NAMES_ID.find(m => m.index.toString().padStart(2, '0') === filterMonth)?.name
      return `Data difilter untuk bulan: ${monthName}`
    }
    return `Data dari rentang: ${sortedDates.length > 0 ? new Date(sortedDates[0]).toLocaleDateString("id-ID") : 'N/A'} - ${sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString("id-ID") : 'N/A'}`
  }, [filterType, filterSingleDate, filterMonth, sortedDates])


  const [selectedStudent, setSelectedStudent] = useState<RekapAbsensiResult | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedStudent) setSelectedStudent(null)
        else onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, selectedStudent, onClose])

  if (!open) return null

  const tingkatKelas = getTingkatDariNamaKelas(kelas.kelas)
  const angkatanTahun = getAngkatanByTingkat(tingkatKelas)

  let lastDate = ""
  const rowsWithSeparator = []

  for (let i = 0; i < filteredResults.length; i++) {
    const r = filteredResults[i]
    const currentDate = r.abs.tanggal

    if (filterType !== "byDate" && currentDate !== lastDate) {
      rowsWithSeparator.push(
        <tr key={`separator-${currentDate}`} className="bg-gray-200 dark:bg-gray-700/50 border-t border-b border-gray-300 dark:border-gray-700">
          <td colSpan={6} className="px-4 py-1.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              Tanggal: {new Date(currentDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </td>
        </tr>
      )
      lastDate = currentDate
    }

    rowsWithSeparator.push(
      <tr key={`${r.siswa.NIS}-${r.abs.tanggal}-${i}`} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.siswa.NIS}</td>
        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{r.siswa.Nama}</td>
        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
          {new Date(r.abs.tanggal).toLocaleDateString("id-ID")}
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(r.abs.keterangan)}`}
          >
            {r.abs.keterangan}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.abs.deskripsi || "-"}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setSelectedStudent(r.siswa)}
            className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Detail
          </button>
        </td>
      </tr>
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => selectedStudent ? setSelectedStudent(null) : onClose()} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl lg:max-w-4xl bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{kelas.kelas}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jurusan {kelas.jurusan.jurusan} ({kelas.jurusan.id}) •
              Angkatan {angkatanTahun || "N/A"} •
              {kelas.totalSiswaAktif} Siswa Aktif
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Detail Kelas"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XIcon className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-[73px] bg-gray-50 dark:bg-gray-800 z-5">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Filter Data Absensi:</h4>

          <div className="flex flex-wrap items-center gap-3">
            {(["all", "byMonth", "byDate"] as FilterType[]).map(type => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type)
                  if (type === 'byMonth' && filterMonth === "all" && availableMonths.length > 0) setFilterMonth(availableMonths[0])
                  if (type === 'byDate' && !filterSingleDate && sortedDates.length > 0) setFilterSingleDate(sortedDates[0])
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filterType === type
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
              >
                {type === "all" && <Clock className="size-4" />}
                {type === "byMonth" && <Calendar className="size-4" />}
                {type === "byDate" && <CalendarDays className="size-4" />}
                {type === "all" ? "Semua Rentang" : type === "byMonth" ? "Per Bulan" : "Per Tanggal"}
              </button>
            ))}

            {filterType === "byMonth" && (
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                {availableMonths.map((monthNum) => {
                  const monthName = MONTH_NAMES_ID.find(m => m.index.toString().padStart(2, '0') === monthNum)?.name
                  return (
                    <option key={monthNum} value={monthNum}>
                      {monthName}
                    </option>
                  )
                })}
              </select>
            )}

            {filterType === "byDate" && (
              <input
                type="date"
                value={filterSingleDate}
                onChange={(e) => setFilterSingleDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                min={sortedDates[0]}
                max={sortedDates[sortedDates.length - 1]}
              />
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-800 dark:text-gray-200">{filteredResults.length} hasil</span> | {filterDescription}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isFetchingDetail ? (
            <div className="py-10 text-center text-blue-600 dark:text-blue-400">
              <RefreshCw className="size-6 mx-auto animate-spin" />
              <p className="mt-2">Memuat data absensi...</p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 z-5">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-[15%]">NIS</th>
                  <th className="text-left px-4 py-3 font-medium w-[25%]">Nama</th>
                  <th className="text-left px-4 py-3 font-medium w-[15%]">Tanggal</th>
                  <th className="text-left px-4 py-3 font-medium w-[15%]">Status</th>
                  <th className="text-left px-4 py-3 font-medium w-[20%]">Alasan</th>
                  <th className="text-right px-4 py-3 font-medium w-[10%]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      {selectedDates.length === 0 ? "Pilih tanggal di halaman utama." : "Tidak ada data absensi untuk kriteria ini."}
                    </td>
                  </tr>
                ) : rowsWithSeparator}
              </tbody>
            </table>
          )}
        </div>
      </aside>
      {selectedStudent && (
        <StudentDetailPanel
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          siswa={selectedStudent}
          allAbsensi={detailData}
        />
      )}
    </div>,
    document.body
  )
}