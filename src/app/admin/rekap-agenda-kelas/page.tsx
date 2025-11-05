"use client"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import {
  Download,
  RefreshCw,
  CalendarDays,
  XIcon,
  ListFilter,
  Info,
  Search,
  BookOpen,
  ChevronRight,
  Upload,
  Trash2,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Zap,
  BarChart3,
  Filter,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { createPortal } from "react-dom"
import ExcelJS from "exceljs"

type Jurusan = {
  id: number
  jurusan: string
}
type Kelas = {
  id: number
  kelas: string
  id_jurusan: number
  id_waliKelas: number
}
type Account = {
  id: number
  nama_lengkap: string | null
  username: string
}
type Mapel = {
  id: number
  mapel: string
}
type Agenda = {
  id: number
  date: string 
  time_start: string 
  time_end: string
  id_class: number
  id_mapel: number
  materi: string | null
  keterangan: string | null
  id_guru: number
  doc_path: string | null
  kelas: Kelas
  guru: Account
  mapel: Mapel
}
type Siswa = {
  NIS: string
  Nama: string
  JK: "L" | "P"
  status: "Aktif" | "NonAktif"
  id_class: number
  kelas: Kelas
}

type AttendanceStatus = "HADIR" | "SAKIT" | "IZIN" | "ALPA"

const formatDateLabel = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const statusBoxClass = (status?: string | null) => {
  switch (status) {
    case "HADIR":
      return "bg-emerald-500 text-white"
    case "SAKIT":
      return "bg-amber-500 text-white"
    case "IZIN":
      return "bg-sky-500 text-white"
    case "ALPA":
      return "bg-rose-500 text-white"
    default:
      return "bg-white text-gray-600 border border-gray-300 dark:border-gray-700"
  }
}

const ThemedCard = ({
  children,
  className = "",
  variant = "default",
}: { children: React.ReactNode; className?: string; variant?: "default" | "gradient" | "accent" }) => {
  const variantClasses = {
    default: "bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800",
    gradient:
      "bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-gray-900 border border-slate-200 dark:border-slate-700",
    accent:
      "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50",
  }
  return (
    <section
      className={`rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${variantClasses[variant]} ${className}`}
    >
      {children}
    </section>
  )
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color = "blue",
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: { value: number; direction: "up" | "down" }
  color?: string
}) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-600 dark:text-blue-400",
    green:
      "from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 text-emerald-600 dark:text-emerald-400",
    purple:
      "from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20 text-purple-600 dark:text-purple-400",
    orange:
      "from-orange-500/10 to-orange-600/10 dark:from-orange-500/20 dark:to-orange-600/20 text-orange-600 dark:text-orange-400",
  }
  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-4 border border-current/10`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-current/10">{Icon}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${trend.direction === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {trend.direction === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function AgendaDetailPanel({
  open,
  onClose,
  agenda,
  kelas,
}: {
  open: boolean
  onClose: () => void
  agenda: Agenda
  kelas: Kelas
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-4xl bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 shadow-md">
          <div>
            <h3 className="text-xl font-bold text-white">{kelas.kelas}</h3>
            <p className="text-sm text-blue-100 mt-1">{formatDateLabel(agenda.date)}</p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <XIcon className="size-6 text-white" />
          </button>
        </div>

        {/* Hanya satu tab: Detail */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Informasi Pembelajaran</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <p className="text-xs text-gray-500 dark:text-gray-400">Waktu</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(agenda.time_start).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - {new Date(agenda.time_end).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="border rounded-lg p-3 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <p className="text-xs text-gray-500 dark:text-gray-400">Guru Pengajar</p>
                <p className="font-semibold text-gray-900 dark:text-white">{agenda.guru.nama_lengkap || agenda.guru.username}</p>
              </div>
              <div className="border rounded-lg p-3 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <p className="text-xs text-gray-500 dark:text-gray-400">Mata Pelajaran</p>
                <p className="font-semibold text-gray-900 dark:text-white">{agenda.mapel.mapel}</p>
              </div>
            </div>
          </div>

          {agenda.materi && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">Materi</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">{agenda.materi}</p>
              </div>
            </div>
          )}

          {agenda.doc_path && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">Dokumentasi</h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={agenda.doc_path} alt="Dokumentasi" className="w-full h-48 object-cover" />
              </div>
              <a href={agenda.doc_path} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Lihat dokumentasi lengkap →
              </a>
            </div>
          )}

          {agenda.keterangan && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">Keterangan</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">{agenda.keterangan}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  )
}
function RekapAgendaView({
  selectedKelas,
  agendas,
  onBack,
  siswa,
}: {
  selectedKelas: Kelas
  agendas: Agenda[]
  onBack: () => void
  siswa: Siswa[]
}) {
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailAgenda, setDetailAgenda] = useState<Agenda | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table")
  const [showFilters, setShowFilters] = useState(false)

  const kelasAgendas = useMemo(() => agendas.filter((a) => a.id_class === selectedKelas.id), [agendas, selectedKelas.id])

  const filteredAgendas = useMemo(() => {
    let list = [...kelasAgendas]
    if (selectedDates.length > 0) {
      list = list.filter((a) => selectedDates.includes(a.date.split('T')[0])) 
    }
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [kelasAgendas, selectedDates])

  const addDate = (d: string) => {
    if (!d || selectedDates.includes(d)) return
    setSelectedDates([...selectedDates, d].sort())
  }

  const removeDate = (d: string) => setSelectedDates(selectedDates.filter((x) => x !== d))

  const exportToExcel = async () => {
    if (filteredAgendas.length === 0) return
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Rekap Agenda")

    worksheet.columns = [
      { header: "Tanggal", key: "Tanggal", width: 15 },
      { header: "Waktu", key: "Waktu", width: 20 },
      { header: "Nama Guru", key: "Nama Guru", width: 25 },
      { header: "Mata Pelajaran", key: "Mata Pelajaran", width: 25 },
      { header: "Materi", key: "Materi", width: 40 },
      { header: "Kejadian Penting", key: "Kejadian Penting", width: 35 },
    ]

    filteredAgendas.forEach((agenda) => {
      worksheet.addRow({
        Tanggal: new Date(agenda.date).toLocaleDateString("id-ID"),
        Waktu: `${new Date(agenda.time_start).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - ${new Date(agenda.time_end).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`,
        "Nama Guru": agenda.guru.nama_lengkap || agenda.guru.username,
        "Mata Pelajaran": agenda.mapel.mapel,
        Materi: agenda.materi || "-",
        "Kejadian Penting": agenda.keterangan || "-",
      })
    })

    try {
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rekap-agenda-${selectedKelas.kelas}-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("Gagal mengekspor data ke Excel.")
    }
  }

  const openDetail = (agenda: Agenda) => {
    setDetailAgenda(agenda)
    setDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-900 px-4 py-6">
      <div className="max-w-screen-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors" aria-label="Kembali">
              <ChevronRight className="size-5 text-slate-600 dark:text-slate-300 rotate-180" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedKelas.kelas}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            >
              {viewMode === "table" ? <CalendarDays className="size-5" /> : <FileText className="size-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="size-5" />} label="Total Agenda" value={filteredAgendas.length} color="blue" />
          <StatCard icon={<Clock className="size-5" />} label="Guru Pengajar" value={new Set(filteredAgendas.map((a) => a.id_guru)).size} color="green" />
          <StatCard icon={<Zap className="size-5" />} label="Mata Pelajaran" value={new Set(filteredAgendas.map((a) => a.id_mapel)).size} color="orange" />
        </div>

        <ThemedCard variant="gradient" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Filter className="size-4" /> Filter & Pilih Tanggal
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {showFilters ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {showFilters && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {selectedDates.length === 0 ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400">Belum ada tanggal dipilih.</span>
                ) : (
                  selectedDates.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 text-sm text-white shadow-sm"
                    >
                      <CalendarDays className="size-3.5" />
                      {new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      <button onClick={() => removeDate(d)} className="opacity-70 hover:opacity-100 transition-opacity">
                        <XIcon className="size-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    onChange={(e) => addDate(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addDate((document.querySelector('input[type="date"]') as HTMLInputElement)?.value)}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors text-sm font-medium"
                  >
                    Tambah
                  </button>
                </div>
                <button
                  onClick={() => addDate(new Date().toISOString().slice(0, 10))}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-500 transition-colors text-sm font-medium"
                >
                  <CalendarDays className="size-4" /> Hari Ini
                </button>
              </div>
            </div>
          )}
        </ThemedCard>

        <section className="space-y-4">
          {filteredAgendas.length === 0 ? (
            <ThemedCard className="text-center text-slate-500 dark:text-slate-400 py-12">
              <BookOpen className="size-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada agenda ditemukan.</p>
            </ThemedCard>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rekap Agenda Pembelajaran</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total {filteredAgendas.length} agenda</p>
                </div>
                <button onClick={exportToExcel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 transition-all text-sm font-medium shadow-sm">
                  <Download size={16} /> Export Excel
                </button>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-900">
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Tanggal</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Waktu</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Nama Guru</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Mata Pelajaran</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Materi</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">Keterangan</th>
                        <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">Dokumentasi</th>
                        <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgendas.map((agenda, idx) => (
                        <tr
                          key={agenda.id}
                          className={`border-b border-slate-200 dark:border-slate-800 ${
                            idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-slate-50 dark:bg-gray-900"
                          }`}
                        >
                          <td className="px-4 py-3 text-slate-900 dark:text-white font-medium whitespace-nowrap">
                            {new Date(agenda.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap text-xs">
                            {new Date(agenda.time_start).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - {new Date(agenda.time_end).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{agenda.guru.nama_lengkap || agenda.guru.username}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{agenda.mapel.mapel}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate text-xs">{agenda.materi || "-"}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate text-xs">{agenda.keterangan || "-"}</td>
                          <td className="px-4 py-3 text-center">
                            {agenda.doc_path ? (
                              <a href={agenda.doc_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                <BookOpen className="size-3" /> Lihat
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => openDetail(agenda)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 transition-all text-xs font-medium shadow-sm"
                            >
                              <Info className="size-3.5" /> Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {detailOpen && detailAgenda && (
        <AgendaDetailPanel open={detailOpen} onClose={() => setDetailOpen(false)} agenda={detailAgenda} kelas={selectedKelas} />
      )}
    </div>
  )
}

export default function RekapAgendaPage() {
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [jurusan, setJurusan] = useState<Jurusan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAngkatan, setFilterAngkatan] = useState<string>("")
  const [filterJurusan, setFilterJurusan] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"Semua" | "X" | "XI" | "XII">("Semua")
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAllData = async () => {
    try {
      const res = await fetch("/api/rekap-agenda-kelas")
      const data = await res.json()
      setKelas(data.kelas)
      setAgendas(data.agendas)
      setSiswa(data.siswa)
      setJurusan(data.jurusan)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const filteredKelas = useMemo(() => {
    let list = [...kelas].filter(
      (k) =>
        k.kelas.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterAngkatan === "" || k.kelas.includes(filterAngkatan)) &&
        (filterJurusan === "" || jurusan.find((j) => j.id === k.id_jurusan)?.jurusan === filterJurusan)
    )
    if (activeTab !== "Semua") {
      list = list.filter((k) => k.kelas.startsWith(activeTab))
    }
    return list
  }, [kelas, activeTab, searchTerm, filterAngkatan, filterJurusan, jurusan])

  if (selectedKelas) {
    return (
      <RekapAgendaView
        selectedKelas={selectedKelas}
        agendas={agendas}
        onBack={() => setSelectedKelas(null)}
        siswa={siswa.filter((s) => s.id_class === selectedKelas.id)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-900 px-4 py-6">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <BookOpen className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Rekap Agenda Pembelajaran</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kelola dan pantau agenda pembelajaran kelas Anda</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users className="size-5" />} label="Total Kelas" value={filteredKelas.length} color="blue" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(["Semua", "X", "XI", "XII"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab === "Semua" ? "Semua Angkatan" : `Kelas ${tab}`}
              </button>
            ))}
          </div>
        </div>

        <ThemedCard variant="gradient" className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-4">
            <ListFilter className="size-4" /> Filter Kelas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Cari kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter Angkatan"
                value={filterAngkatan}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || /^\d+$/.test(value)) setFilterAngkatan(value)
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <select
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Semua Jurusan</option>
                {jurusan.map((j) => (
                  <option key={j.id} value={j.jurusan}>
                    {j.jurusan}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ThemedCard>

        <section>
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Pilih Kelas</h2>
          {filteredKelas.length === 0 ? (
            <ThemedCard className="text-center text-slate-500 dark:text-slate-400 py-12">
              <BookOpen className="size-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada kelas ditemukan</p>
            </ThemedCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredKelas.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKelas(k)}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-500/10 bg-white dark:bg-gray-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 p-4 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-1.5 rounded-full group-hover:h-12 transition-all bg-blue-600" />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-bold truncate text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {k.kelas}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                        {jurusan.find((j) => j.id === k.id_jurusan)?.jurusan || "N/A"} • {k.kelas.split(" ")[0]}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}