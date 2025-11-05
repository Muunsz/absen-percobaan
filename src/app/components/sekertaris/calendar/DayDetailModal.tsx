"use client";
import Link from "next/link";

type Event = {
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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dayISO: string;
  dayEvents: Event[];
  activeEventId: string | null;
  setActiveEventId: (id: string) => void;
  daftarGuru: { id: number; nama_lengkap: string }[];
  daftarKelas: { id: number; nama: string }[];
};

export default function DayDetailModal({
  isOpen,
  onClose,
  dayISO,
  dayEvents,
  activeEventId,
  setActiveEventId,
  daftarGuru,
  daftarKelas,
}: Props) {
  if (!isOpen) return null;

  const activeEvent = activeEventId ? dayEvents.find(e => e.id === activeEventId) || null : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative rounded-xl border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tanggal</div>
            <div className="font-semibold text-lg text-gray-900 dark:text-white">{dayISO}</div>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600">
            Tutup
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <div className="font-semibold text-gray-900 dark:text-white text-lg">Agenda</div>
            {dayEvents.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">Belum ada agenda.</div>
            )}
            {dayEvents.map(ev => (
              <button
                key={ev.id}
                onClick={() => setActiveEventId(ev.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  activeEventId === ev.id ? "bg-blue-50 border-blue-500 dark:bg-gray-700" : ""
                } border-gray-200 dark:border-gray-600`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{ev.judul}</div>
                {ev.materi && (
                  <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">Materi: {ev.materi}</div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0">
            {!activeEvent && (
              <div className="text-sm text-gray-500 dark:text-gray-400">Pilih agenda untuk melihat detail.</div>
            )}
            {activeEvent && (
              <div className="space-y-5">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Judul</div>
                  <div className="font-semibold text-xl text-gray-900 dark:text-white">{activeEvent.judul}</div>
                </div>
                {activeEvent.deskripsi && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Deskripsi</div>
                    <div className="text-sm mt-1 text-gray-800 dark:text-gray-300">{activeEvent.deskripsi}</div>
                  </div>
                )}
                {activeEvent.materi && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Materi: <span className="font-medium text-gray-900 dark:text-white">{activeEvent.materi}</span>
                  </div>
                )}
                {activeEvent.id_guru && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Guru: <span className="font-medium text-gray-900 dark:text-white">
                      {daftarGuru.find(g => g.id === activeEvent.id_guru)?.nama_lengkap || "Guru Tidak Diketahui"}
                    </span>
                  </div>
                )}
                {activeEvent.id_kelas && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Kelas: <span className="font-medium text-gray-900 dark:text-white">
                      {daftarKelas.find(k => k.id === activeEvent.id_kelas)?.nama || "Kelas Tidak Diketahui"}
                    </span>
                  </div>
                )}
                {(activeEvent.time_start || activeEvent.time_end) && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Waktu: <span className="font-medium text-gray-900 dark:text-white ml-2">
                      {activeEvent.time_start || "-"} - {activeEvent.time_end || "-"}
                    </span>
                  </div>
                )}
                {activeEvent.lokasi && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Lokasi: <span className="font-medium text-gray-900 dark:text-white">{activeEvent.lokasi}</span>
                  </div>
                )}
                {activeEvent.doc_path && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Lampiran:
                    <div className="mt-2">
                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(activeEvent.doc_path) ? (
                        <img src={activeEvent.doc_path} alt="Lampiran" className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600" />
                      ) : (
                        <a href={activeEvent.doc_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                          {activeEvent.doc_path}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <Link href="/sekretaris/isi-absensi" className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md block text-center">
                    Isi Absensi Kelas
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}