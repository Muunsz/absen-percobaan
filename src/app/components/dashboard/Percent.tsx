"use client"

type Props = {
  data: {
    absensiHariIni: {
      hadir: number
      izin: number
      sakit: number
      alfa: number
    }
    totalSiswa: number
  }
}

export default function Percent({ data }: Props) {
  const { hadir, izin, sakit, alfa } = data.absensiHariIni
  const total = data.totalSiswa
  const hadirPersen = total > 0 ? Math.round((hadir / total) * 100) : 0

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-[250px] border border-gray-200 dark:border-gray-700">
      <h2 className="text-gray-700 dark:text-gray-300 text-sm">Persentase Kehadiran</h2>
      <div className="mt-5">
        <div className="flex items-end gap-3">
          <span className="text-6xl font-bold text-gray-900 dark:text-white">{hadirPersen}</span>
          <span className="text-2xl text-gray-500 dark:text-gray-400 mb-1">%</span>
        </div>
        <div className="mt-3 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${hadirPersen}%` }}
            aria-valuenow={hadirPersen}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${hadirPersen}%`}
            aria-label="Persentase kehadiran hari ini"
            role="progressbar"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hari ini</p>
        <p className="sr-only">{`Persentase kehadiran hari ini ${hadirPersen} persen`}</p>
      </div>
    </section>
  )
}