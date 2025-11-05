import { Calendar, Clock, MapPin, User, FileText } from "lucide-react";

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

type AgendaDetailProps = {
  agenda: Agenda;
  daftarGuru: { id: number; nama_lengkap: string }[];
  daftarKelas: { id: number; nama: string }[];
};

export default function AgendaDetail({
  agenda,
  daftarGuru,
  daftarKelas,
}: AgendaDetailProps) {
  const guru = daftarGuru.find((g) => g.id === agenda.id_guru)?.nama_lengkap || "Guru Tidak Diketahui";
  const kelas = daftarKelas.find((k) => k.id === agenda.id_kelas)?.nama || "Umum";

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6 text-gray-700 dark:text-gray-300">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{agenda.judul}</h1>
        {agenda.deskripsi && (
          <blockquote className="mt-2 text-lg italic text-gray-600 dark:text-gray-400 border-l-4 border-blue-500 pl-4">
            "{agenda.deskripsi}"
          </blockquote>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem icon={<Calendar className="w-6 h-6 text-blue-500" />} label="Tanggal" value={agenda.date} />
        {(agenda.time_start || agenda.time_end) && (
          <DetailItem
            icon={<Clock className="w-6 h-6 text-blue-500" />}
            label="Waktu"
            value={`${agenda.time_start || "-"} - ${agenda.time_end || "-"}`}
          />
        )}
        <DetailItem icon={<MapPin className="w-6 h-6 text-blue-500" />} label="Lokasi" value={agenda.lokasi || "Tidak ada lokasi"} />
        <DetailItem icon={<User className="w-6 h-6 text-blue-500" />} label="Guru/Pengurus" value={guru} />
        <DetailItem icon={<User className="w-6 h-6 text-green-500" />} label="Kelas" value={kelas} />
      </section>

      <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <DetailItem
          icon={<FileText className="w-6 h-6 text-green-500" />}
          label="Materi Utama"
          value={agenda.materi || "Tidak ada materi spesifik"}
          isPrimary
        />
      </section>

      {agenda.doc_path && (
        <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Lampiran Dokumen</h2>
          <a
            href={agenda.doc_path}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Lihat Dokumen
          </a>
        </section>
      )}
    </article>
  );
}

function DetailItem({
  icon,
  label,
  value,
  isPrimary = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isPrimary?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 pt-1">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`mt-1 ${isPrimary ? "text-lg font-semibold text-gray-900 dark:text-white" : "text-base"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
