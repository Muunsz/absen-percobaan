"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { prisma } from "@/lib/prisma" // your prisma client import

function useRedirectIfMismatch() {
  const { jurusan: jurParam, kelas: kelasParam } = useParams()
  const router = useRouter()

  useEffect(() => {
    async function checkAndRedirect() {
      if (!jurParam || !kelasParam) return

      try {
        // Fetch the correct values from Prisma
        const kelasData = await fetch(`/api/absensi-sek}`)
        
        const data = await kelasData.json()
        const correctJurusan = data.jurusan
        const correctKelas = data.kelas

        // If URL params mismatch the "pretty" values, redirect
        if (jurParam !== correctJurusan || kelasParam !== correctKelas) {
          router.replace(`/sekretaris/isi-absensi/${encodeURIComponent(correctJurusan)}/${encodeURIComponent(correctKelas)}`)
        }
      } catch (err) {
        console.error("Failed to validate class/jurusan:", err)
      }
    }

    checkAndRedirect()
  }, [jurParam, kelasParam, router])
}

export default useRedirectIfMismatch
