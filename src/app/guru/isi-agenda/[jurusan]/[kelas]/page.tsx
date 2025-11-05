"use client"
import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import {
    Plus,
    BookOpen,
} from "lucide-react"
import AgendaModal from "../../../../components/Agenda-kelas/AgendaModal"
import AgendaCard from "../../../../components/Agenda-kelas/AgendaCard"
import AgendaTable from "../../../../components/Agenda-kelas/AgendaTable"
import {
    BreadcrumbAndBackButton,
    ViewToggle,
    SummaryCard,
    EmptyState,
    LoadingState,
    Footer,
} from "../../../../components/Agenda-kelas/PageHelpersG"
import {
    AgendaFormSubmitData,
    GuruMapelData,
    KelasAgenda,
    pretty,
    sortAgendaList,
    today,
} from "@/lib/agenda-kelas-page-utils"

export default function DetailAgendaPage() {
    const params = useParams()
    const jurusan = params.jurusan as string
    const kelas = params.kelas as string
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [initialData, setInitialData] = useState<KelasAgenda | null>(null)
    const [viewMode, setViewMode] = useState<"table" | "card">("table")
    const [agendaList, setAgendaList] = useState<KelasAgenda[]>([])
    const [guruMapelData, setGuruMapelData] = useState<GuruMapelData[]>([])
    const [guruLoadingError, setGuruLoadingError] = useState<string | null>(null)
  
    const fetchAgendaData = useCallback(async () => {
        setLoading(true)
        setFetchError(null)
        try {
            const response = await fetch(`/api/Agenda-kelas/${jurusan}/${kelas}`)
            if (!response.ok) throw new Error((await response.json()).error || "Gagal mengambil data agenda.")
            const data: KelasAgenda[] = await response.json()

            setAgendaList(sortAgendaList(data))
        } catch (e) {
            console.error(e)
            setFetchError(`Gagal memuat data agenda: ${(e as Error).message}`)
        } finally {
            setLoading(false)
        }
    }, [jurusan, kelas])

    const fetchGuruMapelData = useCallback(async () => {
        setGuruLoadingError(null)
        try {
            const response = await fetch(`/api/Agenda-kelas/${jurusan}/${kelas}?fetch=guru`)
            if (!response.ok) throw new Error((await response.json()).error || "Gagal mengambil data guru")
            const data: GuruMapelData[] = await response.json()
            setGuruMapelData(data)
        } catch (e) {
            console.error("Error fetching guru data:", e)
            setGuruLoadingError(`Gagal memuat daftar Guru: ${(e as Error).message}`)
        }
    }, [jurusan, kelas])

    useEffect(() => {
        fetchAgendaData()
        fetchGuruMapelData()
    }, [fetchAgendaData, fetchGuruMapelData])

    const handleOpenAddForm = () => {
        setInitialData(null)
        setShowForm(true)
    }

    const handleOpenEditForm = (agenda: KelasAgenda) => {
        setInitialData(agenda)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setInitialData(null)
    }

    const handleSaveOrUpdateAgenda = async (data: AgendaFormSubmitData) => {
        setIsSubmitting(true)
        const isUpdate = !!data.id
        const method = isUpdate ? "PUT" : "POST"

        try {
            const formData = new FormData()
            if (isUpdate) formData.append('id', data.id!.toString())
            formData.append('tanggal', data.tanggal)
            formData.append('namaGuru', data.namaGuru)
            formData.append('jamMulai', data.jamMulai)
            formData.append('jamSelesai', data.jamSelesai)
            formData.append('namaMapel', data.namaMapel)
            formData.append('materi', data.materi)
            formData.append('keterangan', data.keterangan)

            if (data.file) {
                formData.append('file', data.file)
            } else if (isUpdate && !data.file) {
            }

            const response = await fetch(`/api/Agenda-kelas/${jurusan}/${kelas}`, {
                method,
                body: formData,
            })

            let resultAgenda: KelasAgenda
            try {
                const responseData = await response.json()
                if (!response.ok) throw new Error(responseData.error || `Gagal ${isUpdate ? 'memperbarui' : 'menyimpan'} agenda.`)
                resultAgenda = responseData
            } catch (jsonError) {
                if (response.ok) {
                    throw new Error(`Gagal ${isUpdate ? 'memperbarui' : 'menyimpan'} agenda: Respons server tidak valid.`)
                }
                throw new Error(`Gagal ${isUpdate ? 'memperbarui' : 'menyimpan'} agenda: Respons server tidak valid.`)
            }

            setAgendaList((prev) => {
                if (isUpdate) {
                    const updatedList = prev.map((item) => (item.id === resultAgenda.id ? resultAgenda : item))
                    return sortAgendaList(updatedList)
                } else {
                    return sortAgendaList([...prev, resultAgenda])
                }
            })
            handleCloseForm()
        } catch (e) {
            console.error(e)
            alert(`Gagal ${isUpdate ? 'memperbarui' : 'menyimpan'} agenda: ${(e as Error).message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteAgenda = async (id: number) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak dapat dibatalkan.")) return
        setDeletingId(id)
        try {
            const response = await fetch(`/api/Agenda-kelas/${jurusan}/${kelas}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (!response.ok) throw new Error((await response.json()).error || "Gagal menghapus agenda.")
            setAgendaList((prev) => prev.filter((item) => item.id !== id))
        } catch (e) {
            console.error(e)
            alert(`Gagal menghapus agenda: ${(e as Error).message}`)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return <LoadingState kelas={kelas} />
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-screen-2xl mx-auto px-4 py-6 md:px-8 space-y-6">
                <header className="p-5 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition duration-300 shadow-xl">
                    <div className="flex items-center gap-3">
                        <BookOpen className="size-8 text-blue-600 dark:text-blue-400 shrink-0" />
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug">
                            Agenda Pembelajaran Kelas <span className="text-blue-600 dark:text-blue-400">{pretty(kelas)}</span>
                        </h1>
                    </div>
                </header>
                <div className="grid grid-cols-1 gap-6">
                    <SummaryCard agendaCount={agendaList.length} />
                    {(fetchError || guruLoadingError) && (
                        <div className="p-4 text-sm font-medium text-red-700 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-400">
                            <p>⚠️ Kesalahan Data : </p>
                            {fetchError && <p className="mt-1">{fetchError}</p>}
                            {guruLoadingError && <p className="mt-1">{guruLoadingError}</p>}
                        </div>
                    )}
                    <div className="flex flex-col gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
                        <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                            <BreadcrumbAndBackButton jurusan={jurusan} kelas={kelas} />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <ViewToggle view={viewMode} onViewChange={setViewMode} />
                            <button
                                onClick={handleOpenAddForm}
                                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition-all shadow-lg shadow-blue-500/30 shrink-0"
                                disabled={!!guruLoadingError}
                                title={guruLoadingError ? "Tidak bisa menambah agenda karena data guru gagal dimuat." : "Tambah Agenda"}
                            >
                                <Plus size={18} /> Tambah Agenda
                            </button>
                        </div>
                    </div>
                </div>
                {agendaList.length === 0 && !fetchError ? (
                    <EmptyState fetchError={fetchError} />
                ) : (
                    <div className="pt-2">
                        {viewMode === "card" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {agendaList.map((agenda) => (
                                    <AgendaCard
                                        key={agenda.id}
                                        agenda={agenda}
                                        onDelete={handleDeleteAgenda}
                                        onEdit={handleOpenEditForm}
                                        isDeleting={deletingId === agenda.id}
                                    />
                                ))}
                            </div>
                        )}
                        {viewMode === "table" && (
                            <AgendaTable
                                agendaList={agendaList}
                                deletingId={deletingId}
                                onDelete={handleDeleteAgenda}
                                onEdit={handleOpenEditForm}
                            />
                        )}
                    </div>
                )}
                <Footer agendaCount={agendaList.length} kelas={kelas} />
            </div>
            <AgendaModal
                show={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSaveOrUpdateAgenda}
                isSubmitting={isSubmitting}
                guruMapelData={guruMapelData}
                initialData={initialData}
            />
        </div>
    )
}