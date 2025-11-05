// components/calendar/DayDetailModal.tsx
"use client";
import { useState } from "react";

type CalEvent = {
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

type DayDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dayISO: string;
  dayEvents: CalEvent[];
  activeEventId: string | null;
  setActiveEventId: React.Dispatch<React.SetStateAction<string | null>>;
  editDraft: CalEvent | null;
  setEditDraft: React.Dispatch<React.SetStateAction<CalEvent | null>>;
  onEdit: (id: string, updatedData: any) => void;
  onDelete: (id: string) => void;
  onIsiAbsenKhusus: (event: CalEvent) => void;
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
  editDraft,
  setEditDraft,
  onEdit,
  onDelete,
  onIsiAbsenKhusus,
  daftarGuru,
  daftarKelas,
}: DayDetailModalProps) {
  if (!isOpen) return null;

  const activeEvent = activeEventId
    ? dayEvents.find((e) => e.id === activeEventId) || null
    : null;

  const handleSaveEdit = () => {
    if (!editDraft) return;
    onEdit(editDraft.id, editDraft); // Kirim ID dan data baru
    setEditDraft(null);
  };

  const handleCancelEdit = () => {
    setEditDraft(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail agenda ${dayISO}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className="relative rounded-xl border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tanggal
            </div>
            <div className="font-semibold text-lg text-gray-900 dark:text-white">
              {dayISO}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
            aria-label="Tutup"
          >
            Tutup
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <div className="font-semibold text-gray-900 dark:text-white text-lg">
              Agenda
            </div>
            {dayEvents.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada agenda.
              </div>
            )}
            {dayEvents.map((ev) => {
              return (
                <button
                  key={ev.id}
                  onClick={() => {
                    setActiveEventId(ev.id);
                    setEditDraft(null);
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    activeEventId === ev.id
                      ? "bg-blue-50 border-blue-500 dark:bg-gray-700"
                      : ""
                  } border-gray-200 dark:border-gray-600`}
                  title="Lihat detail"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {ev.judul}
                  </div>
                  {ev.materi && (
                    <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      Materi: {ev.materi}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0">
            {!activeEvent && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pilih agenda untuk melihat detail.
              </div>
            )}
            {activeEvent && !editDraft && (
              <div className="space-y-5">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Judul
                  </div>
                  <div className="font-semibold text-xl text-gray-900 dark:text-white">
                    {activeEvent.judul}
                  </div>
                </div>
                {activeEvent.deskripsi && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Deskripsi
                    </div>
                    <div className="text-sm mt-1 text-gray-800 dark:text-gray-300">
                      {activeEvent.deskripsi}
                    </div>
                  </div>
                )}
                {activeEvent.materi && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Materi:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activeEvent.materi}
                    </span>
                  </div>
                )}
                {activeEvent.id_guru && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Guru:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {daftarGuru.find((g) => g.id === activeEvent.id_guru)
                        ?.nama_lengkap || "Guru Tidak Diketahui"}
                    </span>
                  </div>
                )}
                {activeEvent.id_kelas && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Kelas:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {daftarKelas.find((k) => k.id === activeEvent.id_kelas)
                        ?.nama || "Kelas Tidak Diketahui"}
                    </span>
                  </div>
                )}
                {(activeEvent.time_start || activeEvent.time_end) && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Waktu:
                    <span className="font-medium text-gray-900 dark:text-white ml-2">
                      {activeEvent.time_start || "-"} -{" "}
                      {activeEvent.time_end || "-"}
                    </span>
                  </div>
                )}
                {activeEvent.lokasi && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Lokasi:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activeEvent.lokasi}
                    </span>
                  </div>
                )}
                {activeEvent.doc_path && (
                  <div className="text-sm text-gray-800 dark:text-gray-300">
                    Lampiran:
                    <div className="mt-2">
                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                        activeEvent.doc_path
                      ) ? (
                        <img
                          src={activeEvent.doc_path}
                          alt="Lampiran"
                          className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                        />
                      ) : (
                        <a
                          href={activeEvent.doc_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {activeEvent.doc_path}
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={() => setEditDraft({ ...activeEvent })}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus agenda ini?")) {
                        onDelete(activeEvent.id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => (window.location.href = "/admin/absensi")}
                    className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
                  >
                    Isi Absen Khusus
                  </button>
                </div>
              </div>
            )}
            {editDraft && (
              <div className="space-y-4">
                <div className="font-semibold text-xl text-gray-900 dark:text-white">
                  Edit Agenda
                </div>
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Judul
                  </span>
                  <input
                    className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                    value={editDraft.judul}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, judul: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Deskripsi
                  </span>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                    value={editDraft.deskripsi || ""}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, deskripsi: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Materi
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                    value={editDraft.materi || ""}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, materi: e.target.value })
                    }
                  />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tanggal
                    </span>
                    <input
                      type="date"
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                      value={editDraft.date}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, date: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Jam Mulai
                    </span>
                    <input
                      type="time"
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                      value={editDraft.time_start || ""}
                      onChange={(e) =>
                        setEditDraft({
                          ...editDraft,
                          time_start: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Jam Selesai
                    </span>
                    <input
                      type="time"
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                      value={editDraft.time_end || ""}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, time_end: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Lokasi
                    </span>
                    <input
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                      value={editDraft.lokasi || ""}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, lokasi: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Guru / Pengurus
                    </span>
                    <select
                      value={editDraft.id_guru}
                      onChange={(e) =>
                        setEditDraft({
                          ...editDraft,
                          id_guru: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                      required
                    >
                      <option value="" className="bg-white dark:bg-gray-800">
                        Pilih Guru
                      </option>
                      {daftarGuru.map((g) => (
                        <option
                          key={g.id}
                          value={g.id}
                          className="bg-white dark:bg-gray-800"
                        >
                          {g.nama_lengkap}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Kelas
                    </span>
                    <select
                      value={editDraft.id_kelas || ""}
                      onChange={(e) =>
                        setEditDraft({
                          ...editDraft,
                          id_kelas:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                    >
                      <option value="" className="bg-white dark:bg-gray-800">
                        Pilih Kelas
                      </option>
                      {daftarKelas.map((k) => (
                        <option
                          key={k.id}
                          value={k.id}
                          className="bg-white dark:bg-gray-800"
                        >
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
