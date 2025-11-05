// components/calendar/CalendarGrid.tsx
"use client";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

type CalendarGridProps = {
  events: CalEvent[];
  cursor: Date;
  openDay: (iso: string) => void;
  todayISO: string;
  monthLabel: string;
  prevMonth: () => void;
  nextMonth: () => void;
  today: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");
const localISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export default function CalendarGrid({
  events,
  cursor,
  openDay,
  todayISO,
  monthLabel,
  prevMonth,
  nextMonth,
  today,
}: CalendarGridProps) {
  const { days } = useMemo(() => {
    const start = startOfMonth(cursor);
    const dayOfWeek = start.getDay(); // 0 = Sunday
    const startDay = new Date(start);
    startDay.setDate(start.getDate() - dayOfWeek); // Align to Sunday

    const totalCells = 42; // 6 weeks
    const cells = Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      const iso = localISO(d);
      return {
        dateObj: d,
        iso,
        inMonth: d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear(),
        events: events.filter((e) => e.date === iso),
      };
    });
    return { days: cells };
  }, [cursor, events]);

  return (
    <div className="rounded-xl border shadow-lg overflow-hidden h-full flex flex-col border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <span className="font-semibold text-lg text-gray-900 dark:text-white">{monthLabel}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
          <button
            onClick={today}
            className="rounded-lg px-4 py-2 text-sm transition-colors bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Hari Ini
          </button>
          <button
            onClick={nextMonth}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 py-3 uppercase tracking-wider">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px flex-grow bg-gray-200 dark:bg-gray-700">
        {days.map((d) => {
          const isToday = d.iso === todayISO;
          const hasEvents = d.events.length > 0;
          const isCurrentMonth = d.inMonth;

          return (
            <button
              key={d.iso}
              type="button"
              onClick={() => openDay(d.iso)}
              className={`
                p-3 transition-all duration-200 relative
                ${isCurrentMonth ? "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800" : "bg-gray-100 dark:bg-gray-800 opacity-60"}
                ${isToday ? "ring-2 ring-green-400 dark:ring-green-600 rounded-md" : ""}
                min-h-[100px] sm:min-h-[120px] flex flex-col
                text-left
              `}
              aria-current={isToday ? "date" : undefined}
              title={hasEvents ? `Lihat detail agenda` : "Lihat hari ini"}
            >
              {/* Day Number */}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white text-xs"
                      : isCurrentMonth
                      ? "text-gray-900 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {d.dateObj.getDate()}
                </span>
              </div>

              {/* Events Preview */}
              <div className="space-y-1 flex-grow overflow-hidden">
                {d.events.slice(0, 2).map((e) => {
                  const badge = e.materi
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
                  return (
                    <div
                      key={e.id}
                      className={`text-xs truncate px-2 py-1 rounded ${badge}`}
                      title={e.judul}
                    >
                      {e.judul}
                    </div>
                  );
                })}
                {d.events.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    +{d.events.length - 2} lainnya
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}