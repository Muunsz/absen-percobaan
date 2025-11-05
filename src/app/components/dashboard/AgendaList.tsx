"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

interface AgendaItem {
  id: number
  tanggal: string
  judul: string
  kelas: string
  oleh: string
}

export default function AgendaList() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAgenda() {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        setAgenda(data)
      } catch (error) {
        console.error("Error fetching agenda:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgenda()
  }, [])

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 dark:text-gray-300 text-sm">
          Agenda Terkini (Khusus)
        </h2>
        <Link
          href="/admin/calendar"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm transition-colors"
          aria-label="Lihat Kalender"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Lihat Kalender</span>
        </Link>
      </div>
      <div className="mt-3 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Judul
              </th>
              <th
                scope="col"
                className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Kelas
              </th>
              <th
                scope="col"
                className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Dibuat Oleh
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-2 text-center text-gray-500 dark:text-gray-400"
                >
                  Memuat data...
                </td>
              </tr>
            ) : agenda.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-2 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada agenda.
                </td>
              </tr>
            ) : (
              agenda.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-gray-900 dark:text-white">
                    {row.tanggal}
                  </td>
                  <td className="px-3 py-2 text-gray-900 dark:text-white">
                    {row.judul}
                  </td>
                  <td className="px-3 py-2 text-gray-900 dark:text-white">
                    {row.kelas}
                  </td>
                  <td className="px-3 py-2 text-gray-900 dark:text-white">
                    {row.oleh}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}