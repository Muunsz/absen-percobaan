import { prisma } from "@/lib/prisma";
import MapelClient from "./MapelClient";

export default async function ManajemenMapelPage() {
  const mapels = await prisma.mapel.findMany();

  return <MapelClient mapels={mapels} />;
}