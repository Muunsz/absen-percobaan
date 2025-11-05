import { prisma } from "@/lib/prisma";
import KelasClient from "./KelasClient";

export default async function ManajemenMapelPage() {
  const kelass = await prisma.kelas.findMany({
    include: {
      Jurusan: true, // ← matches your model
      Account_kelas_id_waliKelasToAccount: true, // ← matches your relation name
    },
    orderBy: { kelas: "asc" },
  });

  return <KelasClient kelass={kelass} />;
}