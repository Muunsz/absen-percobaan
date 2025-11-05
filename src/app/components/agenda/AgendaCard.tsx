// components/agenda/AgendaCard.tsx
import { Calendar, Clock, MapPin, User, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type Agenda = {
  id: string;
  date: string;
  judul: string;
  deskripsi?: string;
  materi?: string;
  time_start?: string;
  time_end?: string;
  lokasi?: string;
  id_guru: number;
  id_kelas?: number;
  doc_path?: string;
};

type AgendaCardProps = {
  agenda: Agenda;
  daftarGuru: { id: number; nama_lengkap: string }[];
  daftarKelas: { id: number; nama: string }[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AgendaCard({
  agenda,
  daftarGuru,
  daftarKelas,
  onView,
  onEdit,
  onDelete,
}: AgendaCardProps) {
  const guru = daftarGuru.find((g) => g.id === agenda.id_guru)?.nama_lengkap || "Guru Tidak Diketahui";
  const kelas = daftarKelas.find((k) => k.id === agenda.id_kelas)?.nama || "Umum";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agenda.judul}</h3>
        {agenda.deskripsi && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{agenda.deskripsi}</p>
        )}
        {agenda.materi && (
          <p className="text-sm text-blue-600 dark:text-blue-400">Materi: {agenda.materi}</p>
        )}
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{agenda.date}</span>
        </div>
        {(agenda.time_start || agenda.time_end) && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{agenda.time_start || "-"} - {agenda.time_end || "-"}</span>
          </div>
        )}
        {agenda.lokasi && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{agenda.lokasi}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{guru} • {kelas}</span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            onView(agenda.id);
          }}
          className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Eye className="w-3 h-3" /> Detail
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit(agenda.id);
          }}
          className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
        >
          <Edit className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(agenda.id);
          }}
          className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300"
        >
          <Trash2 className="w-3 h-3" /> Hapus
        </button>
      </div>
    </div>
  );
}