import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbGuruProps {
  title?: string
  jurusan?: string
}

export function BreadcrumbGuru({ title = "Isi Agenda Guru", jurusan }: BreadcrumbGuruProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 p-4 rounded-2xl shadow-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 transition duration-300"
    >
      <div className="flex items-center justify-between">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 font-medium transition-colors duration-200"
              href="/guru/dashboard"
            >
              Dashboard
            </Link>
          </li>

          <li className="text-gray-400 dark:text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </li>

          {jurusan && (
            <>
              <li>
                <Link
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 font-medium transition-colors duration-200"
                  href={`/guru/isi-agenda/${jurusan}`}
                >
                  {jurusan}
                </Link>
              </li>

              <li className="text-gray-400 dark:text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </li>
            </>
          )}

          <li className="text-gray-900 dark:text-white font-semibold">{title}</li>
        </ol>

        <Link
          href="/guru"
          className="ml-4 inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 
                    bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm
                    dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:shadow-none
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <svg
            className="w-4 h-4 mr-1 -ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali
        </Link>
      </div>
    </nav>
  )
}
