// app/agenda/tambah/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import AddAgendaForm from "../../../components/calendar/AddAgendaForm";

export default function TambahAgendaPage() {
  const [daftarGuru, setDaftarGuru] = useState<{ id: number; nama_lengkap: string }[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<{ id: number; nama: string }[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const router = useRouter();

  // Fetch daftar guru dan kelas dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guruRes, kelasRes] = await Promise.all([
          fetch("/api/agenda/guru"),
          fetch("/api/kelas"),
        ]);

        if (!guruRes.ok || !kelasRes.ok) throw new Error("Gagal mengambil data");

        setDaftarGuru(await guruRes.json());
        setDaftarKelas(await kelasRes.json());
      } catch (error) {
        console.error("Error fetching ", error);
      }
    };

    fetchData();
  }, []);

  const handleAddAgenda = async (formData: FormData) => {
    try {
      const res = await fetch("/api/agenda", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambahkan agenda");
      const newAgenda = await res.json();
      setToastMsg("Agenda berhasil ditambahkan.");
      setTimeout(() => {
        router.push(`/agenda/${newAgenda.id}`);
      }, 2000);
    } catch (error) {
      setToastMsg("Gagal menambahkan agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

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
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-semibold">Tambah Agenda</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Isi form untuk menambahkan agenda baru</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <AddAgendaForm
            onAdd={handleAddAgenda}
            daftarGuru={daftarGuru}
            daftarKelas={daftarKelas}
          />
        </div>
      </div>
    </div>
  );
}