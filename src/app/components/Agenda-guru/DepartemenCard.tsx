import Link from "next/link"
import Image from "next/image"
import { JurusanFromDB, getJurusanStyle } from "@/lib/jurusan-utils"

interface DepartmentCardProps {
  jurusan: JurusanFromDB
}

export default function DepartmentCard({ jurusan }: DepartmentCardProps) {
  const { color, icon, displayName } = getJurusanStyle(jurusan.jurusan)
  const slug = jurusan.jurusan.toLowerCase().replace(/\s+/g, "-")

  return (
    <Link href={`/guru/isi-agenda/${slug}`} passHref className="h-full">
      <div
        className="rounded-2xl p-6 h-full min-h-[200px] flex flex-col items-center justify-center text-center 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      >
        <div
          className="h-14 w-14 rounded-full grid place-items-center mb-4"
          style={{
            backgroundColor: `${color}20`,
            color,
            boxShadow: `0 0 10px ${color}50`,
          }}
        >
          <Image
            src={icon}
            alt={`${displayName} icon`}
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Tambahkan 'truncate' untuk teks sangat panjang atau gunakan 'line-clamp' jika Anda ingin multi-baris tanpa memanjang */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2 min-h-[3rem]">
            {jurusan.jurusan}
        </h2>
        
        <div
          className="mt-auto px-6 py-2 rounded-full text-sm font-semibold hover:opacity-80"
          style={{ backgroundColor: `${color}30`, color }}
        >
          Lihat Kelas →
        </div>
      </div>
    </Link>
  )
}