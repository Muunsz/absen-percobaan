import { AbsentStatus, CURRENT_YEAR } from "./types"

export function getTingkatDariNamaKelas(namaKelas: string): "X" | "XI" | "XII" | null {
  if (!namaKelas) return null;
  const namaUpper = namaKelas.toUpperCase().trim();
  if (namaUpper.startsWith("X ")) return "X";
  if (namaUpper.startsWith("XI ")) return "XI";
  if (namaUpper.startsWith("XII ")) return "XII";
  if (namaUpper.includes("XII")) return "XII"; 
  return null;
}

export function getAngkatanByTingkat(kelas_tingkat: "X" | "XI" | "XII" | null): number | null {
  if (!kelas_tingkat) return null;
  switch (kelas_tingkat) {
    case "X":
      return CURRENT_YEAR;
    case "XI":
      return CURRENT_YEAR - 1; 
    case "XII":
      return CURRENT_YEAR - 2;
    default:
      return null;
  }
}

export const getStatusClasses = (status: AbsentStatus) => {
    switch (status) {
      case "HADIR":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
      case "IZIN":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
      case "SAKIT":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-200"
      case "ALPA":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200"
    }
}