"use client";
import { BookOpen, Clock } from "lucide-react";

type AgendaItem = {
  id: string;
  title: string;
  kelas: string;
  mapel: string;
  date: string;
  description?: string;
};

type MonthlyAgendaListProps = {
  agendas: AgendaItem[];
  onRefresh: () => void;
};

export default function MonthlyAgendaList({ agendas, onRefresh }: MonthlyAgendaListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Agenda Khusus Bulan Ini
        </h2>
        <button onClick={onRefresh} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Clock className="h-5 w-5" />
        </button>
      </div>
      {agendas.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {agendas.map((agenda) => (
            <div key={agenda.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="font-medium text-gray-900 dark:text-white">{agenda.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{agenda.mapel} • {agenda.kelas}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tanggal: {new Date(agenda.date).toLocaleDateString("id-ID")}
              </p>
              {agenda.description && (
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{agenda.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Tidak ada agenda khusus bulan ini.
        </p>
      )}
    </div>
  );
}