"use client"

import Link from "next/link"

type Props = {
  data: {
    absensiHariIni: {
      hadir: number
      izin: number
      sakit: number
      alfa: number
    }
  }
}

export default function Keterangan({ data }: Props) {
  const { sakit, izin, alfa } = data.absensiHariIni

  return (
    <>
      {/* Kartu Total Sakit */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-[120px] flex flex-col justify-between border border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Total Sakit Hari Ini</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{sakit}</p>
        </div>
        <Link
          href="/admin/dashboard/detail/sakit"
          className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm transition-colors w-full text-center inline-flex items-center justify-center"
        >
          Detail
        </Link>
      </section>

      {/* Kartu Total Izin */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-[120px] flex flex-col justify-between border border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Total Izin Hari Ini</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{izin}</p>
        </div>
        <Link
          href="/admin/dashboard/detail/izin"
          className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm transition-colors w-full text-center inline-flex items-center justify-center"
        >
          Detail
        </Link>
      </section>

      {/* Kartu Total Alfa */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-[120px] flex flex-col justify-between border border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Total Alfa Hari Ini</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{alfa}</p>
        </div>
        <Link
          href="/admin/dashboard/detail/alfa"
          className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm transition-colors w-full text-center inline-flex items-center justify-center"
        >
          Detail
        </Link>
      </section>
    </>
  )
}