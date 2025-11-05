import { getDashboardData } from "@/lib/dashboardData"
import StatsCard from "../../components/dashboard/StatsCard"
import Diagram from "../../components/dashboard/Diagram"
import QuickAgendaForm from "../../components/dashboard/QuickAgendaForm"
import AgendaList from "../../components/dashboard/AgendaList"

export default async function Page() {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const data = await getDashboardData()

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6 min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0 border-gray-100 shadow-lg rounded-lg p-4 dark:bg-gray-800 ">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <h1 className="text-gray-900 dark:text-white text-xl font-semibold">Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Statistik dan identitas absensi siswa</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">this is percent</p>
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">{new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Jakarta",
              })}</div>
      </div>

      <div className="space-y-6">
        <StatsCard data={data} />

          <div className="w-full">
            <Diagram data={data} />
          </div>

        <AgendaList />
      </div>
    </div>
  )
}