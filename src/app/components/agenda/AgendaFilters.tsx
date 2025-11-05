import { useState, useEffect } from "react";

type AgendaFiltersProps = {
  onFilterChange: (filters: {
    year: number;
    month: number | null;
    kelasId: number | null;
    guruId: number | null;
  }) => void;
  daftarKelas: { id: number; nama: string }[];
  daftarGuru: { id: number; nama_lengkap: string }[];
};

export default function AgendaFilters({ onFilterChange, daftarKelas, daftarGuru }: AgendaFiltersProps) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState<number | null>(null);
  const [kelasId, setKelasId] = useState<number | null>(null);
  const [guruId, setGuruId] = useState<number | null>(null);

  useEffect(() => {
    onFilterChange({ year, month, kelasId, guruId });
  }, [year, month, kelasId, guruId, onFilterChange]);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleString("id-ID", { month: "long" })
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Filter Agenda</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tahun</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Bulan</span>
            <select
              value={month ?? ""}
              onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            >
              <option value="" className="bg-white dark:bg-gray-800">Semua Bulan</option>
              {monthNames.map((name, index) => (
                <option key={name} value={index} className="bg-white dark:bg-gray-800">
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Kelas</span>
            <select
              value={kelasId ?? ""}
              onChange={(e) =>
                setKelasId(e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            >
              <option value="" className="bg-white dark:bg-gray-800">Semua Kelas</option>
              {daftarKelas.map((k) => (
                <option key={k.id} value={k.id} className="bg-white dark:bg-gray-800">
                  {k.nama}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Guru</span>
            <select
              value={guruId ?? ""}
              onChange={(e) =>
                setGuruId(e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            >
              <option value="" className="bg-white dark:bg-gray-800">Semua Guru</option>
              {daftarGuru.map((g) => (
                <option key={g.id} value={g.id} className="bg-white dark:bg-gray-800">
                  {g.nama_lengkap}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}