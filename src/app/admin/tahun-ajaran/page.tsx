"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import {
  PlusCircle,
  X,
  Search,
  ArrowUp,
  Users,
  GraduationCap,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  UserPlus,
  BookOpen,
  Calendar,
  UserCheck,
  Copy,
  Archive,
  RotateCcw,
  RotateCw,
  ArrowRight,
  Info,
  History,
  Move,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { z } from "zod"
import StatCard from "@/app/components/TahunAjaran/StatCard"
import SiswaTable from "@/app/components/TahunAjaran/SiswaTable"
import type { Jurusan, Kelas, Siswa, LogEntry, SiswaStatus } from "@/app/components/TahunAjaran/types"

// =========================
// Validation Schemas
// =========================
const KelasSchema = z.object({
  name_kelas: z.string().min(1, "Nama kelas wajib diisi"),
  jurusan_id: z.number().min(1, "Jurusan wajib dipilih"),
  kelas_tingkat: z.enum(["X", "XI", "XII"]),
  wali_kelas_id: z.number().min(1, "Wali kelas wajib dipilih"),
  angkatan: z.number().min(2000, "Angkatan tidak valid"),
  kapasitas_siswa: z.number().min(1, "Kapasitas minimal 1"),
})

const SiswaSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  status: z.enum(["Aktif", "Nonaktif", "Lulus", "Keluar"]),
  kelas_id: z.number().nullable(),
  angkatan: z.number().min(2000, "Angkatan tidak valid"),
})

// =========================
// Initial Data (merged)
// =========================
const initialJurusanData: Jurusan[] = [
  {
    id: 1,
    nama_jurusan: "Rekayasa Perangkat Lunak",
    kode_jurusan: "RPL",
    warna: "#3b82f6",
    warnaGelap: "#60a5fa",
    icon: "💻",
  },
  {
    id: 2,
    nama_jurusan: "Teknik Komputer dan Jaringan",
    kode_jurusan: "TKJ",
    warna: "#10b981",
    warnaGelap: "#34d399",
    icon: "🔌",
  },
  {
    id: 3,
    nama_jurusan: "Bisnis Daring dan Pemasaran",
    kode_jurusan: "BDP",
    warna: "#8b5cf6",
    warnaGelap: "#a78bfa",
    icon: "💼",
  },
  {
    id: 4,
    nama_jurusan: "Teknik dan Bisnis Sepeda Motor",
    kode_jurusan: "TBSM",
    warna: "#f59e0b",
    warnaGelap: "#fbbf24",
    icon: "🔧",
  },
  { id: 5, nama_jurusan: "Desain Fesyen", kode_jurusan: "DF", warna: "#ec4899", warnaGelap: "#f472b6", icon: "🧵" },
]

const initialGuruData = [
  { id: 1, nama: "Bpk. Andi Surya, S.Pd.", nip: "198001012005121001" },
  { id: 2, nama: "Ibu. Dian Pratiwi, S.Pd.", nip: "198505152008052001" },
  { id: 3, nama: "Bpk. Budi Santoso, S.Kom." },
  { id: 4, nama: "Ibu. Ratna Dewi, S.Pd." },
  { id: 5, nama: "Bpk. Joko Susilo, S.Pd.I." },
]

const initialKelasData: Kelas[] = [
  {
    id: 1,
    name_kelas: "X RPL 1",
    jurusan_id: 1,
    kelas_tingkat: "X",
    wali_kelas_id: 1,
    deskripsi: "Kelas pertama jurusan RPL.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 2,
    name_kelas: "X RPL 2",
    jurusan_id: 1,
    kelas_tingkat: "X",
    wali_kelas_id: 2,
    deskripsi: "Kelas kedua jurusan RPL.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 3,
    name_kelas: "XI RPL 1",
    jurusan_id: 1,
    kelas_tingkat: "XI",
    wali_kelas_id: 3,
    deskripsi: "Kelas XI jurusan RPL.",
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 4,
    name_kelas: "XI TKJ 1",
    jurusan_id: 2,
    kelas_tingkat: "XI",
    wali_kelas_id: 4,
    deskripsi: "Kelas XI jurusan TKJ.",
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 5,
    name_kelas: "XII RPL 1",
    jurusan_id: 1,
    kelas_tingkat: "XII",
    wali_kelas_id: 5,
    deskripsi: "Kelas terakhir jurusan RPL.",
    angkatan: 2022,
    created_at: "2022-07-01T08:00:00Z",
    updated_at: "2022-07-01T08:00:00Z",
    is_arsip: true,
    kapasitas_siswa: 30,
  },
  {
    id: 6,
    name_kelas: "X TKJ 1",
    jurusan_id: 2,
    kelas_tingkat: "X",
    wali_kelas_id: 1,
    deskripsi: "Kelas X jurusan TKJ.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 7,
    name_kelas: "XI OTOMOTIF 1",
    jurusan_id: 4,
    kelas_tingkat: "XI",
    wali_kelas_id: 2,
    deskripsi: "Kelas XI TBSM.",
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 25,
  },
  {
    id: 8,
    name_kelas: "XII BDP 1",
    jurusan_id: 3,
    kelas_tingkat: "XII",
    wali_kelas_id: 3,
    deskripsi: "Kelas XII BDP.",
    angkatan: 2022,
    created_at: "2022-07-01T08:00:00Z",
    updated_at: "2022-07-01T08:00:00Z",
    is_arsip: true,
    kapasitas_siswa: 35,
  },
  {
    id: 9,
    name_kelas: "X DF 1",
    jurusan_id: 5,
    kelas_tingkat: "X",
    wali_kelas_id: 4,
    deskripsi: "Kelas X DF.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 28,
  },
  {
    id: 10,
    name_kelas: "X RPL 3",
    jurusan_id: 1,
    kelas_tingkat: "X",
    wali_kelas_id: 5,
    deskripsi: "Kelas ketiga jurusan RPL.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  {
    id: 12,
    name_kelas: "XI RPL 1",
    jurusan_id: 1,
    kelas_tingkat: "X",
    wali_kelas_id: 5,
    deskripsi: "Kelas Pertama jurusan RPL.",
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
    is_arsip: false,
    kapasitas_siswa: 30,
  },
  
]

