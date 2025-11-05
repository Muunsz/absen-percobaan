export type Jurusan = {
  id: number
  nama_jurusan: string
  kode_jurusan: string
  warna: string
  warnaGelap: string
  icon: string
}

export type Kelas = {
  id: number
  name_kelas: string
  jurusan_id: number
  kelas_tingkat: "X" | "XI" | "XII"
  wali_kelas_id: number
  deskripsi?: string
  angkatan: number
  created_at: string
  updated_at: string
  is_arsip?: boolean
  kapasitas_siswa: number
}

export type SiswaStatus = "Aktif" | "Nonaktif" | "Lulus" | "Keluar"

export type Siswa = {
  id: number
  nis: string
  nama: string
  jenisKelamin: "Laki-laki" | "Perempuan"
  status: SiswaStatus
  kelas_id: number | null
  angkatan: number
  created_at: string
  updated_at: string
  tempat_lahir?: string
  tanggal_lahir?: string
  alamat?: string
  no_telepon?: string
  nip_ortu?: string
  is_lulus?: boolean
}

export type LogEntry = { id: number; timestamp: string; message: string; type: "info" | "success" | "warning" | "error" }

export type StatCardProps = { title: string; value: number | string; icon: any; color: string }
