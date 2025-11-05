import Link from "next/link";
import Image from "next/image";
import { JURUSAN_STYLE_DATA } from "@/lib/agenda-kelas-utils";

interface KelasCardProps {
  label: string;
  color: string;
  href: string;
  iconSrc: string;
  iconAlt: string;
}

export function KelasCard({ label, color, href, iconSrc, iconAlt }: KelasCardProps) {
  return (
    <Link href={href}>
      <div
        className="rounded-2xl p-5 shadow-lg transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 
                   bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:hover:shadow-blue-500/30 h-full flex flex-col justify-between"
      >
        <div className="text-center flex flex-col items-center justify-center gap-3">
          <div
            className="mx-auto h-16 w-16 rounded-full grid place-items-center text-2xl overflow-hidden relative transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${color}20`,
              border: `2px solid ${color}`,
              color: color
            }}
          >
            <Image 
              src={iconSrc}
              alt={iconAlt}
              width={40}
              height={40}
              className="object-contain"
              onError={(e) => { 
                (e.currentTarget as HTMLImageElement).onerror = null; 
                (e.currentTarget as HTMLImageElement).src = JURUSAN_STYLE_DATA["RPL"].icon;
              }}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
            {label}
          </h2>

          <div
            className="mt-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300"
            style={{ backgroundColor: `${color}33`, color }}
          >
            Lihat Agenda →
          </div>
        </div>
      </div>
    </Link>
  );
}