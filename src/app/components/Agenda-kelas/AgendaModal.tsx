import {
    AgendaFormSubmitData,
    GuruMapelData,
    KelasAgenda,
    today,
} from "@/lib/agenda-kelas-page-utils"
import {
    AlertTriangle,
    Check,
    Loader2,
    Search,
    Upload,
    X,
} from "lucide-react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface AgendaModalProps {
    show: boolean
    onClose: () => void
    onSubmit: (data: AgendaFormSubmitData) => void
    isSubmitting: boolean
    guruMapelData: GuruMapelData[]
    initialData: KelasAgenda | null
}

export default function AgendaModal({ show, onClose, onSubmit, isSubmitting, guruMapelData, initialData }: AgendaModalProps) {
    const [formData, setFormData] = useState<Omit<AgendaFormSubmitData, 'file' | 'id'>>({
        tanggal: today,
        namaGuru: "",
        jamMulai: "",
        jamSelesai: "",
        namaMapel: "",
        materi: "",
        keterangan: "",
    })
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const guruInputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (show) {
            if (initialData) {
                setFormData({
                    tanggal: initialData.tanggal,
                    namaGuru: initialData.namaGuru,
                    jamMulai: initialData.jamMulai,
                    jamSelesai: initialData.jamSelesai,
                    namaMapel: initialData.namaMapel,
                    materi: initialData.materi,
                    keterangan: initialData.keterangan,
                })
                setSearchTerm(initialData.namaGuru)
            } else {
                setFormData({
                    tanggal: today,
                    namaGuru: "",
                    jamMulai: "",
                    jamSelesai: "",
                    namaMapel: "",
                    materi: "",
                    keterangan: "",
                })
                setSearchTerm("")
            }
            setFile(null)
            setError(null)
        }
    }, [show, initialData])

    const handleGuruSelect = (selectedGuru: string, selectedMapel: string) => {
        setSearchTerm(selectedGuru)
        setFormData((prev) => ({ ...prev, namaGuru: selectedGuru, namaMapel: selectedMapel }))
        setShowSuggestions(false)
        if (guruInputRef.current) {
            guruInputRef.current.focus()
        }
    }

    const handleGuruInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setFormData((prev) => ({ ...prev, namaGuru: value, namaMapel: "" }))
        setShowSuggestions(true)
    }

    const filteredSuggestions = useMemo(() => {
        if (!searchTerm) return guruMapelData.slice(0, 10)
        return guruMapelData.filter((guru) => guru.namaGuru.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)
    }, [searchTerm, guruMapelData])

    const handleInputBlur = useCallback(() => {
        setTimeout(() => {
            if (suggestionsRef.current && suggestionsRef.current.contains(document.activeElement)) {
                return
            }
            setShowSuggestions(false)
            const matchedGuru = guruMapelData.find((g) => g.namaGuru.toLowerCase() === searchTerm.toLowerCase())
            if (matchedGuru) {
                setFormData((prev) => ({ ...prev, namaGuru: matchedGuru.namaGuru, namaMapel: matchedGuru.namaMapel }))
            } else if (searchTerm) {
                setFormData((prev) => ({ ...prev, namaGuru: searchTerm, namaMapel: "" }))
            } else {
                setFormData((prev) => ({ ...prev, namaGuru: "", namaMapel: "" }))
            }
        }, 100)
    }, [searchTerm, guruMapelData])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const { tanggal, namaGuru, jamMulai, jamSelesai, namaMapel, materi } = formData
        if (!tanggal || !namaGuru || !jamMulai || !jamSelesai || !namaMapel || !materi) {
            setError("Mohon isi semua field yang diperlukan (ditandai *).")
            return
        }

        const isGuruMapelValid = guruMapelData.some((g) => g.namaGuru === namaGuru && g.namaMapel === namaMapel)
        if (!isGuruMapelValid && namaMapel === "") {
            setError("Nama Guru harus dipilih dari daftar saran agar Mata Pelajaran sesuai.")
            return
        }

        if (jamMulai >= jamSelesai) {
            setError("Jam Mulai harus lebih awal dari Jam Selesai.")
            return
        }
        setError(null)
        onSubmit({ ...formData, file, id: initialData?.id })
    }

    if (!show) return null

    return (
        <>
            {/* Backdrop: onClick={onClose} untuk menutup modal saat klik di luar */}
            <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} aria-hidden="true" />
            
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100 opacity-100 my-8" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sticky top-0 bg-white dark:bg-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{initialData ? "Edit Agenda" : "Tambah Agenda Baru"}</h2>
                            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Tutup" disabled={isSubmitting}>
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
                                        // FIX 1: Add onChange to handle the input being controlled, but disable it if initialData exists.
                                        onChange={handleInputChange} 
                                        readOnly={!!initialData} // This is correct, but the onChange is still needed.
                                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold ${initialData ? 'cursor-not-allowed' : 'cursor-default'} focus:outline-none`}
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Guru <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            ref={guruInputRef}
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleGuruInputChange}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={handleInputBlur}
                                            placeholder="Cari nama guru..."
                                            className="w-full px-4 pl-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={isSubmitting}
                                            autoComplete="off"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    </div>
                                    {showSuggestions && (
                                        <div
                                            ref={suggestionsRef}
                                            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {filteredSuggestions.length > 0 ? (
                                                filteredSuggestions.map((guru) => (
                                                    <div
                                                        key={guru.id}
                                                        onClick={() => handleGuruSelect(guru.namaGuru, guru.namaMapel)}
                                                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                                    >
                                                        <span className="text-gray-900 dark:text-white font-medium">{guru.namaGuru}</span>
                                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{guru.namaMapel}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                                    {searchTerm ? "Guru tidak ditemukan." : "Ketik untuk mencari..."}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jam Mulai <span className="text-red-500">*</span></label>
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jam Selesai <span className="text-red-500">*</span></label>
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
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mata Pelajaran <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.namaMapel || "Pilih guru terlebih dahulu..."}
                                        readOnly
                                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none cursor-not-allowed ${
                                            formData.namaMapel
                                                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 italic"
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Materi <span className="text-red-500">*</span></label>
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dokumentasi (File Opsional){initialData?.dokumentasi && !file && <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">(Saat ini: Ada)</span>}</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isSubmitting}
                                        />
                                        <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-dashed border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                            <span className="truncate pr-2 text-sm">{file ? file.name : (initialData?.dokumentasi && !file) ? "Ganti File..." : "Pilih file dokumentasi"}</span>
                                            <Upload className="size-4 shrink-0 text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keterangan (Opsional)</label>
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
                                {isSubmitting ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Agenda")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}