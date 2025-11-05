// app/calendar/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import AddAgendaForm from "../../components/calendar/AddAgendaForm";
import DayDetailModal from "../../components/calendar/DayDetailModal";
import MonthYearSelector from "../../components/calendar/MonthYearSelector";
import KPISection from "../../components/calendar/KPISection";

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

const pad = (n: number) => String(n).padStart(2, "0");
const localISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [openDayISO, setOpenDayISO] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CalEvent | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [daftarGuru, setDaftarGuru] = useState<{ id: number; nama_lengkap: string }[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<{ id: number; nama: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, guruRes, kelasRes] = await Promise.all([
          fetch("/api/calendar"),
          fetch("/api/calendar/guru"),
          fetch("/api/calendar/kelas"),
        ]);
        if (!eventsRes.ok || !guruRes.ok || !kelasRes.ok) throw new Error("Gagal mengambil data");
        setEvents(await eventsRes.json());
        setDaftarGuru(await guruRes.json());
        setDaftarKelas(await kelasRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
        setToastMsg("Gagal mengambil data dari server.");
        setTimeout(() => setToastMsg(null), 3000);
      }
    };
    fetchData();
  }, []);

  const handleAddAgenda = async (formData: FormData) => {
    try {
      const res = await fetch("/api/calendar", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal menambahkan agenda");
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
      setToastMsg("Agenda berhasil ditambahkan.");
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error) {
      console.error("Error adding agenda:", error);
      setToastMsg("Gagal menambahkan agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleEditAgenda = async (id: string, updatedData: any) => {
    try {
      const formData = new FormData();
      formData.append("judul", updatedData.judul);
      formData.append("deskripsi", updatedData.deskripsi || "");
      formData.append("materi", updatedData.materi || "");
      formData.append("tanggal", updatedData.date);
      formData.append("jamMulai", updatedData.time_start || "");
      formData.append("jamSelesai", updatedData.time_end || "");
      formData.append("lokasi", updatedData.lokasi?.trim() || ""); // ✅ JANGAN kirim null
      formData.append("guruId", updatedData.id_guru.toString());
      if (updatedData.id_kelas != null) {
        formData.append("kelasId", updatedData.id_kelas.toString());
      }

      const res = await fetch(`/api/calendar/${id}`, { method: "PUT", body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error("Gagal memperbarui agenda");
      }
      const updatedEvent = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      setToastMsg("Agenda berhasil diperbarui.");
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error) {
      console.error("Error updating agenda:", error);
      setToastMsg("Gagal memperbarui agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus agenda");
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setToastMsg("Agenda berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error) {
      console.error("Error deleting agenda:", error);
      setToastMsg("Gagal menghapus agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleIsiAbsenKhusus = (ev: CalEvent) => {
    alert(`Isi Absen Khusus untuk: ${ev.judul} (${ev.date})`);
  };

  // ✅ Ambil events bulan ini untuk KPI
  const monthEvents = useMemo(
    () =>
      events.filter((e) => {
        const d = new Date(e.date.replace(/-/g, "/"));
        return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
      }),
    [cursor, events]
  );

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayISO = localISO(new Date());
  const prevMonth = () => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const today = () => setCursor(new Date());
  const setMonthIndex = (mi: number) => setCursor((d) => new Date(d.getFullYear(), mi, 1));
  const setYearValue = (y: number) => setCursor((d) => new Date(y, d.getMonth(), 1));

  return (
    <div className="flex-1 px-4 py-6 min-h-screen w-full overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-semibold">Kalender</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manajemen agenda dan kegiatan sekolah</p>
        </div>
        <MonthYearSelector
          cursor={cursor}
          setCursor={setCursor}
          yearValue={cursor.getFullYear()}
          setYearValue={setYearValue}
          monthIndex={cursor.getMonth()}
          setMonthIndex={setMonthIndex}
        />
      </div>

      {/* ✅ Kirim monthEvents, bukan hanya count */}
      <KPISection monthEvents={monthEvents} />

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CalendarGrid
            events={events}
            cursor={cursor}
            openDay={setOpenDayISO}
            todayISO={todayISO}
            monthLabel={monthLabel}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            today={today}
          />
        </div>
        <div className="lg:col-span-1">
          <AddAgendaForm
            onAdd={handleAddAgenda}
            daftarGuru={daftarGuru}
            daftarKelas={daftarKelas}
          />
        </div>
      </section>

      <DayDetailModal
        isOpen={!!openDayISO}
        onClose={() => {
          setOpenDayISO(null);
          setActiveEventId(null);
          setEditDraft(null);
        }}
        dayISO={openDayISO || ""}
        dayEvents={events.filter((e) => e.date === openDayISO)}
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
        editDraft={editDraft}
        setEditDraft={setEditDraft}
        onEdit={handleEditAgenda}
        onDelete={handleDeleteAgenda}
        onIsiAbsenKhusus={handleIsiAbsenKhusus}
        daftarGuru={daftarGuru}
        daftarKelas={daftarKelas}
      />
    </div>
  );
}