import { BookOpen } from "lucide-react"

interface EmptyStateGuruProps {
  fetchError: string | null
}

export function EmptyStateGuru({ fetchError }: EmptyStateGuruProps) {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md mt-6">
      <BookOpen className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        {fetchError ? "Gagal memuat data." : "Tidak ada agenda pembelajaran yang tercatat untuk hari ini."}
      </p>
    </div>
  )
}
