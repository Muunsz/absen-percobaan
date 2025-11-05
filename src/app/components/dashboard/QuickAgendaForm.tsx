// Sama seperti sebelumnya
"use client"

import { useState } from "react"

export default function QuickAgendaForm() {
  const [judul, setJudul] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [kelas, setKelas] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [waktuMulai, setWaktuMulai] = useState("")
  const [waktuSelesai, setWaktuSelesai] = useState("")
  const [lokasi, setLokasi] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as any).randomUUID()
        : `e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const newEvent = {
      id,
      date: tanggal,
      title: judul.trim(),
      description: deskripsi.trim() || undefined,
      kelas: kelas.trim() || undefined,
      jamMulai: waktuMulai || undefined,
      jamSelesai: waktuSelesai || undefined,
      lokasi: lokasi.trim() || undefined,
      status: "aktif" as const,
      wajibHadir: false,
    }

    try {
      const raw = localStorage.getItem("dummy_events")
      const list = raw ? (JSON.parse(raw) as any[]) : []
      list.push(newEvent)
      localStorage.setItem("dummy_events", JSON.stringify(list))
      if (tanggal) {
        localStorage.setItem("dummy_last_added_date", tanggal)
      }
      window.dispatchEvent(new Event("dummy-agenda-updated"))
    } catch {
      // no-op for dummy mode
    }

    alert("Dummy: Agenda tersimpan dan akan tampil di Kalender.")
    setJudul("")
    setTanggal("")
    setKelas("")
    setDeskripsi("")
    setWaktuMulai("")
    setWaktuSelesai("")
    setLokasi("")
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-gray-700 dark:text-gray-300 text-sm">Input Agenda Cepat</h2>
      <form onSubmit={submit} className="mt-3 space-y-3 text-sm">
        <div>
          <label className="text-gray-500 dark:text-gray-400 text-xs">Judul</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
            placeholder="Contoh: Rapat Guru"
            required
          />
        </div>
        <div>
          <label className="text-gray-500 dark:text-gray-400 text-xs">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
            placeholder="Keterangan singkat agenda (opsional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-500 dark:text-gray-400 text-xs">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="text-gray-500 dark:text-gray-400 text-xs">Kelas</label>
            <input
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
              placeholder="Mis. X RPL / -"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-500 dark:text-gray-400 text-xs">Waktu Mulai</label>
            <input
              type="time"
              value={waktuMulai}
              onChange={(e) => setWaktuMulai(e.target.value)}
              className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="text-gray-500 dark:text-gray-400 text-xs">Waktu Selesai</label>
            <input
              type="time"
              value={waktuSelesai}
              onChange={(e) => setWaktuSelesai(e.target.value)}
              className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
        <div>
          <label className="text-gray-500 dark:text-gray-400 text-xs">Lokasi</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="mt-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
            placeholder="R. Rapat / Aula (opsional)"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 text-sm transition-colors"
        >
          Simpan (Dummy)
        </button>
      </form>
    </section>
  )
} 