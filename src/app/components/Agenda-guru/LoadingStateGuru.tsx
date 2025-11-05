import { Loader2 } from "lucide-react"

export function LoadingStateGuru() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
        <Loader2 className="size-8 animate-spin mx-auto text-blue-500 mb-2" />
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Memuat data agenda guru...</p>
      </div>
    </div>
  )
}