const initialSiswaData: Siswa[] = [
  {
    id: 1,
    nis: "12345",
    nama: "Ahmad Fauzi",
    jenisKelamin: "Laki-laki",
    status: "Aktif",
    kelas_id: 1,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  {
    id: 2,
    nis: "12346",
    nama: "Siti Nurhaliza",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 1,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  {
    id: 3,
    nis: "12347",
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    status: "Nonaktif",
    kelas_id: 1,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  {
    id: 4,
    nis: "12348",
    nama: "Dewi Anggraini",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 2,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  {
    id: 5,
    nis: "12349",
    nama: "Eko Prasetyo",
    jenisKelamin: "Laki-laki",
    status: "Aktif",
    kelas_id: 3,
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
  },
  {
    id: 6,
    nis: "12350",
    nama: "Fitri Lestari",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 4,
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
  },
  {
    id: 7,
    nis: "12351",
    nama: "Gita Permata",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 5,
    angkatan: 2022,
    created_at: "2022-07-01T08:00:00Z",
    updated_at: "2022-07-01T08:00:00Z",
    is_lulus: true,
  },
  {
    id: 8,
    nis: "12352",
    nama: "Heri Wijaya",
    jenisKelamin: "Laki-laki",
    status: "Aktif",
    kelas_id: 6,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  {
    id: 9,
    nis: "12353",
    nama: "Intan Sari",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 7,
    angkatan: 2023,
    created_at: "2023-07-01T08:00:00Z",
    updated_at: "2023-07-01T08:00:00Z",
  },
  {
    id: 10,
    nis: "12354",
    nama: "Joko Susilo",
    jenisKelamin: "Laki-laki",
    status: "Aktif",
    kelas_id: 8,
    angkatan: 2022,
    created_at: "2022-07-01T08:00:00Z",
    updated_at: "2022-07-01T08:00:00Z",
  },
  {
    id: 11,
    nis: "12355",
    nama: "Kartika Putri",
    jenisKelamin: "Perempuan",
    status: "Aktif",
    kelas_id: 9,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
  // siswa tanpa kelas
  {
    id: 12,
    nis: "12356",
    nama: "Lukman Hakim",
    jenisKelamin: "Laki-laki",
    status: "Aktif",
    kelas_id: null,
    angkatan: 2024,
    created_at: "2024-07-01T08:00:00Z",
    updated_at: "2024-07-01T08:00:00Z",
  },
]

// Ensures lulusan flag consistent with XII
const sanitizedInitialSiswaData: Siswa[] = initialSiswaData.map((s) => {
  const k = initialKelasData.find((kk) => kk.id === s.kelas_id)
  if (!k || k.kelas_tingkat !== "XII") return { ...s, is_lulus: false }
  return s
})

// Temporary id generator for local-only items (negative numbers)
let __tempIdCounter = -1
const nextTempId = () => __tempIdCounter--

// Small components moved to `src/app/components/TahunAjaran`

// =========================
// Main Page
// =========================
export default function TahunAjaranPage() {
  // Core state
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [siswaList, setSiswaList] = useState<Siswa[]>([])
  const [jurusanList, setJurusanList] = useState<Jurusan[]>(initialJurusanData)
  const [guruList, setGuruList] = useState(initialGuruData)

  // Filters (merged)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAngkatan, setFilterAngkatan] = useState<string>("")
  const [filterJurusan, setFilterJurusan] = useState<string>("")
  const [filterArsip, setFilterArsip] = useState<boolean>(false)

  // Tabs (utama)
  const [activeTab, setActiveTab] = useState<"X" | "XI" | "XII" | "Lulusan">("X")

  // Sorting & Selection (utama)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Kelas; direction: "asc" | "desc" } | null>({ key: 'name_kelas' as keyof Kelas, direction: 'asc' })
  const [selectedKelasIds, setSelectedKelasIds] = useState<number[]>([])

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editSiswaModalOpen, setEditSiswaModalOpen] = useState(false)
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null)
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [addSiswaModalOpen, setAddSiswaModalOpen] = useState(false)
  const [addTargetKelasId, setAddTargetKelasId] = useState<number | null>(null)
  const [addSelectedSiswaIds, setAddSelectedSiswaIds] = useState<number[]>([])
  const [addSearch, setAddSearch] = useState("")

  // Forms
  const [newKelas, setNewKelas] = useState<Omit<Kelas, "id" | "created_at" | "updated_at">>({
    name_kelas: "",
    jurusan_id: 0,
    kelas_tingkat: "X",
    wali_kelas_id: 0,
    deskripsi: "",
    angkatan: new Date().getFullYear(),
    is_arsip: false,
    kapasitas_siswa: 30,
  })

  // Simulation/Planning (combine)
  const [modeSimulasi, setModeSimulasi] = useState(false)
  const [kelasSimulasi, setKelasSimulasi] = useState<Kelas[]>(initialKelasData)
  const [siswaSimulasi, setSiswaSimulasi] = useState<Siswa[]>(sanitizedInitialSiswaData)
  const [previewData, setPreviewData] = useState<Array<{ old: Kelas; new: Kelas; siswa: Siswa[] }>>([])

  // Logs (both)
  const [logActivity, setLogActivity] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toISOString(), message: "Halaman Tahun Ajaran dimuat.", type: "info" },
  ])
  const [showLog, setShowLog] = useState(false)

  // Drag & Drop
  const [draggedSiswa, setDraggedSiswa] = useState<Siswa | null>(null)
  const [dragOverKelasId, setDragOverKelasId] = useState<number | null>(null)

  // Detail filters
  const [filterDetailStatus, setFilterDetailStatus] = useState<string>("")
  const [filterDetailJK, setFilterDetailJK] = useState<string>("")

  // Helpers
  const getJurusan = (id: number) => jurusanList.find((j) => j.id === id)
  const getJurusanName = (id: number) => getJurusan(id)?.nama_jurusan || "Tidak Diketahui"
  const getJurusanCode = (id: number) => getJurusan(id)?.kode_jurusan || "N/A"
  const getGuruName = (id: number) => guruList.find((g) => g.id === id)?.nama || "Tidak Diketahui"

  const useKelas = modeSimulasi ? kelasSimulasi : kelasList
  const useSiswa = modeSimulasi ? siswaSimulasi : siswaList
  const setKelas = modeSimulasi ? setKelasSimulasi : setKelasList
  const setSiswa = modeSimulasi ? setSiswaSimulasi : setSiswaList

  const getSiswaByKelasId = (kelasId: number) => useSiswa.filter((s) => s.kelas_id === kelasId)

  // Fetch helpers
  const fetchKelas = async () => {
    try {
      const res = await fetch("/api/tahun-ajaran/kelas")
      const data = await res.json()
      if (Array.isArray(data)) setKelasList(data)
      else console.error("Invalid kelas response", data)
    } catch (err) {
      console.error("fetchKelas", err)
      // fallback to initial data
      setKelasList(initialKelasData)
    }
  }

  const fetchSiswa = async () => {
    try {
      const res = await fetch("/api/tahun-ajaran/siswa")
      const data = await res.json()
      if (Array.isArray(data)) setSiswaList(data)
      else console.error("Invalid siswa response", data)
    } catch (err) {
      console.error("fetchSiswa", err)
      setSiswaList(sanitizedInitialSiswaData)
    }
  }

  useEffect(() => {
    fetchKelas()
    fetchSiswa()
    // fetch guru users for wali kelas dropdown
    fetch('/api/users/guru')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // normalize to { id, nama }
          const mapped = data.map((g: any) => ({ id: g.id, nama: g.nama_lengkap || g.nama || g.username || `Guru ${g.id}` }))
          setGuruList(mapped)
        }
      })
      .catch(err => console.error('fetch guru', err))
    // fetch jurusan options from the server so IDs match the database
    fetch('/api/options/jurusan')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: Jurusan[] = data.map((j: any) => ({
            id: j.id,
            nama_jurusan: j.jurusan,
            kode_jurusan: (j.jurusan || '')
              .split(/\s+/)
              .map((w: string) => w.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 4),
            warna: '#3b82f6',
            warnaGelap: '#60a5fa',
            icon: '📚',
          }))
          setJurusanList(mapped)
        }
      })
      .catch((err) => console.error('fetch jurusan options', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addLogEntry = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = { id: Date.now(), timestamp: new Date().toISOString(), message, type }
    setLogActivity((prev) => [newLog, ...prev.slice(0, 49)])
  }

  // Filtered Kelas by Tab + Filters
  const filteredKelasByTab = useMemo(() => {
    let list = [...useKelas].filter(
      (k) =>
        (k.name_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
          k.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterAngkatan === "" || k.angkatan.toString() === filterAngkatan) &&
        (filterJurusan === "" || k.jurusan_id.toString() === filterJurusan) &&
        (!filterArsip || k.is_arsip === true),
    )

    if (activeTab === "Lulusan") {
      list = list.filter((k) => {
        if (k.kelas_tingkat !== "XII") return false
        const siswaDiKelas = getSiswaByKelasId(k.id)
        return siswaDiKelas.length > 0 && siswaDiKelas.every((s) => s.status !== "Aktif" || s.is_lulus === true)
      })
    } else {
      list = list.filter((k) => k.kelas_tingkat === activeTab)
    }

    if (sortConfig !== null) {
      list.sort((a, b) => {
        // @ts-ignore
        const va = a[sortConfig.key]
        // @ts-ignore
        const vb = b[sortConfig.key]

        let cmp = 0
        if (typeof va === "number" && typeof vb === "number") {
          cmp = va - vb
        } else {
          const sa = (va ?? "").toString().toLowerCase()
          const sb = (vb ?? "").toString().toLowerCase()
          cmp = sa.localeCompare(sb)
        }
        return sortConfig.direction === "asc" ? cmp : -cmp
      })
    }
    return list
  }, [useKelas, activeTab, searchTerm, filterAngkatan, filterJurusan, filterArsip, sortConfig, useSiswa])

  // Stats
  const stats = useMemo(() => {
    const totalKelas = filteredKelasByTab.length
    let totalSiswa = 0
    let lulusanCount = 0
    useSiswa.forEach((s) => {
      if (s.kelas_id && filteredKelasByTab.some((k) => k.id === s.kelas_id)) {
        totalSiswa++
        if (s.is_lulus === true || s.status === "Lulus" || s.status === "Nonaktif") lulusanCount++
      }
    })
    const siswaTanpaKelas = useSiswa.filter((s) => s.kelas_id === null).length
    return { totalKelas, totalSiswa, lulusanCount, siswaTanpaKelas }
  }, [filteredKelasByTab, useSiswa])

  // Utilities for promotion
  const tingkatBerikutnya = (t: "X" | "XI" | "XII") => (t === "X" ? "XI" : t === "XI" ? "XII" : null)
  const gantiTingkatDiNama = (name: string, tingkatBaru: "X" | "XI" | "XII") => name.replace(/^(X|XI|XII)/, tingkatBaru)

  // Create/find target class, can create new based on jurusan code if needed
  const findAtauBuatKelasTarget = (
    sumber: Kelas,
    tingkatBaru: "XI" | "XII",
    listKelas: Kelas[],
    mutateList: (updater: (prev: Kelas[]) => Kelas[]) => void,
  ): Kelas => {
    const namaTarget = gantiTingkatDiNama(sumber.name_kelas, tingkatBaru)
    let target = listKelas.find(
      (k) => k.jurusan_id === sumber.jurusan_id && k.kelas_tingkat === tingkatBaru && k.name_kelas === namaTarget,
    )

      if (!target) {
      const jurCode = getJurusanCode(sumber.jurusan_id)
      const existingCount = listKelas.filter(
        (k) => k.kelas_tingkat === tingkatBaru && k.jurusan_id === sumber.jurusan_id,
      ).length
      const nameByCode = `${tingkatBaru} ${jurCode} ${existingCount + 1}`
      const baru: Kelas = {
        id: nextTempId(),
        name_kelas: nameByCode,
        jurusan_id: sumber.jurusan_id,
        kelas_tingkat: tingkatBaru,
        wali_kelas_id: sumber.wali_kelas_id,
        deskripsi: `Kelas ${tingkatBaru} ${getJurusanName(sumber.jurusan_id)} - hasil kenaikan`,
        angkatan: sumber.angkatan + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_arsip: false,
        kapasitas_siswa: sumber.kapasitas_siswa,
      }
      mutateList((prev) => [...prev, baru])
      target = baru
      addLogEntry(`Kelas baru ${baru.name_kelas} dibuat untuk hasil kenaikan.`, "info")
    }
    return target
  }

  const hitungPreviewKenaikan = (kelasData: Kelas[], siswaData: Siswa[]) => {
    const preview: { old: Kelas; new: Kelas; siswa: Siswa[] }[] = []
    kelasData.forEach((kls) => {
      const next = tingkatBerikutnya(kls.kelas_tingkat)
      const siswaAktif = siswaData.filter((s) => s.kelas_id === kls.id && s.status === "Aktif" && s.is_lulus !== true)

      if (kls.kelas_tingkat === "XII") {
        if (siswaAktif.length > 0) {
          preview.push({
            old: kls,
            new: {
              ...kls,
              name_kelas: "LULUS",
              is_arsip: true,
              updated_at: new Date().toISOString(),
              kapasitas_siswa: kls.kapasitas_siswa,
            },
            siswa: siswaAktif,
          })
        }
      } else if (next === "XI" || next === "XII") {
        if (siswaAktif.length > 0) {
          const namaBaru = gantiTingkatDiNama(kls.name_kelas, next)
          preview.push({
            old: kls,
            new: {
              ...kls,
              name_kelas: namaBaru,
              kelas_tingkat: next,
              updated_at: new Date().toISOString(),
              kapasitas_siswa: kls.kapasitas_siswa,
            },
            siswa: siswaAktif,
          })
        }
      }
    })
    return preview
  }

  // Handlers: Kelas form
  const handleSubmitKelas = (e: React.FormEvent) => {
    e.preventDefault()
    const result = KelasSchema.safeParse(newKelas)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }
    const now = new Date().toISOString()
    if (modeSimulasi) {
      // In simulation mode, do NOT call the API — modify local simulated state only
      if (!selectedKelas) {
        const newObj: Kelas = {
          id: Date.now(),
          ...newKelas,
          created_at: now,
          updated_at: now,
        }
        setKelas((prev) => [...prev, newObj])
        addLogEntry(`(Simulasi) Kelas "${newObj.name_kelas}" ditambahkan.`, "info")
        toast.success(`(Simulasi) Kelas "${newObj.name_kelas}" ditambahkan`)
      } else {
        const merged = { ...selectedKelas, ...newKelas, updated_at: now }
        setKelas((prev) => prev.map((k) => (k.id === merged.id ? merged : k)))
        addLogEntry(`(Simulasi) Kelas "${merged.name_kelas}" diperbarui.`, "info")
        toast.success(`(Simulasi) Kelas "${merged.name_kelas}" diperbarui`)
      }
    } else {
      if (!selectedKelas) {
        // create via API
        fetch("/api/tahun-ajaran/kelas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newKelas),
        })
          .then((r) => r.json())
          .then((created) => {
            if (created?.id) {
              const newObj: Kelas = { id: created.id, ...newKelas, created_at: now, updated_at: now }
              setKelas((prev) => [...prev, newObj])
              addLogEntry(`Kelas "${newObj.name_kelas}" ditambahkan.`, "success")
              toast.success(`Kelas "${newObj.name_kelas}" berhasil ditambahkan`)
            } else {
              toast.error(created?.error || "Gagal menambahkan kelas")
            }
          })
          .catch((err) => {
            console.error(err)
            toast.error("Gagal menambahkan kelas")
          })
      } else {
        // update via API
        fetch("/api/tahun-ajaran/kelas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedKelas.id, ...newKelas }),
        })
          .then((r) => r.json())
          .then((updated) => {
            if (updated?.id) {
              const merged = { ...selectedKelas, ...newKelas, updated_at: now }
              setKelas((prev) => prev.map((k) => (k.id === merged.id ? merged : k)))
              addLogEntry(`Kelas "${merged.name_kelas}" diperbarui.`, "success")
              toast.success(`Kelas "${merged.name_kelas}" berhasil diperbarui`)
            } else {
              toast.error(updated?.error || "Gagal memperbarui kelas")
            }
          })
          .catch((err) => {
            console.error(err)
            toast.error("Gagal memperbarui kelas")
          })
      }
    }
    setNewKelas({
      name_kelas: "",
      jurusan_id: 0,
      kelas_tingkat: "X",
      wali_kelas_id: 0,
      deskripsi: "",
      angkatan: new Date().getFullYear(),
      is_arsip: false,
      kapasitas_siswa: 30,
    })
    setSelectedKelas(null)
    setModalOpen(false)
  }

  const handleEditKelas = (kelas: Kelas) => {
    setSelectedKelas(kelas)
    setNewKelas({
      name_kelas: kelas.name_kelas,
      jurusan_id: kelas.jurusan_id,
      kelas_tingkat: kelas.kelas_tingkat,
      wali_kelas_id: kelas.wali_kelas_id,
      deskripsi: kelas.deskripsi || "",
      angkatan: kelas.angkatan,
      is_arsip: kelas.is_arsip ?? false,
      kapasitas_siswa: kelas.kapasitas_siswa,
    })
    setModalOpen(true)
  }

  const handleDeleteKelas = (id: number) => {
    if (!confirm("Yakin ingin menghapus kelas ini beserta semua siswa di dalamnya?")) return
    // If simulation mode is active, only modify the simulated state and do NOT call the API
    if (modeSimulasi) {
      setKelas((prev) => prev.filter((k) => k.id !== id))
      setSiswa((prev) => prev.filter((s) => s.kelas_id !== id))
      addLogEntry("Kelas dihapus dalam Mode Simulasi (tidak mengubah database).", "warning")
      toast.success("Kelas dihapus (simulasi)")
      return
    }

    // If id looks like a local timestamp (very large), delete locally without calling API
    if (id > 2147483647) {
      setKelas((prev) => prev.filter((k) => k.id !== id))
      setSiswa((prev) => prev.filter((s) => s.kelas_id !== id))
      addLogEntry("Kelas lokal dihapus (belum disimpan ke DB).", "warning")
      toast.success("Kelas lokal berhasil dihapus")
      return
    }

    fetch(`/api/tahun-ajaran/kelas?id=${id}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) {
          setKelas((prev) => prev.filter((k) => k.id !== id))
          setSiswa((prev) => prev.filter((s) => s.kelas_id !== id))
          addLogEntry("Kelas dan siswa di dalamnya dihapus.", "warning")
          toast.success("Kelas berhasil dihapus")
        } else {
          toast.error(res?.error || "Gagal menghapus kelas")
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Gagal menghapus kelas")
      })
  }

  // Handlers: Siswa
  const handleEditSiswa = (siswa: Siswa) => {
    setSelectedSiswa(siswa)
    setEditSiswaModalOpen(true)
  }

  const handleUpdateSiswa = () => {
    if (!selectedSiswa) return
    const result = SiswaSchema.safeParse(selectedSiswa)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }
    const upd = {
      ...selectedSiswa,
      updated_at: new Date().toISOString(),
      is_lulus: selectedSiswa.status === "Lulus" ? true : selectedSiswa.is_lulus,
    }
    // call API
    fetch("/api/tahun-ajaran/siswa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nis: selectedSiswa.nis, nama: selectedSiswa.nama, jenisKelamin: selectedSiswa.jenisKelamin, status: selectedSiswa.status, kelas_id: selectedSiswa.kelas_id }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.nis) {
          setSiswa((prev) => prev.map((s) => (s.nis === res.nis ? { ...s, ...selectedSiswa, updated_at: new Date().toISOString() } : s)))
          addLogEntry(`Data siswa "${selectedSiswa.nama}" diperbarui.`, "success")
          setEditSiswaModalOpen(false)
          setSelectedSiswa(null)
          toast.success("Siswa berhasil diperbarui")
        } else {
          toast.error(res?.error || "Gagal memperbarui siswa")
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Gagal memperbarui siswa")
      })
  }

  const handleDeleteSiswa = (id: number) => {
    if (!confirm("Yakin ingin menghapus siswa ini?")) return
    // find nis by numeric id
    const s = useSiswa.find((x) => x.id === id)
    const nis = s?.nis
    if (!nis) {
      // fallback: remove by numeric id
      setSiswa((prev) => prev.filter((x) => x.id !== id))
      addLogEntry(`Siswa "${s?.nama || "-"}" dihapus.`, "warning")
      toast.success("Siswa berhasil dihapus")
      return
    }
    fetch(`/api/tahun-ajaran/siswa?nis=${nis}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) {
          setSiswa((prev) => prev.filter((x) => x.nis !== nis))
          addLogEntry(`Siswa "${s?.nama || "-"}" dihapus.`, "warning")
          toast.success("Siswa berhasil dihapus")
        } else {
          toast.error(res?.error || "Gagal menghapus siswa")
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Gagal menghapus siswa")
      })
  }

  // Capacity helpers
  const isKelasFull = (kelasId: number) => {
    const kelas = useKelas.find((k) => k.id === kelasId)
    if (!kelas) return false
    return getSiswaByKelasId(kelasId).length >= kelas.kapasitas_siswa
  }

  // Add siswa to kelas with capacity and "no class first"
  const handleAddSiswaToKelas = (kelasId: number) => {
    setAddTargetKelasId(kelasId)
    setAddSelectedSiswaIds([])
    setAddSearch("")
    setAddSiswaModalOpen(true)
  }

  const confirmAddSiswaToKelas = () => {
    if (addTargetKelasId == null) return

    const kelas = useKelas.find((k) => k.id === addTargetKelasId)
    if (!kelas) return

    const currentCount = getSiswaByKelasId(addTargetKelasId).length
    const capacityLeft = kelas.kapasitas_siswa - currentCount

    if (capacityLeft <= 0) {
      toast.error(`Kelas ${kelas.name_kelas} sudah penuh (kapasitas: ${kelas.kapasitas_siswa}).`)
      return
    }

    if (addSelectedSiswaIds.length === 0) {
      toast.error("Pilih minimal satu siswa untuk ditambahkan.")
      return
    }

    const toAssign = addSelectedSiswaIds.slice(0, capacityLeft)
    const overflow = addSelectedSiswaIds.length - toAssign.length

    // call API per student (could be optimized server-side)
    Promise.all(
      toAssign.map((sid) => {
        const s = useSiswa.find((x) => x.id === sid)
        if (!s) return Promise.resolve(null)
        return fetch("/api/tahun-ajaran/siswa", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nis: s.nis, kelas_id: addTargetKelasId }),
        }).then((r) => r.json())
      }),
    ).then((results) => {
      setSiswa((prev) => prev.map((s) => (toAssign.includes(s.id) ? { ...s, kelas_id: addTargetKelasId, updated_at: new Date().toISOString() } : s)))
    })

    addLogEntry(
      `Menambahkan ${toAssign.length} siswa ke kelas "${kelas.name_kelas}"${overflow > 0 ? ` (${overflow} tidak ditambahkan karena kapasitas penuh)` : ""}.`,
      "success",
    )
    toast.success(
      `${toAssign.length} siswa ditambahkan ke ${kelas.name_kelas}${overflow > 0 ? `, ${overflow} tidak cukup kapasitas` : ""}`,
    )

    setAddSiswaModalOpen(false)
    setAddTargetKelasId(null)
    setAddSelectedSiswaIds([])
    setAddSearch("")
  }

  // Move siswa with capacity
  const handleMoveSiswa = (siswaId: number, targetKelasId: number) => {
    const target = useKelas.find((k) => k.id === targetKelasId)
    const siswa = useSiswa.find((s) => s.id === siswaId)
    if (!target || !siswa) return

    if (isKelasFull(targetKelasId)) {
      toast.error(`Kelas ${target.name_kelas} sudah penuh.`)
      return
    }
    // update DB
    fetch("/api/tahun-ajaran/siswa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nis: siswa.nis, kelas_id: targetKelasId }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.nis) {
          setSiswa((prev) => prev.map((s) => (s.id === siswaId ? { ...s, kelas_id: targetKelasId, updated_at: new Date().toISOString() } : s)))
          addLogEntry(`Siswa "${siswa.nama}" dipindahkan ke "${target.name_kelas}".`, "success")
          toast.success("Siswa dipindahkan")
        } else {
          toast.error(res?.error || "Gagal memindahkan siswa")
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Gagal memindahkan siswa")
      })
  }

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, siswa: Siswa) => {
    setDraggedSiswa(siswa)
    e.dataTransfer.effectAllowed = "move"
    // </CHANGE> Tambahkan data untuk kompatibilitas DnD
    e.dataTransfer.setData("text/plain", String(siswa.id))
    // optional drag image for UX parity
    const div = document.createElement("div")
    div.innerHTML = `<div style="background: rgba(0,0,0,0.6); color: white; padding: 6px 8px; border-radius: 6px; font-size: 12px;">${siswa.nama}</div>`
    div.style.position = "absolute"
    div.style.top = "-1000px"
    document.body.appendChild(div)
    e.dataTransfer.setDragImage(div, 0, 0)
    setTimeout(() => document.body.removeChild(div), 0)
  }
  const handleDragOver = (e: React.DragEvent, kelasId: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverKelasId(kelasId)
  }
  // </CHANGE> Pisahkan dragLeave agar tidak menghapus draggedSiswa saat masih dragging
  const handleDragLeave = () => {
    setDragOverKelasId(null)
  }
  const handleDragEnd = () => {
    setDraggedSiswa(null)
    setDragOverKelasId(null)
  }

  const handleDragEnter = (e: React.DragEvent, kelasId: number) => {
    e.preventDefault()
    setDragOverKelasId(kelasId)
  }

  const handleDrop = (e: React.DragEvent, targetKelasId: number) => {
    e.preventDefault()
    e.stopPropagation()

    // Ambil id siswa dari dataTransfer jika state belum ada (robust di berbagai browser)
    const dataId = Number(e.dataTransfer.getData("text/plain"))
    const siswaId = draggedSiswa?.id ?? (Number.isFinite(dataId) ? dataId : null)

    if (!siswaId) {
      setDragOverKelasId(null)
      return
    }

    // Jika target sama dengan asal, jangan pindahkan
    const asalKelasId = draggedSiswa?.kelas_id ?? useSiswa.find((s) => s.id === siswaId)?.kelas_id ?? null
    if (asalKelasId === targetKelasId) {
      setDragOverKelasId(null)
      setDraggedSiswa(null) // reset agar tidak perlu drag 2x
      return
    }

    handleMoveSiswa(siswaId, targetKelasId)
    setDragOverKelasId(null)
    setDraggedSiswa(null) // pastikan state selesai agar 1x drag langsung sukses
  }

  // Promotion engine (merged logic: archive XII + create next classes if needed + move active students)
  const [promoteInProgress, setPromoteInProgress] = useState(false)

  const processPromotion = async (classesToPromote: Kelas[]) => {
    let kelasMut = [...useKelas]
    let siswaMut = [...useSiswa]

    const setKelasMut = (updater: (prev: Kelas[]) => Kelas[]) => {
      kelasMut = updater(kelasMut)
    }

    // Archive XII -> mark students as graduated (Nonaktif + is_lulus)
    classesToPromote
      .filter((k) => k.kelas_tingkat === "XII" && !k.is_arsip)
      .forEach((k) => {
        const idx = kelasMut.findIndex((kk) => kk.id === k.id)
        if (idx >= 0) kelasMut[idx] = { ...kelasMut[idx], is_arsip: true, updated_at: new Date().toISOString() }
        const siswaAktif = siswaMut.filter((s) => s.kelas_id === k.id && s.status === "Aktif")
        siswaMut = siswaMut.map((s) =>
          siswaAktif.some((ss) => ss.id === s.id)
            ? { ...s, status: "Nonaktif", is_lulus: true, updated_at: new Date().toISOString() }
            : s,
        )
        addLogEntry(`Kelas ${k.name_kelas} diarsipkan dan ${siswaAktif.length} siswa diluluskan.`, "success")
      })

    // Promote X->XI and XI->XII
    ;(["X", "XI"] as const).forEach((from, i) => {
      const to = (i === 0 ? "XI" : "XII") as "XI" | "XII"
      classesToPromote
        .filter((k) => k.kelas_tingkat === from && !k.is_arsip)
        .forEach((k) => {
          const siswaAktif = siswaMut.filter((s) => s.kelas_id === k.id && s.status === "Aktif" && s.is_lulus !== true)
          if (siswaAktif.length === 0) return

          // Find or create a target class. If the chosen target is full, create additional
          // target classes (with the same capacity) until all siswaAktif are accommodated.
          let remaining = siswaAktif.slice()
          const movedCounts: number[] = []

          // helper to compute occupied count for a kelas id in siswaMut
          const occupiedCount = (kelasId: number) => siswaMut.filter((s) => s.kelas_id === kelasId).length

          // loop until all remaining students are processed or we cannot make progress
          while (remaining.length > 0) {
            let targetKelas = findAtauBuatKelasTarget(k, to, kelasMut, setKelasMut)

            // if chosen target has no space, create a new sibling target class to accept overflow
            let kapasitasTersisa = targetKelas.kapasitas_siswa - occupiedCount(targetKelas.id)
            if (kapasitasTersisa <= 0) {
              // create a new target class (unique name by counting existing)
              const jurCode = getJurusanCode(k.jurusan_id)
              const existingCount = kelasMut.filter((kk) => kk.kelas_tingkat === to && kk.jurusan_id === k.jurusan_id).length
              const nameByCode = `${to} ${jurCode} ${existingCount + 1}`
              const baru: Kelas = {
                id: nextTempId(),
                name_kelas: nameByCode,
                jurusan_id: k.jurusan_id,
                kelas_tingkat: to,
                wali_kelas_id: k.wali_kelas_id,
                deskripsi: `Kelas ${to} ${getJurusanName(k.jurusan_id)} - hasil kenaikan`,
                angkatan: k.angkatan + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_arsip: false,
                kapasitas_siswa: k.kapasitas_siswa,
              }
              setKelasMut((prev) => [...prev, baru])
              targetKelas = baru
              kapasitasTersisa = targetKelas.kapasitas_siswa - occupiedCount(targetKelas.id)
            }

            // move as many students as this target can accept
            const take = Math.min(kapasitasTersisa, remaining.length)
            const toMove = remaining.slice(0, take)

            // apply moves to siswaMut
            const movedIds = new Set(toMove.map((m) => m.id))
            siswaMut = siswaMut.map((s) => (movedIds.has(s.id) ? { ...s, kelas_id: targetKelas.id, updated_at: new Date().toISOString() } : s))

            movedCounts.push(toMove.length)

            // remove moved students from remaining
            remaining = remaining.slice(take)

            // After moving, set/update the target class kapasitas_siswa to match the actual
            // number of students now assigned to that class.
            const occupancy = siswaMut.filter((s) => s.kelas_id === targetKelas.id).length
            setKelasMut((prev) => prev.map((kk) => (kk.id === targetKelas.id ? { ...kk, kapasitas_siswa: occupancy } : kk)))

            addLogEntry(
              `Kenaikan ${k.name_kelas} \u2192 ${targetKelas.name_kelas}: ${toMove.length} siswa dipindah.${remaining.length > 0 ? ` ${remaining.length} siswa tersisa dan akan diproses.` : ""}`,
              remaining.length > 0 ? "warning" : "success",
            )

            // loop will continue if remaining > 0 and will create new target classes as needed
          }
        })
    })

    // If in simulation mode, call the server's simulation endpoint to get an authoritative preview
    if (modeSimulasi) {
      try {
        const payload = {
          classes: kelasMut.map((k) => ({ id: k.id, name_kelas: k.name_kelas, jurusan_id: k.jurusan_id, wali_kelas_id: k.wali_kelas_id, kelas_tingkat: k.kelas_tingkat, is_arsip: k.is_arsip, kapasitas_siswa: k.kapasitas_siswa })),
          students: siswaMut.map((s) => ({ nis: s.nis, target_kelas_id: s.kelas_id })),
        }

        const res = await fetch('/api/tahun-ajaran/promote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-mode-simulasi': 'true' },
          body: JSON.stringify(payload),
        })
        const body = await res.json().catch(() => ({}))
        if (res.ok && body?.result) {
          const { simulatedClasses = [], moveSummary = [] } = body.result

          // Map simulatedClasses into Kelas shape used by the UI
          const mappedSimKelas: Kelas[] = simulatedClasses.map((sc: any) => {
            // derive kelas_tingkat from name prefix
            const m = String(sc.name_kelas || sc.kelas || '').match(/^(XII|XI|X)\b/i)
            const tingkat = m ? (m[1].toUpperCase() as 'X' | 'XI' | 'XII') : 'X'
            return {
              id: sc.id,
              name_kelas: sc.name_kelas || sc.kelas || `Kelas ${sc.id}`,
              jurusan_id: Number(sc.jurusan_id) || 0,
              kelas_tingkat: tingkat,
              wali_kelas_id: Number(sc.wali_kelas_id) || 0,
              deskripsi: sc.deskripsi || '',
              angkatan: Number(sc.angkatan) || new Date().getFullYear(),
              created_at: sc.created_at || new Date().toISOString(),
              updated_at: sc.updated_at || new Date().toISOString(),
              is_arsip: !!sc.is_arsip,
              kapasitas_siswa: Number(sc.kapasitas_siswa) || 30,
            }
          })

          // Apply moves to siswaMut using movedNIS lists returned by server
          const siswaAfter = siswaMut.map((s) => {
            for (const ms of moveSummary) {
              if (Array.isArray(ms.movedNIS) && ms.movedNIS.includes(s.nis)) {
                return { ...s, kelas_id: ms.to, updated_at: new Date().toISOString() }
              }
            }
            return s
          })

          // Set the simulated lists
          setKelas(mappedSimKelas)
          setSiswa(siswaAfter)
          toast.success('Proses kenaikan selesai (simulasi server).')
          addLogEntry('Kenaikan (simulasi) dijalankan oleh server dan diterapkan ke preview lokal.', 'info')
          return
        }

        // fallback to client-side simulation if server fails
        setKelas(kelasMut)
        setSiswa(siswaMut)
        toast.error('Simulasi server gagal, menampilkan hasil simulasi lokal.')
      } catch (err) {
        console.error('Simulasi server error', err)
        setKelas(kelasMut)
        setSiswa(siswaMut)
        toast.error('Simulasi gagal, menampilkan hasil lokal.')
      }
      return
    }

    // Persist atomically via server endpoint
    setPromoteInProgress(true)
    try {
      // Build payload: classes and students to update
      // Only send classes that were part of the promotion operation (classesToPromote)
      const classesBeingPromoted = classesToPromote.map((k) => k.id)
      // Build students payload by comparing original assignments (useSiswa)
      // to mutated assignments (siswaMut). This ensures we send students whose
      // ORIGINAL class is part of the promotion and include their NEW target.
      const studentsPayload = siswaMut
        .map((s) => {
          const orig = useSiswa.find((u) => u.nis === s.nis)
          return { orig, curr: s }
        })
        .filter(({ orig }) => orig && classesBeingPromoted.includes(orig.kelas_id as number))
        .map(({ curr }) => ({ nis: curr.nis, target_kelas_id: curr.kelas_id }))

      const payload = {
        classes: kelasMut
          .filter((k) => classesBeingPromoted.includes(k.id) || (k.id <= 0 && classesBeingPromoted.includes(k.id)))
          .map((k) => ({ id: k.id, name_kelas: k.name_kelas, jurusan_id: k.jurusan_id, wali_kelas_id: k.wali_kelas_id, kelas_tingkat: k.kelas_tingkat, is_arsip: k.is_arsip, kapasitas_siswa: k.kapasitas_siswa })),
        students: studentsPayload,
      }

      const res = await fetch('/api/tahun-ajaran/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json()
      if (!res.ok) {
        console.error('Promotion endpoint failed', body)
        toast.error('Penyimpanan kenaikan ke database gagal')
        // still update local state
        setKelas(kelasMut)
        setSiswa(siswaMut)
      } else {
        // Refresh authoritative data
        await fetchKelas()
        await fetchSiswa()
        toast.success('Proses kenaikan selesai dan disimpan ke database.')
      }
    } catch (err) {
      console.error('Error calling atomic promote', err)
      toast.error('Terjadi kesalahan saat menyimpan kenaikan ke server')
      setKelas(kelasMut)
      setSiswa(siswaMut)
    } finally {
      setPromoteInProgress(false)
    }
  }

  const handlePromoteAllClasses = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    processPromotion(useKelas)
  }

  const handlePromoteSelectedClasses = () => {
    if (selectedKelasIds.length === 0) {
      toast.error("Pilih kelas yang ingin dinaikkan terlebih dahulu.")
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    processPromotion(useKelas.filter((k) => selectedKelasIds.includes(k.id)))
    setSelectedKelasIds([])
  }

  const handlePreviewPromotion = () => {
    const pv = hitungPreviewKenaikan(useKelas, useSiswa)
    setPreviewData(pv)
    setShowPreview(true)
    toast.success("Preview kenaikan kelas siap")
  }

  // Simulation mode with save/cancel banner (planning)
  const toggleModeSimulasi = () => {
    if (modeSimulasi) {
      setModeSimulasi(false)
      setKelasSimulasi(initialKelasData)
      setSiswaSimulasi(sanitizedInitialSiswaData)
      toast.success("Mode simulasi dinonaktifkan")
    } else {
      setModeSimulasi(true)
      setKelasSimulasi(kelasList.map((k) => ({ ...k })))
      setSiswaSimulasi(siswaList.map((s) => ({ ...s })))
      toast.success("Mode simulasi diaktifkan")
    }
  }

  const saveSimulasiKeDataUtama = () => {
    if (!modeSimulasi) return
    if (!confirm("Simpan perubahan dari Mode Simulasi ke data utama?")) return
    setKelasList(kelasSimulasi.map((k) => ({ ...k })))
    setSiswaList(siswaSimulasi.map((s) => ({ ...s })))
    setModeSimulasi(false)
    toast.success("Perubahan simulasi disimpan ke data utama.")
    addLogEntry("Perubahan dari mode simulasi disimpan ke data utama.", "success")
  }

  const batalkanSimulasi = () => {
    if (!modeSimulasi) return
    if (!confirm("Batalkan semua perubahan simulasi dan kembalikan seperti sebelum simulasi?")) return
    setKelasSimulasi(initialKelasData)
    setSiswaSimulasi(sanitizedInitialSiswaData)
    setModeSimulasi(false)
    toast.success("Perubahan simulasi dibatalkan.")
    addLogEntry("Perubahan simulasi dibatalkan. Data dikembalikan ke kondisi awal.", "info")
  }

  // Clone & Archive
  // cloneKelas removed — cloning feature disabled

  const toggleArsip = (id: number) => {
    const cur = useKelas.find((k) => k.id === id)?.is_arsip
    setKelas((prev) => prev.map((k) => (k.id === id ? { ...k, is_arsip: !k.is_arsip } : k)))
    toast.success(`Kelas ${!cur ? "diarsipkan" : "dikembalikan ke aktif"}`)
  }

  // Sorting, selection
  const requestSort = (key: keyof Kelas) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc"
    setSortConfig({ key, direction })
  }
  const toggleKelasSelection = (id: number) => {
    setSelectedKelasIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  const toggleSelectAll = () => {
    if (selectedKelasIds.length === filteredKelasByTab.length) setSelectedKelasIds([])
    else setSelectedKelasIds(filteredKelasByTab.map((k) => k.id))
  }
  const handleMassDelete = () => {
    if (selectedKelasIds.length === 0) {
      toast.error("Pilih kelas terlebih dahulu")
      return
    }
    if (!confirm(`Yakin ingin menghapus ${selectedKelasIds.length} kelas dan semua siswanya?`)) return
    // If simulation mode is active, perform only local deletion
    if (modeSimulasi) {
      setKelas((prev) => prev.filter((k) => !selectedKelasIds.includes(k.id)))
      setSiswa((prev) => prev.filter((s) => !selectedKelasIds.includes(s.kelas_id || -1)))
      setSelectedKelasIds([])
      toast.success("Kelas terpilih dihapus (simulasi)")
      addLogEntry("Kelas terpilih dihapus (simulasi).", "warning")
      return
    }

    // Partition selected IDs into server-side (positive) ids and local temp ids (negative)
    const serverIds = selectedKelasIds.filter((id) => id > 0)
    const localIds = selectedKelasIds.filter((id) => id <= 0)

    // Remove local ones immediately
    if (localIds.length > 0) {
      setKelas((prev) => prev.filter((k) => !localIds.includes(k.id)))
      setSiswa((prev) => prev.filter((s) => !localIds.includes(s.kelas_id || -1)))
    }

    if (serverIds.length === 0) {
      setSelectedKelasIds([])
      toast.success("Kelas terpilih berhasil dihapus")
      addLogEntry("Kelas terpilih dihapus (lokal).", "warning")
      return
    }

    // Call the DELETE API for server-side ids
    Promise.all(
      serverIds.map((id) =>
        fetch(`/api/tahun-ajaran/kelas?id=${id}`, { method: 'DELETE' }).then(async (r) => {
          const j = await r.json().catch(() => ({}))
          return { id, ok: r.ok, body: j }
        }),
      ),
    )
      .then((results) => {
        const failed = results.filter((r) => !r.ok)
        // Remove successful ones from UI
        const succeeded = results.filter((r) => r.ok).map((r) => r.id)
        if (succeeded.length > 0) {
          setKelas((prev) => prev.filter((k) => !succeeded.includes(k.id)))
          setSiswa((prev) => prev.filter((s) => !succeeded.includes(s.kelas_id || -1)))
        }
        setSelectedKelasIds([])

        if (failed.length > 0) {
          console.error('Failed to delete some kelas', failed)
          toast.error(`Gagal menghapus ${failed.length} kelas. Lihat console/server logs.`)
          addLogEntry(`${failed.length} kelas gagal dihapus.`, 'error')
        } else {
          toast.success('Kelas terpilih berhasil dihapus')
          addLogEntry('Kelas terpilih dihapus.', 'warning')
        }
      })
      .catch((err) => {
        console.error('Mass delete error', err)
        toast.error('Terjadi kesalahan saat menghapus kelas')
      })
  }

  // Export CSV
  const exportToCSV = (kelasId: number) => {
    const kelas = useKelas.find((k) => k.id === kelasId)
    if (!kelas) return
    const siswa = getSiswaByKelasId(kelasId)
    if (siswa.length === 0) {
      toast.error("Tidak ada siswa untuk diekspor.")
      return
    }
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["NIS", "Nama", "Jenis Kelamin", "Status", "Angkatan"].join(","),
        ...siswa.map((s) => [s.nis, s.nama, s.jenisKelamin, s.status, s.angkatan].join(",")),
      ].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `siswa_kelas_${kelas.name_kelas.replace(/\s+/g, "_")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addLogEntry(`Data siswa kelas "${kelas.name_kelas}" diekspor ke CSV.`, "info")
    toast.success(`Data siswa ${kelas.name_kelas} diekspor`)
  }

  // UI helpers
  const filteredDetailSiswa = useMemo(() => {
    if (!selectedKelas) return []
    let result = getSiswaByKelasId(selectedKelas.id)
    if (filterDetailStatus) result = result.filter((s) => s.status === (filterDetailStatus as SiswaStatus))
    if (filterDetailJK) result = result.filter((s) => s.jenisKelamin === (filterDetailJK as Siswa["jenisKelamin"]))
    return result
  }, [selectedKelas, filterDetailStatus, filterDetailJK, useSiswa])

  // Filtered siswa for the "Add Siswa to Kelas" modal
  const availableSiswaForAdd = useMemo(() => {
    return useSiswa.filter(
      (siswa) =>
        siswa.kelas_id === null && // Only students without a class
        siswa.status === "Aktif" && // Only active students
        (siswa.nis.toLowerCase().includes(addSearch.toLowerCase()) ||
          siswa.nama.toLowerCase().includes(addSearch.toLowerCase())),
    )
  }, [useSiswa, addSearch])

  // Kelas Card
  const KelasCard = ({ kelas }: { kelas: Kelas }) => {
    const siswaDiKelas = getSiswaByKelasId(kelas.id)
    const jurusan = getJurusan(kelas.jurusan_id)
    const waliKelasName = getGuruName(kelas.wali_kelas_id)
    const isXII = kelas.kelas_tingkat === "XII"
    const isLulusanClass =
      siswaDiKelas.length > 0 && siswaDiKelas.every((s) => s.status !== "Aktif" || s.is_lulus === true)
    const progress = Math.min(100, (siswaDiKelas.length / kelas.kapasitas_siswa) * 100)

    return (
      <div
        className={`bg-gradient-to-br from-white to-gray-100 dark:from-[#1e293b] dark:to-[#27354d] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${kelas.is_arsip ? "opacity-60" : ""} ${dragOverKelasId === kelas.id ? "ring-4 ring-blue-500 dark:ring-blue-400" : ""}`}
        onDragEnter={(e) => handleDragEnter(e, kelas.id)} // baru
        onDragOver={(e) => handleDragOver(e, kelas.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, kelas.id)}
      >
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: `${jurusan?.warna}11` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <div className="text-2xl">{jurusan?.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{kelas.name_kelas}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getJurusanName(kelas.jurusan_id)} ({kelas.angkatan})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedKelasIds.includes(kelas.id)}
                onChange={() => toggleKelasSelection(kelas.id)}
                className="w-4 h-4"
              />
              {kelas.is_arsip && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                  Arsip
                </span>
              )}
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded">
                Jumlah Siswa: {siswaDiKelas.length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Jumlah Siswa */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Jumlah Siswa: {siswaDiKelas.length}</span>
            </div>
          </div>

          {/* Info */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Wali Kelas</span>
              <span className="text-xs text-gray-900 dark:text-white">{waliKelasName}</span>
            </div>
            {isLulusanClass ? (
              <div className="mt-2 flex items-center justify-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full text-xs">
                <GraduationCap size={12} /> Kelas Lulusan
              </div>
            ) : isXII ? (
              <div className="mt-2 flex items-center justify-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs">
                <UserCheck size={12} /> Kelas Aktif
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setAddTargetKelasId(kelas.id)
                setAddSiswaModalOpen(true)
              }}
              className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded transition-colors"
            >
              <UserPlus size={14} /> Tambah Siswa
            </button>
            <button
              onClick={() => exportToCSV(kelas.id)}
              className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded transition-colors"
            >
              <Download size={14} /> Ekspor
            </button>
            <button
              onClick={() => {
                setSelectedKelas(kelas)
                setDetailModalOpen(true)
              }}
              className="flex items-center gap-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1.5 rounded transition-colors"
            >
              <Info size={14} /> Detail
            </button>
            {/* Cloning removed */}
            <button
              onClick={() => toggleArsip(kelas.id)}
              className="flex items-center gap-1 text-xs bg-amber-200/80 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 px-2 py-1.5 rounded transition-colors"
              aria-label={kelas.is_arsip ? "Batalkan Arsip" : "Arsipkan Kelas"}
            >
              <Archive size={14} /> {kelas.is_arsip ? "Batal Arsip" : "Arsipkan"}
            </button>
            <button
              onClick={() => handleEditKelas(kelas)}
              className="flex items-center gap-1 text-xs bg-blue-200/70 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-200 px-2 py-1.5 rounded transition-colors"
            >
              <Edit size={14} /> Edit Kelas
            </button>
            <button
              onClick={() => handleDeleteKelas(kelas.id)}
              className="flex items-center gap-1 text-xs bg-red-200/70 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-red-900 dark:text-red-200 px-2 py-1.5 rounded transition-colors"
            >
              <Trash2 size={14} /> Hapus Kelas
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
      <Toaster position="top-right" />
      {promoteInProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-900 dark:text-gray-100">Sedang memproses kenaikan... Mohon tunggu.</p>
          </div>
        </div>
      )}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold">Manajemen Tahun Ajaran</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Atur kenaikan kelas, kapasitas, tambah kelas/siswa, dan kelola data secara menyeluruh.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={toggleModeSimulasi}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95 ${modeSimulasi ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}
            >
              {modeSimulasi ? <RotateCcw size={18} /> : <RotateCw size={18} />}
              {modeSimulasi ? "Mode Simulasi Aktif" : "Aktifkan Simulasi"}
            </button>
            <button
              onClick={() => {
                setSelectedKelas(null)
                setNewKelas({
                  name_kelas: "",
                  jurusan_id: 0,
                  kelas_tingkat: "X",
                  wali_kelas_id: 0,
                  deskripsi: "",
                  angkatan: new Date().getFullYear(),
                  is_arsip: false,
                  kapasitas_siswa: 30,
                })
                setModalOpen(true)
              }}
              className="flex items-center justify-center sm:justify-start gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
            >
              <PlusCircle size={18} /> Tambah Kelas
            </button>
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center sm:justify-start gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
            >
              Kembali
            </Link>
          </div>
        </div>

        {/* Simulation banner with Save/Cancel */}
        {modeSimulasi && (
          <div className="mb-6 p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                Mode Simulasi aktif. Perubahan belum tersimpan ke data utama.
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={saveSimulasiKeDataUtama}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <UserCheck size={14} /> Simpan Perubahan
              </button>
              <button
                onClick={batalkanSimulasi}
                className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <X size={14} /> Batal
              </button>
            </div>
          </div>
        )}

        {/* Statistik Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Siswa (Tampilan)"
            value={stats.totalSiswa}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
          />
          <StatCard
            title="Total Kelas (Tampilan)"
            value={stats.totalKelas}
            icon={<BookOpen className="h-6 w-6 text-white" />}
            color="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
          />
          <StatCard
            title="Lulusan (XII)"
            value={stats.lulusanCount}
            icon={<GraduationCap className="h-6 w-6 text-white" />}
            color="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
          />
          <StatCard
            title="Siswa Tanpa Kelas"
            value={stats.siswaTanpaKelas}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between mb-6 bg-white dark:bg-[#1e293b] rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
            {(["X", "XI", "XII", "Lulusan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tab === "Lulusan" ? "Kelas Lulusan" : `Kelas ${tab}`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewPromotion}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium transition-all text-sm"
            >
              <RefreshCw size={16} /> Preview
            </button>
            <button
              onClick={handlePromoteAllClasses}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all text-sm"
            >
              <ArrowUp size={16} /> Naikkan Semua
            </button>
            <button
              onClick={() => setShowLog((s) => !s)}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-all text-sm"
            >
              <History size={16} /> {showLog ? "Sembunyikan Log" : "Tampilkan Log"}
            </button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="search-filter"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Cari Kelas
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="search-filter"
                    type="text"
                    placeholder="Cari kelas atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="filter-angkatan"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Angkatan
                </label>
                <input
                  id="filter-angkatan"
                  type="number"
                  placeholder="Semua Angkatan"
                  value={filterAngkatan}
                  onChange={(e) => setFilterAngkatan(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="filter-jurusan"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Jurusan
                </label>
                <select
                  id="filter-jurusan"
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                >
                  <option value="" className="dark:bg-[#0f172a]">
                    Semua Jurusan
                  </option>
                  {jurusanList.map((j) => (
                    <option key={j.id} value={j.id} className="dark:bg-[#0f172a]">
                      {j.nama_jurusan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="filter-arsip"
                  type="checkbox"
                  checked={filterArsip}
                  onChange={(e) => setFilterArsip(e.target.checked)}
                />
                <label htmlFor="filter-arsip" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Tampilkan Arsip
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFilterAngkatan("")
                  setFilterJurusan("")
                  setFilterArsip(false)
                }}
                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Mass Action Bar */}
        {filteredKelasByTab.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="select-all-checkbox"
                checked={selectedKelasIds.length === filteredKelasByTab.length && filteredKelasByTab.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4"
              />
              <label htmlFor="select-all-checkbox" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Pilih Semua ({selectedKelasIds.length}/{filteredKelasByTab.length})
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePromoteSelectedClasses}
                disabled={selectedKelasIds.length === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                  selectedKelasIds.length === 0
                    ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <ArrowUp size={16} /> Naikkan Terpilih
              </button>
              <button
                onClick={handleMassDelete}
                disabled={selectedKelasIds.length === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                  selectedKelasIds.length === 0
                    ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                <Trash2 size={16} /> Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {filteredKelasByTab.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada kelas ditemukan untuk {activeTab === "Lulusan" ? "Kelas Lulusan" : `Kelas ${activeTab}`}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKelasByTab.map((kelas) => (
              <KelasCard key={kelas.id} kelas={kelas} />
            ))}
          </div>
        )}

        {/* Log Aktivitas - Collapsible */}
        {showLog && (
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md p-4 mt-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Log Aktivitas Terbaru</h3>
              <button
                onClick={() => setShowLog(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Tutup log"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto text-xs space-y-1">
              {logActivity.length > 0 ? (
                logActivity.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded ${
                      log.type === "success"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : log.type === "warning"
                          ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                          : log.type === "error"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                            : "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    <span className="font-medium">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}:
                    </span>{" "}
                    {log.message}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-2">Belum ada aktivitas.</p>
              )}
            </div>
          </div>
        )}

        {/* Modal Tambah/Edit Kelas */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">{selectedKelas ? "Edit Kelas" : "Tambah Kelas Baru"}</h2>
              <form onSubmit={handleSubmitKelas} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kelas</label>
                  <input
                    type="text"
                    value={newKelas.name_kelas}
                    onChange={(e) => setNewKelas({ ...newKelas, name_kelas: e.target.value })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Misal: X RPL 1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jurusan</label>
                  <select
                    value={newKelas.jurusan_id}
                    onChange={(e) => setNewKelas({ ...newKelas, jurusan_id: Number(e.target.value) })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0" className="dark:bg-[#0f172a]">
                      Pilih Jurusan
                    </option>
                    {jurusanList.map((j) => (
                      <option key={j.id} value={j.id} className="dark:bg-[#0f172a]">
                        {j.nama_jurusan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tingkat</label>
                  <select
                    value={newKelas.kelas_tingkat}
                    onChange={(e) => setNewKelas({ ...newKelas, kelas_tingkat: e.target.value as "X" | "XI" | "XII" })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="X" className="dark:bg-[#0f172a]">
                      X
                    </option>
                    <option value="XI" className="dark:bg-[#0f172a]">
                      XI
                    </option>
                    <option value="XII" className="dark:bg-[#0f172a]">
                      XII
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Wali Kelas</label>
                  <select
                    value={newKelas.wali_kelas_id}
                    onChange={(e) => setNewKelas({ ...newKelas, wali_kelas_id: Number(e.target.value) })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0" className="dark:bg-[#0f172a]">
                      Pilih Wali Kelas
                    </option>
                    {guruList.map((g) => (
                      <option key={g.id} value={g.id} className="dark:bg-[#0f172a]">
                        {g.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas Siswa</label>
                  <input
                    type="number"
                    min={1}
                    value={newKelas.kapasitas_siswa}
                    onChange={(e) => setNewKelas({ ...newKelas, kapasitas_siswa: Number(e.target.value) })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Angkatan</label>
                  <input
                    type="number"
                    value={newKelas.angkatan}
                    onChange={(e) => setNewKelas({ ...newKelas, angkatan: Number(e.target.value) })}
                    min={2000}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                  <textarea
                    value={newKelas.deskripsi}
                    onChange={(e) => setNewKelas({ ...newKelas, deskripsi: e.target.value })}
                    rows={3}
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi singkat kelas (opsional)"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-95"
                  >
                    {selectedKelas ? "Simpan Perubahan" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Kelas */}
        {detailModalOpen && selectedKelas && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setDetailModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-3xl relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              <div
                className="p-4 rounded-lg mb-4"
                style={{ backgroundColor: `${getJurusan(selectedKelas.jurusan_id)?.warna}11` }}
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {getJurusan(selectedKelas.jurusan_id)?.icon || "📚"} Detail Siswa: {selectedKelas.name_kelas}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getJurusan(selectedKelas.jurusan_id)?.nama_jurusan}
                </p>
              </div>

              {/* Info dasar */}
              <div className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Nama Kelas:</span>{" "}
                    <span className="font-medium">{selectedKelas.name_kelas}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Jurusan:</span>{" "}
                    <span className="font-medium">{getJurusanName(selectedKelas.jurusan_id)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Tingkat:</span>{" "}
                    <span className="font-medium">{selectedKelas.kelas_tingkat}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Wali Kelas:</span>{" "}
                    <span className="font-medium">{getGuruName(selectedKelas.wali_kelas_id)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Jumlah Siswa:</span>{" "}
                    <span className="font-medium">{getSiswaByKelasId(selectedKelas.id).length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Kapasitas:</span>{" "}
                    <span className="font-medium">
                      {getSiswaByKelasId(selectedKelas.id).length} / {selectedKelas.kapasitas_siswa}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Angkatan:</span>{" "}
                    <span className="font-medium">{selectedKelas.angkatan}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Deskripsi:</span>{" "}
                    <span className="font-medium">{selectedKelas.deskripsi || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Detail controls */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                  <select
                    value={filterDetailStatus}
                    onChange={(e) => setFilterDetailStatus(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="dark:bg-[#0f172a]">
                      Semua
                    </option>
                    <option value="Aktif" className="dark:bg-[#0f172a]">
                      Aktif
                    </option>
                    <option value="Nonaktif" className="dark:bg-[#0f172a]">
                      Nonaktif
                    </option>
                    <option value="Lulus" className="dark:bg-[#0f172a]">
                      Lulus
                    </option>
                    <option value="Keluar" className="dark:bg-[#0f172a]">
                      Keluar
                    </option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JK:</label>
                  <select
                    value={filterDetailJK}
                    onChange={(e) => setFilterDetailJK(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="dark:bg-[#0f172a]">
                      Semua
                    </option>
                    <option value="Laki-laki" className="dark:bg-[#0f172a]">
                      L
                    </option>
                    <option value="Perempuan" className="dark:bg-[#0f172a]">
                      P
                    </option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setAddTargetKelasId(selectedKelas.id)
                    setAddSiswaModalOpen(true)
                  }}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all"
                >
                  <UserPlus size={14} /> Tambah Siswa
                </button>
                <button
                  onClick={() => exportToCSV(selectedKelas.id)}
                  className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <SiswaTable siswaList={filteredDetailSiswa} onEdit={handleEditSiswa} onDelete={handleDeleteSiswa} />

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Siswa */}
        {editSiswaModalOpen && selectedSiswa && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setEditSiswaModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditSiswaModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">Edit Siswa</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdateSiswa()
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIS</label>
                  <input
                    type="text"
                    value={selectedSiswa.nis}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, nis: e.target.value })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan NIS"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                  <input
                    type="text"
                    value={selectedSiswa.nama}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, nama: e.target.value })}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                  <select
                    value={selectedSiswa.jenisKelamin}
                    onChange={(e) =>
                      setSelectedSiswa({ ...selectedSiswa, jenisKelamin: e.target.value as "Laki-laki" | "Perempuan" })
                    }
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Laki-laki" className="dark:bg-[#0f172a]">
                      Laki-laki
                    </option>
                    <option value="Perempuan" className="dark:bg-[#0f172a]">
                      Perempuan
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={selectedSiswa.status}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, status: e.target.value as SiswaStatus })}
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Aktif" className="dark:bg-[#0f172a]">
                      Aktif
                    </option>
                    <option value="Nonaktif" className="dark:bg-[#0f172a]">
                      Nonaktif
                    </option>
                    <option value="Lulus" className="dark:bg-[#0f172a]">
                      Lulus
                    </option>
                    <option value="Keluar" className="dark:bg-[#0f172a]">
                      Keluar
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                  <select
                    value={selectedSiswa.kelas_id ?? ""}
                    onChange={(e) =>
                      setSelectedSiswa({ ...selectedSiswa, kelas_id: e.target.value ? Number(e.target.value) : null })
                    }
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="dark:bg-[#0f172a]">
                      Pilih Kelas
                    </option>
                    {useKelas.map((k) => (
                      <option key={k.id} value={k.id} className="dark:bg-[#0f172a]">
                        {k.name_kelas} ({getJurusanName(k.jurusan_id)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Angkatan</label>
                  <input
                    type="number"
                    value={selectedSiswa.angkatan}
                    onChange={(e) => setSelectedSiswa({ ...selectedSiswa, angkatan: Number(e.target.value) })}
                    min={2000}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditSiswaModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-95"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Preview Kenaikan */}
        {showPreview && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-4xl relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white z-10"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4">Preview Kenaikan Kelas</h2>
              <div className="space-y-4">
                {previewData.length > 0 ? (
                  previewData.map((preview, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg border dark:border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between font-bold text-lg mb-3">
                        <span className="text-gray-800 dark:text-gray-200">{preview.old.name_kelas}</span>
                        <ArrowRight className="h-5 w-5 text-blue-500 my-2 sm:my-0" />
                        <span
                          className={
                            preview.new.name_kelas === "LULUS" ? "text-green-500" : "text-gray-800 dark:text-gray-200"
                          }
                        >
                          {preview.new.name_kelas}
                        </span>
                      </div>
                      <SiswaTable siswaList={preview.siswa} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                    Tidak ada siswa aktif yang dapat dinaikkan.
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Add Siswa to Kelas */}
        {addSiswaModalOpen && addTargetKelasId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Pilih Siswa untuk Ditambahkan ke Kelas {useKelas.find((k) => k.id === addTargetKelasId)?.name_kelas}
                </h3>
                <button
                  onClick={() => {
                    setAddSiswaModalOpen(false)
                    setAddTargetKelasId(null)
                    setAddSelectedSiswaIds([])
                    setAddSearch("")
                  }}
                  className="px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>

              {/* Pencarian */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Cari nama atau NIS..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Info kapasitas tersisa */}
              {(() => {
                const kelas = useKelas.find((k) => k.id === addTargetKelasId)!
                const sisa = kelas.kapasitas_siswa - getSiswaByKelasId(addTargetKelasId).length
                return (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      Dapat menambahkan: <span className="font-semibold">{Math.max(0, sisa)}</span> siswa
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      Dipilih: <span className="font-semibold">{addSelectedSiswaIds.length}</span>
                    </span>
                  </div>
                )
              })()}

              {/* Daftar siswa */}
              <div className="max-h-80 overflow-y-auto rounded border border-gray-200 dark:border-gray-700">
                {availableSiswaForAdd.length === 0 ? (
                  <p className="text-sm text-center py-6 text-gray-600 dark:text-gray-300">
                    Tidak ada siswa tanpa kelas yang cocok.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {availableSiswaForAdd.map((s) => (
                      <li key={s.id} className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={addSelectedSiswaIds.includes(s.id)}
                            onChange={() =>
                              setAddSelectedSiswaIds((prev) =>
                                prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                              )
                            }
                            className="w-4 h-4"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">{s.nama}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              NIS: {s.nis} • JK: {s.jenisKelamin} • Status: {s.status}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                          Angkatan {s.angkatan}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Aksi */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setAddSelectedSiswaIds([])
                    setAddSiswaModalOpen(false)
                  }}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmAddSiswaToKelas}
                  disabled={addSelectedSiswaIds.length === 0}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    addSelectedSiswaIds.length === 0
                      ? "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Tambahkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dragging hints */}
        {draggedSiswa && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <span className="text-sm">Seret "{draggedSiswa.nama}" ke kelas tujuan.</span>
          </div>
        )}
        {dragOverKelasId && (
          <div className="fixed top-12 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <span className="text-sm">Lepaskan untuk memindahkan.</span>
          </div>
        )}
      </div>
    </div>
  )
}
