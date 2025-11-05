import React, { useState, useMemo } from "react"
import { CalendarDays, XIcon } from "lucide-react"
import { ThemedCard } from "./ThemedCard"

export function DateRangePicker({ selectedDates, onAddDate, onAddRange, onClearDates, onAddToday, onRemoveDate, }: {
    selectedDates: string[],
    onAddDate: (d: string) => void,
    onRemoveDate: (d: string) => void,
    onAddRange: (start: string, end: string) => void,
    onClearDates: () => void,
    onAddToday: () => void,
}) {
    const [singleDate, setSingleDate] = useState("")
    const [rangeStart, setRangeStart] = useState("")
    const [rangeEnd, setRangeEnd] = useState("")
    const sortedDates = useMemo(() => selectedDates.slice().sort(), [selectedDates])
  
    const handleAddSingleDate = () => {
      if (singleDate) {
        onAddDate(singleDate)
        setSingleDate("")
      }
    }
  
    const handleAddRange = () => {
      if (rangeStart && rangeEnd) {
        onAddRange(rangeStart, rangeEnd)
        setRangeStart("")
        setRangeEnd("")
      }
    }
  
    return (
      <ThemedCard className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4 font-semibold border-b border-gray-100 dark:border-gray-700/50 pb-2">
          <CalendarDays className="size-4" /> Pilih Rentang Tanggal Rekap
        </div>
  
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
          {sortedDates.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400 text-sm italic">Belum ada tanggal dipilih.</span>
          ) : (
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {new Date(sortedDates[0]).toLocaleDateString("id-ID")} -{" "}
              {new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString("id-ID")}
              <span className="text-xs opacity-80 text-gray-600 dark:text-gray-400 ml-2">
                (Total: **{sortedDates.length} hari**)
              </span>
            </div>
          )}
          {sortedDates.length > 0 && (
              <button 
                  onClick={onClearDates}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 mt-2 sm:mt-0 flex items-center gap-1"
              >
                  <XIcon className="size-3" /> Bersihkan
              </button>
          )}
        </div>
  
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Tambah Tanggal Tunggal</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleAddSingleDate}
                disabled={!singleDate || selectedDates.includes(singleDate)}
                className="rounded-md bg-blue-600 px-3 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Tambah
              </button>
            </div>
          </div>
  
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Tambah Rentang Tanggal</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white text-sm"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">s/d</span>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleAddRange}
                disabled={!rangeStart || !rangeEnd || new Date(rangeStart) > new Date(rangeEnd)}
                className="rounded-md bg-blue-600 px-3 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Rentang
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 opacity-0">Action</label>
            <button
              onClick={onAddToday}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <CalendarDays className="size-4" /> Tambah Hari Ini
            </button>
          </div>
        </div>
      </ThemedCard>
    )
  }