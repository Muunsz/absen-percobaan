import { prisma } from "@/lib/prisma";
import JurusanClient from "./JurusanClient";

export default async function ManajemenJurusanPage() {
  const jurusans = await prisma.jurusan.findMany();

  return <JurusanClient jurusans={jurusans} />;
}