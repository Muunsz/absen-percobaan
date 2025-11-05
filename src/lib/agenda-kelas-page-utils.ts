export type KelasAgenda = {
    id: number
    tanggal: string
    jam: string
    namaGuru: string
    namaMapel: string
    materi: string
    keterangan: string
    dokumentasi: string
    jamMulai: string
    jamSelesai: string
}

export type GuruMapelData = {
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
    file: File | null
}

export const getTodayDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const today = getTodayDate()

export function pretty(v: string) {
    try {
        return decodeURIComponent(v).replace(/-/g, " ").toUpperCase()
    } catch {
        return v.replace(/-/g, " ").toUpperCase()
    }
}

export const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export const sortAgendaList = (list: KelasAgenda[]) => {
    return list.sort((a, b) => a.jam.localeCompare(b.jam))
}