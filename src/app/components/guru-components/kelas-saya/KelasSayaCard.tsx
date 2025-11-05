// components/guru/KelasSayaCard.tsx
"use client";
import Link from "next/link";

type KelasSayaCardProps = {
  id: string;
  nama: string;
  jenjang: string;
  jurusan: string;
};

export default function KelasSayaCard({ id, nama, jenjang, jurusan }: KelasSayaCardProps) {
  return (
    <Link href={`/guru/kelas-saya/${id}`} className="block">
      <div className="rounded-2xl p-5 shadow transition-transform hover:scale-[1.02] bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <span className="text-blue-500 font-bold text-sm">{jenjang}</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{nama}</h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Jurusan: {jurusan}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}