"use client"

import { type GuruAgenda, type GuruMapelData, today, type AgendaFormSubmitData } from "@/lib/agenda-guru-utils"
import { AlertTriangle, Check, Loader2, Upload, X } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

interface AgendaGuruModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (data: AgendaFormSubmitData) => Promise<void>
  isSubmitting: boolean
  initialData: GuruAgenda | null
  guruMapelData?: GuruMapelData[]
}

export default function AgendaGuruModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  guruMapelData = [],
}: AgendaGuruModalProps) {
  const [formData, setFormData] = useState<AgendaFormSubmitData>({
    tanggal: today,
    namaGuru: "",
    jamMulai: "",
    jamSelesai: "",
    namaMapel: "",
    kelas: "",
    materi: "",
    keterangan: "",
  })
  const [file, setFile] = useState<File | undefined>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (show) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          tanggal: initialData.tanggal,
          namaGuru: initialData.namaGuru,
          jamMulai: initialData.jamMulai,
          jamSelesai: initialData.jamSelesai,
          namaMapel: initialData.namaMapel,
          kelas: initialData.kelas,
          materi: initialData.materi,
          keterangan: initialData.keterangan,
        })
      } else {
        setFormData({
          tanggal: today,
          namaGuru: "",
          jamMulai: "",
          jamSelesai: "",
          namaMapel: "",
          kelas: "",
          materi: "",
          keterangan: "",
        })
      }
      setFile(undefined)
      setError(null)
    }
  }, [show, initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { tanggal, namaGuru, jamMulai, jamSelesai, namaMapel, kelas, materi } = formData
    if (!tanggal || !namaGuru || !jamMulai || !jamSelesai || !namaMapel || !kelas || !materi) {
      setError("Mohon isi semua field yang diperlukan (ditandai *).")
      return
    }

    if (jamMulai >= jamSelesai) {
      setError("Jam Mulai harus lebih awal dari Jam Selesai.")
      return
    }
    setError(null)
    onSubmit({ ...formData, file })
  }

  if (!show) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100 opacity-100 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? "Edit Agenda" : "Tambah Agenda Baru"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Tutup"
                disabled={isSubmitting}
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                  <AlertTriangle className="size-4" />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    readOnly={!!initialData}
                    className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold ${initialData ? "cursor-not-allowed" : "cursor-default"} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Guru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaGuru"
                    value={formData.namaGuru}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama guru"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="XII RPL 1">XII RPL 1</option>
                    <option value="XII RPL 2">XII RPL 2</option>
                    <option value="XII RPL 3">XII RPL 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="namaMapel"
                    value={formData.namaMapel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Pilih Mata Pelajaran</option>
                    {guruMapelData.length > 0 ? (
                      guruMapelData.map((mapel) => (
                        <option key={mapel.id} value={mapel.namaMapel}>
                          {mapel.namaMapel}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="PBO">PBO</option>
                        <option value="MPP">MPP</option>
                        <option value="Basis Data">Basis Data</option>
                        <option value="Jaringan Komputer">Jaringan Komputer</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jam Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="jamMulai"
                    value={formData.jamMulai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jam Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="jamSelesai"
                    value={formData.jamSelesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Materi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="materi"
                    value={formData.materi}
                    onChange={handleInputChange}
                    placeholder="Masukkan materi pembelajaran"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dokumentasi (File Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                      <span className="truncate pr-2 text-sm">{file ? file.name : "Pilih file dokumentasi"}</span>
                      <Upload className="size-4 shrink-0 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keterangan (Opsional)
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Masukkan keterangan tambahan untuk siswa (NAMA SISWA - SAKIT, IJIN, ALFA)"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end rounded-b-xl sticky bottom-0 bg-white dark:bg-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition-all shadow-md hover:shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Simpan Agenda"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
