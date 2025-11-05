import { Calendar } from "lucide-react"
import { formatDateDisplay, today } from "@/lib/agenda-guru-utils"

interface SummaryCardGuruProps {
  agendaCount: number
}

export function SummaryCardGuru({ agendaCount }: SummaryCardGuruProps) {
  return (
    <div className="p-5 rounded-xl border border-blue-400/30 bg-blue-50 dark:bg-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
      <Calendar className="size-6 text-blue-600 dark:text-blue-400 shrink-0" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-grow w-full">
        <div className="mr-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agenda Hari Ini</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formatDateDisplay(today)}</h2>
        </div>
        <span className="mt-2 sm:mt-0 px-4 py-2 rounded-full bg-blue-500 text-white font-bold text-sm shadow-md min-w-[100px] text-center shrink-0">
          {agendaCount} Sesi
        </span>
      </div>
    </div>
  )
}
