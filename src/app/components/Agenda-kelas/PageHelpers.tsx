import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    ChevronRight,
    LayoutGrid,
    Table2,
    Loader2
} from "lucide-react"
import { formatDateDisplay, pretty, today } from "@/lib/agenda-kelas-page-utils"
import React from "react"

interface BreadcrumbAndBackButtonProps {
    jurusan: string
    kelas: string
}

export function BreadcrumbAndBackButton({ jurusan, kelas }: BreadcrumbAndBackButtonProps) {
    const basePath = "/admin/agenda-kelas"
    const backHref = `${basePath}/${jurusan}`
    const jurusanPath = `${basePath}/${jurusan}`
    return (
        <div className="flex items-center justify-between">
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                    <li>
                        <Link className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors" href={basePath}>
                            PILIH JURUSAN
                        </Link>
                    </li>
                    <li className="text-gray-400 dark:text-gray-600">
                        <ChevronRight className="w-4 h-4" />
                    </li>
                    <li>
                        <Link className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors" href={jurusanPath}>
                            {pretty(jurusan)}
                        </Link>
                    </li>
                    <li className="text-gray-400 dark:text-gray-600">
                        <ChevronRight className="w-4 h-4" />
                    </li>
                    <li className="text-gray-900 dark:text-white font-semibold">{pretty(kelas)}</li>
                </ol>
            </nav>
            <Link
                href={backHref}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:shadow-none shrink-0"
            >
                <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
                Kembali
            </Link>
        </div>
    )
}

interface ViewToggleProps {
    view: "card" | "table"
    onViewChange: (view: "card" | "table") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shadow-inner shrink-0">
            <button
                onClick={() => onViewChange("card")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    view === "card"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-label="Lihat dalam mode Kartu"
            >
                <LayoutGrid className="size-4" />
                <span className="text-sm hidden sm:inline">Kartu</span>
            </button>
            <button
                onClick={() => onViewChange("table")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    view === "table"
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-label="Lihat dalam mode Tabel"
            >
                <Table2 className="size-4" />
                <span className="text-sm hidden sm:inline">Tabel</span>
            </button>
        </div>
    )
}

interface SummaryCardProps {
    agendaCount: number
}

export function SummaryCard({ agendaCount }: SummaryCardProps) {
    return (
        <div className="p-5 rounded-xl border border-blue-400/30 bg-blue-50 dark:bg-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
            <Calendar className="size-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-grow w-full">
                <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agenda Aktif Hari Ini</p>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formatDateDisplay(today)}</h2>
                </div>
                <span className="mt-2 sm:mt-0 px-4 py-2 rounded-full bg-blue-500 text-white font-bold text-sm shadow-md min-w-[100px] text-center shrink-0">
                    {agendaCount} Sesi
                </span>
            </div>
        </div>
    )
}

interface EmptyStateProps {
    fetchError: string | null
}

export function EmptyState({ fetchError }: EmptyStateProps) {
    return (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md mt-6">
            <BookOpen className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
                {fetchError ? "Gagal memuat data." : "Tidak ada agenda pembelajaran yang tercatat untuk hari ini."}
            </p>
        </div>
    )
}

export function LoadingState({ kelas }: { kelas: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="p-6 text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
                <Loader2 className="size-8 animate-spin mx-auto text-blue-500 mb-2" />
                <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Memuat data kelas {pretty(kelas)}...</p>
            </div>
        </div>
    )
}

export function Footer({ agendaCount, kelas }: { agendaCount: number; kelas: string }) {
    return (
        <footer className="pt-8 pb-4 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
            Menampilkan {agendaCount} agenda pembelajaran hari ini ({formatDateDisplay(today)}) untuk kelas <span className="font-semibold">{pretty(kelas)}</span>.
        </footer>
    )
}