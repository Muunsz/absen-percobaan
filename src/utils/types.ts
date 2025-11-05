export type PrismaJurusan = { id: number; jurusan: string };
export type KelasListItem = { id: number; kelas: string; id_jurusan: number; jurusan: PrismaJurusan; totalSiswaAktif: number };
export type Gender = "L" | "P";
export type SiswaStatus = "Aktif" | "NonAktif";
export type AbsentStatus = "HADIR" | "SAKIT" | "IZIN" | "ALPA";
export type RekapAbsensiResult = {
    NIS: string;
    Nama: string;
    JK: Gender;
    status: SiswaStatus;
    id_class: number;
    absensi: {
        tanggal: string;
        keterangan: AbsentStatus;
        deskripsi: string | null;
    }[];
};
export type FilterTab = "Semua" | "X" | "XI" | "XII" | "Lulusan";
export type FilterType = "all" | "byMonth" | "byDate";

export const CURRENT_YEAR = new Date().getFullYear();
export const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
export const MONTH_NAMES_ID = MONTHS_ID.map((name, index) => ({ name, index: index + 1 }));