// app/agenda/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, User, FileText, Image, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

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

export default function AgendaDetailPage({ params }: { params: { id: string } }) {
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [daftarGuru, setDaftarGuru] = useState<{ id: number; nama_lengkap: string }[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<{ id: number; nama: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaRes, guruRes, kelasRes] = await Promise.all([
          fetch(`/api/agenda/${params.id}`),
          fetch("/api/agenda/guru"),
          fetch("/api/agenda/kelas"),
        ]);
        if (!agendaRes.ok) {
          if (agendaRes.status === 404) {
            router.push("/agenda");
            return;
          }
          throw new Error("Gagal mengambil data agenda");
        }
        if (!guruRes.ok || !kelasRes.ok) throw new Error("Gagal mengambil data referensi");
        setAgenda(await agendaRes.json());
        setDaftarGuru(await guruRes.json());
        setDaftarKelas(await kelasRes.json());
      } catch (error) {
        console.error("Error fetching ", error);
        router.push("/agenda");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;
    try {
      const res = await fetch(`/api/agenda/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus agenda");
      setToastMsg("Agenda berhasil dihapus.");
      setTimeout(() => {
        router.push("/agenda");
      }, 2000);
    } catch (error) {
      setToastMsg("Gagal menghapus agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleEdit = () => {
    router.push(`/agenda/edit/${params.id}`);
  };

  const handleIsiAbsenKhusus = () => {
    alert(`Isi Absen Khusus untuk agenda: ${agenda?.judul} (${agenda?.date})`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-700 dark:text-gray-300">Memuat detail agenda...</div>
      </div>
    );
  }

  if (!agenda) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-red-600 dark:text-red-400">Agenda tidak ditemukan</div>
      </div>
    );
  }

  const guru = daftarGuru.find((g) => g.id === agenda.id_guru)?.nama_lengkap || "Guru Tidak Diketahui";
  const kelas = daftarKelas.find((k) => k.id === agenda.id_kelas)?.nama || "Umum";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full rounded-lg border border-green-200 bg-green-50 text-green-900 shadow-lg dark:border-green-800 dark:bg-green-900/30 dark:text-green-200 animate-fade-in"
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-green-500" />
              <div className="text-sm font-medium">{toastMsg}</div>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-xs text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white"
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <Link href="/agenda" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4">
              ← Kembali ke Daftar Agenda
            </Link>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-semibold">{agenda.judul}</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{agenda.deskripsi || "Tidak ada deskripsi"}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-lg"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-red-600 hover:bg-red-500 text-white font-medium shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
            <button
              onClick={handleIsiAbsenKhusus}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-green-600 hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg"
            >
              <User className="w-4 h-4" />
              Isi Absen Khusus
            </button>
          </div>
        </div>
        {/* Detail Agenda */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informasi Agenda</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tanggal</div>
                    <div className="font-medium text-gray-900 dark:text-white">{agenda.date}</div>
                  </div>
                </div>
                {(agenda.time_start || agenda.time_end) && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Waktu</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {agenda.time_start || "-"} - {agenda.time_end || "-"}
                      </div>
                    </div>
                  </div>
                )}
                {agenda.lokasi && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lokasi</div>
                      <div className="font-medium text-gray-900 dark:text-white">{agenda.lokasi}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Guru</div>
                    <div className="font-medium text-gray-900 dark:text-white">{guru}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Kelas</div>
                    <div className="font-medium text-gray-900 dark:text-white">{kelas}</div>
                  </div>
                </div>
                {agenda.materi && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Materi</div>
                      <div className="font-medium text-gray-900 dark:text-white">{agenda.materi}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Lampiran */}
            {agenda.doc_path && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lampiran</h2>
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(agenda.doc_path) ? (
                  <div className="space-y-3">
                    <Image className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <img
                      src={agenda.doc_path}
                      alt="Lampiran"
                      className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <a
                      href={agenda.doc_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {agenda.doc_path}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Sidebar Aksi */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
              <div className="space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit Agenda
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors bg-red-600 hover:bg-red-500 text-white font-medium shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Agenda
                </button>
                <button
                  onClick={handleIsiAbsenKhusus}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors bg-green-600 hover:bg-green-500 text-white font-medium shadow-md hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  Isi Absen Khusus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}