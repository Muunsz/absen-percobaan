import { formatDateDisplay, today } from "@/lib/agenda-guru-utils"

interface FooterGuruProps {
  agendaCount: number
}

export function FooterGuru({ agendaCount }: FooterGuruProps) {
  return (
    <footer className="pt-8 pb-4 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
      Menampilkan {agendaCount} agenda pembelajaran hari ini ({formatDateDisplay(today)}).
    </footer>
  )
}
