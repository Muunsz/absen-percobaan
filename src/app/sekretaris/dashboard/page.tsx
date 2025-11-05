// File: src/app/sekretaris/dashboard/page.tsx
import { getDashboardData } from "@/lib/dashDataS";
import DashboardSekretarisClient from "./DashboardSekretarisClient";

export default async function DashboardSekretarisPage() {
  const data = await getDashboardData();

  return <DashboardSekretarisClient data={data} />;
}
