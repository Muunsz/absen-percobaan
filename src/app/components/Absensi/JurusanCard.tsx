"use client";

import Link from "next/link";
import Image from "next/image";

interface JurusanCardProps {
  jurusan: string;
  color: string;
  icon: string;
}

function JurusanCard({ jurusan, color, icon }: JurusanCardProps) {
  const isImage = icon.startsWith("/images/");

  return (
    <Link 
      href={`/admin/absensi/${jurusan.toLowerCase()}`}
      className="block h-full"
    >
      <div
        className="
          rounded-xl p-6 h-full w-full max-w-xs mx-auto 
          flex flex-col justify-between items-center text-center 
          hover:shadow-2xl hover:border-blue-500 transition-all duration-300
          bg-white border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700
        "
        style={{ minHeight: '260px' }}
      >
        <div className="flex-shrink-0">
          <div
            className="h-20 w-20 rounded-full grid place-items-center text-2xl overflow-hidden relative p-2 mb-4 transition-transform duration-300 hover:scale-105"
            style={{ 
              backgroundColor: `${color}20`, 
              border: `2px solid ${color}`,
            }}
          >
            {isImage ? (
              <Image
                src={icon}
                alt={`Icon ${jurusan}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="80px"
                className="p-1"
              />
            ) : (
              <span style={{ color: color }}>{icon}</span>
            )}
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center w-full mb-4">
          <h2 
            className="
              text-lg font-bold text-gray-900 dark:text-gray-100 
              line-clamp-2 overflow-hidden text-ellipsis h-12
            " 
            title={jurusan}
          >
            {jurusan}
          </h2>
        </div>

        <div className="flex-shrink-0 w-full">
          <div
            className="
              w-full py-2 rounded-lg text-sm font-semibold 
              transition-all duration-300 transform hover:scale-[1.03]
            "
            style={{ 
              backgroundColor: `${color}40`, 
              color: 'white', 
            }}
          >
            Pilih Kelas →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default JurusanCard;