// app/guru/calendar/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import CalendarGrid from "../../components/guru-components/calendar/CalendarGrid";
import DayDetailModal from "../../components/guru-components/calendar/DayDetailModal";
import MonthYearSelector from "../../components/guru-components/calendar/MonthYearSelector";
import KPISection from "../../components/guru-components/calendar/KPISection";

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

const pad = (n: number) => String(n).padStart(2, "0");
const localISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function GuruCalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [openDayISO, setOpenDayISO] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [daftarGuru, setDaftarGuru] = useState<{ id: number; nama_lengkap: string }[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<{ id: number; nama: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, guruRes, kelasRes] = await Promise.all([
          fetch("/api/guru/calendar"),
          fetch("/api/guru/calendar/guru"),
          fetch("/api/guru/calendar/kelas"),
        ]);
        if (!eventsRes.ok || !guruRes.ok || !kelasRes.ok) throw new Error("Gagal mengambil data");
        setEvents(await eventsRes.json());
        setDaftarGuru(await guruRes.json());
        setDaftarKelas(await kelasRes.json());
      } catch (error) {
        console.error("Error fetching ", error);
        setToastMsg("Gagal mengambil data dari server.");
        setTimeout(() => setToastMsg(null), 3000);
      }
    };
    fetchData();
  }, []);

  const monthEvents = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.date.replace(/-/g, "/"));
      return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
    });
  }, [cursor, events]);

  const monthLabel = cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const todayISO = localISO(new Date());
  const prevMonth = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const today = () => setCursor(new Date());
  const setMonthIndex = (mi: number) => setCursor(d => new Date(d.getFullYear(), mi, 1));
  const setYearValue = (y: number) => setCursor(d => new Date(y, d.getMonth(), 1));

  return (
    <div className="flex-1 px-4 py-6 min-h-screen w-full overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full rounded-lg border border-green-200 bg-green-50 text-green-900 shadow-lg dark:border-green-800 dark:bg-green-900/30 dark:text-green-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-green-500" />
              <div className="text-sm font-medium">{toastMsg}</div>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-xs text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white">✕</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-semibold">Kalender Guru</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Lihat agenda dan daftar hadir</p>
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
          <div className="rounded-xl border shadow-lg p-5 h-full flex flex-col border-sky-200 dark:border-gray-700 bg-sky-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi</h2>
            </div>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <p>• Anda hanya dapat melihat agenda.</p>
              <p>• Klik agenda untuk melihat detail.</p>
              <p>• Gunakan tombol <strong>"Lihat Daftar Hadir"</strong> untuk absensi.</p>
            </div>
          </div>
        </div>
      </section>

      <DayDetailModal
        isOpen={!!openDayISO}
        onClose={() => {
          setOpenDayISO(null);
          setActiveEventId(null);
        }}
        dayISO={openDayISO || ""}
        dayEvents={events.filter(e => e.date === openDayISO)}
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
        daftarGuru={daftarGuru}
        daftarKelas={daftarKelas}
      />
    </div>
  );
}