export const today = new Date().toISOString().split("T")[0]

export interface GuruAgenda {
  id: number
  tanggal: string
  namaGuru: string
  jamMulai: string
  jamSelesai: string
  namaMapel: string
  kelas: string
  materi: string
  keterangan: string
  dokumentasi: string
}

export interface GuruMapelData {
  id: number
  namaGuru: string
  namaMapel: string
}

export interface AgendaFormSubmitData {
  id?: number
  tanggal: string
  namaGuru: string
  jamMulai: string
  jamSelesai: string
  namaMapel: string
  materi: string
  keterangan: string
  kelas: string
  file?: File
}

export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + "T00:00:00")
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("id-ID", options)
}

export function pretty(text: string): string {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
