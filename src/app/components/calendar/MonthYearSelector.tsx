// components/calendar/MonthYearSelector.tsx
"use client";

import { useState, useEffect } from "react";

type MonthYearSelectorProps = {
  cursor: Date;
  setCursor: React.Dispatch<React.SetStateAction<Date>>;
  yearValue: number;
  setYearValue: (y: number) => void;
  monthIndex: number;
  setMonthIndex: (mi: number) => void;
};

export default function MonthYearSelector({
  cursor,
  setCursor,
  yearValue,
  setYearValue,
  monthIndex,
  setMonthIndex,
}: MonthYearSelectorProps) {
  const [localYear, setLocalYear] = useState(yearValue);
  const monthNames = Array.from(
    { length: 12 },
    (_, i) => new Date(2000, i, 1).toLocaleString(undefined, { month: "long" })
  );

  useEffect(() => {
    setLocalYear(yearValue);
  }, [yearValue]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!Number.isNaN(v)) {
      setLocalYear(v);
      setYearValue(v);
    }
  };

  const handleYearDown = () => {
    setYearValue(yearValue - 1);
  };

  const handleYearUp = () => {
    setYearValue(yearValue + 1);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthIndex(Number(e.target.value));
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Bulan</label>
        <select
          className="w-full text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          value={monthIndex}
          onChange={handleMonthChange}
          aria-label="Pilih bulan"
        >
          {monthNames.map((m, i) => (
            <option key={m} value={i} className="bg-white dark:bg-gray-800">
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Tahun</label>
        <div className="flex items-center gap-2">
          <button
            onClick={handleYearDown}
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
            aria-label="Tahun sebelumnya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
              <path d="M4.646 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
            </svg>
          </button>
          <input
            type="number"
            value={localYear}
            onChange={handleYearChange}
            className="w-20 text-center rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
            aria-label="Tahun"
          />
          <button
            onClick={handleYearUp}
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
            aria-label="Tahun berikutnya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 11.354a.5.5 0 0 1 .708 0l6-6a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0z"/>
              <path d="M11.354 11.354a.5.5 0 0 1 .708 0l6-6a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}