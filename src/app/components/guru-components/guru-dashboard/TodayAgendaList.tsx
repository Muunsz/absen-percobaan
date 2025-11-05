"use client";
import { Calendar, Clock } from "lucide-react";

type AgendaItem = {
  id: string;
  title: string;
  kelas: string;
  mapel: string;
  description?: string;
  status: "aktif";
};

type TodayAgendaListProps = {
  agendas: AgendaItem[];
  onRefresh: () => void;
};

export default function TodayAgendaList({ agendas, onRefresh }: TodayAgendaListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda Kelas Saya (Bulan Ini)
        </h2>
        <button onClick={onRefresh} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Clock className="h-5 w-5" />
        </button>
      </div>
      {agendas.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {agendas.map((agenda) => (
            <div key={agenda.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-gray-900 dark:text-white">{agenda.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{agenda.mapel} • {agenda.kelas}</p>
              {agenda.description && (
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{agenda.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Anda belum mengisi agenda kelas bulan ini.
        </p>
      )}
    </div>
  );
}