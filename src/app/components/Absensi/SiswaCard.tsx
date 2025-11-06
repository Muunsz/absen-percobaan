// src/components/Absensi/SiswaCard.tsx
import { CheckCircle, Trash2 } from "lucide-react";

interface SiswaCardProps {
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  onRemove: () => void;
}

export default function SiswaCard({ nama, nis, kelas, jurusan, onRemove }: SiswaCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <div className="font-medium truncate">{nama}</div>
        <CheckCircle className="w-5 h-5 text-green-500" />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
        <div>NIS: {nis}</div>
        <div>{kelas} - {jurusan}</div>
      </div>
      <button
        onClick={onRemove}
        className="mt-auto mt-3 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
        title="Hapus"
      >
        <Trash2 className="w-4 h-4" />
        Hapus
      </button>
    </div>
  );
}