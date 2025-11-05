"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { BookOpen, Search, Loader2 } from "lucide-react"

import { ThemedContainer } from "../../components/UI/ThemedContainer"
import DepartmentCard from "../../components/Agenda-guru/DepartemenCard"
import { JurusanFromDB } from "@/lib/jurusan-utils"


export default function ClassAgendaDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jurusanList, setJurusanList] = useState<JurusanFromDB[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJurusan = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/Agenda-kelas') 

      if (!response.ok) {
        let errorMessage = 'Gagal mengambil data. Status: ' + response.status;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            console.error("Gagal mengurai JSON error:", jsonError);
          }
        } else {
          // Fallback aman untuk HTML error page
          const errorText = await response.text();
          console.error("Server mengembalikan non-JSON:", errorText.substring(0, 100) + '...');
          errorMessage = `Error Server (Status: ${response.status}). Periksa URL API.`;
        }
        
        throw new Error(errorMessage);
      }
        
    const data: JurusanFromDB[] = await response.json()
      setJurusanList(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJurusan()
  }, [fetchJurusan])

  const filteredJurusan = useMemo(() => {
    const search = searchTerm.toLowerCase()
    if (!search) return jurusanList
    return jurusanList.filter((j) => j.jurusan.toLowerCase().includes(search)) 
  }, [searchTerm, jurusanList])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-screen-xl mx-auto space-y-10">
        
        <header className="space-y-2 mb-8 p-6 rounded-xl shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl">
              <BookOpen className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Dashboard Agenda Kelas
              </h1>
              <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
                Kelola dan pantau seluruh agenda pembelajaran per jurusan Anda.
              </p>
            </div>
          </div>
        </header>


        <ThemedContainer variant="default" className="p-4">
          <div className="relative flex items-center">
            <Search className="size-5 absolute left-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama jurusan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl dark:border-white/50 shadow-2xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            />
          </div>
        </ThemedContainer>

        <section>
          {isLoading ? (
            <ThemedContainer className="text-center py-10">
              <Loader2 className="size-6 animate-spin mx-auto text-blue-500 mb-2" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Memuat data jurusan...</p>
            </ThemedContainer>
          ) : error ? (
            <ThemedContainer className="text-center text-red-500 py-10">
              <p className="text-lg font-medium">⚠️ Gagal memuat data: {error}</p>
            </ThemedContainer>
          ) : filteredJurusan.length === 0 ? (
            <ThemedContainer className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p className="text-lg font-medium">❌ Tidak ada jurusan ditemukan</p>
            </ThemedContainer>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredJurusan.map((jurusan) => (
                <DepartmentCard key={jurusan.id} jurusan={jurusan} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}