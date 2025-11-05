"use client"

import Link from "next/link"
import { Users, User, TrendingUp, Thermometer, FileText, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import React from "react"

type Props = {
  data: {
    absensiHariIni: {
      hadir: number
      izin: number
      sakit: number
      alfa: number
    }
    totalSiswa: number
    siswaLakiLaki: number
    siswaPerempuan: number
  }
}

const StatusQuarterCard = ({ icon: Icon, title, value, colorClass, detailUrl }: {
  icon: React.ElementType,
  title: string,
  value: number,
  colorClass: string,
  detailUrl: string | undefined
}) => (
  <section className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col transition-shadow duration-300 hover:shadow-lg">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-15 dark:bg-opacity-20`}>
        <Icon size={20} className={`${colorClass}`} />
      </div>
      {detailUrl ? (
        <Link 
          href={detailUrl} 
          className="text-xs font-semibold py-1 px-3 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition duration-150 shadow-md hover:shadow-lg"
        >
          Lihat Detail
        </Link>
      ) : (
        <div className="h-[28px]"></div> 
      )}
    </div>
    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">{title}</h2>
  </section>
)

export default function StatsCard({ data }: Props) {
  const { hadir, izin, sakit, alfa } = data.absensiHariIni
  const { totalSiswa, siswaLakiLaki, siswaPerempuan } = data

  const hadirPersen = totalSiswa > 0 ? Math.round((hadir / totalSiswa) * 100) : 0
  const tidakHadirPersen = 100 - hadirPersen

  const siswaTidakHadir = totalSiswa - hadir

  return (
    <div className="grid grid-cols-1 gap-6">

      <section className="p-6 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 col-span-full">
        <div className="flex justify-between items-start mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Zap size={24} className="text-indigo-600 dark:text-indigo-400" /> Skor Kepatuhan Kehadiran
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status Kehadiran Siswa Hari Ini</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Siswa</p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{totalSiswa}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <span className="text-6xl font-extrabold text-green-600 dark:text-green-400 leading-none">{hadirPersen}</span>
            <span className="text-3xl font-light text-gray-500 dark:text-gray-400">%</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Persentase Kehadiran</h3>
            <div className="flex h-3 w-full rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500 transition-all duration-500"
                style={{ width: `${hadirPersen}%` }}
                aria-valuenow={hadirPersen}
                role="progressbar"
                title={`Hadir: ${hadirPersen}%`}
              />
              <div
                className="h-3 bg-red-500 transition-all duration-500"
                style={{ width: `${tidakHadirPersen}%` }}
                aria-valuenow={tidakHadirPersen}
                role="progressbar"
                title={`Tidak Hadir: ${tidakHadirPersen}%`}
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
              <span>Hadir: {hadir}</span> 
              <span>Tidak Hadir: {siswaTidakHadir}</span> 
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 col-span-full">
        
        <StatusQuarterCard 
          icon={CheckCircle}
          title="Tercatat Hadir"
          value={hadir}
          colorClass="text-green-600 dark:text-green-400"
          detailUrl={undefined}
        />

        <StatusQuarterCard 
          icon={Thermometer}
          title="Sakit Hari Ini"
          value={sakit} 
          colorClass="text-red-600 dark:text-red-400"
          detailUrl="/view-only/dashboard/detail/sakit"
        />

        <StatusQuarterCard 
          icon={FileText}
          title="Izin Hari Ini"
          value={izin} 
          colorClass="text-yellow-600 dark:text-yellow-400"
          detailUrl="/view-only/dashboard/detail/izin"
        />

        <StatusQuarterCard 
          icon={AlertTriangle}
          title="Alfa (Tanpa Keterangan)"
          value={alfa} 
          colorClass="text-gray-600 dark:text-gray-400"
          detailUrl="/view-only/dashboard/detail/alfa"
        />
      </div>

      <section className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 col-span-full">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <User size={20} className="text-purple-600 dark:text-purple-400" /> Komposisi Gender Siswa
        </h3>
        <div className="flex flex-col sm:flex-row justify-around gap-6 text-center">
          
          <div className="flex-1 p-4 rounded-lg bg-blue-50 dark:bg-gray-700 shadow-inner">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium block mb-1">Laki-laki</span>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{siswaLakiLaki}</p>
          </div>
          
          <div className="flex-1 p-4 rounded-lg bg-pink-50 dark:bg-gray-700 shadow-inner">
            <span className="text-pink-600 dark:text-pink-400 text-sm font-medium block mb-1">Perempuan</span>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{siswaPerempuan}</p>
          </div>
        </div>
      </section>
    </div>
  )
}