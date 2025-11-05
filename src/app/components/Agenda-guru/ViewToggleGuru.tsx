"use client"

import { LayoutGrid, Table2 } from "lucide-react"

interface ViewToggleGuruProps {
  view: "card" | "table"
  onViewChange: (view: "card" | "table") => void
}

export function ViewToggleGuru({ view, onViewChange }: ViewToggleGuruProps) {
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
