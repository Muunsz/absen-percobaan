export interface JurusanFromDB {
  id: number
  jurusan: string
}

export const JURUSAN_STYLE_MAP: Record<string, { color: string; icon: string; displayName: string }> = {
  Mesin: { color: "#ef4444", icon: "/images/Logo/Mesin.webp", displayName: "Teknik Mesin" },
  DGM: { color: "#ef4444", icon: "/images/Logo/DGM.png", displayName: "Desain Gambar Mesin" },
  Elektronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png", displayName: "Teknik Elektronika" },
  Mekatronika: { color: "#facc15", icon: "/images/Logo/MEKA.png", displayName: "Mekatronika" },
  Otomotif: { color: "#fb923c", icon: "/images/Logo/Otomotif.png", displayName: "Teknik Otomotif" },
  TKR: { color: "#fb923c", icon: "/images/Logo/Otomotif.png", displayName: "Teknik Kendaraan Ringan" },
  Tekstil: { color: "#22c55e", icon: "/images/Logo/Tekstil.png", displayName: "Teknik Tekstil" },
  TJKT: { color: "#3b82f6", icon: "/images/Logo/TKJ.png", displayName: "TJKT" },
  TKJ: { color: "#3b82f6", icon: "/images/Logo/TKJ.png", displayName: "Teknik Komputer & Jaringan" },
  RPL: { color: "#60a5fa", icon: "/images/Logo/PPLG.png", displayName: "Rekayasa Perangkat Lunak" },
  PPLG: { color: "#60a5fa", icon: "/images/Logo/PPLG.png", displayName: "PPLG" },
  BP: { color: "#9ca3af", icon: "/images/Logo/BP.png", displayName: "Broadcasting & Perfilman" },
}

const JURUSAN_KEY_MAP: Record<string, string> = {
  "mesin": "Mesin",
  "dgm": "DGM",
  "elektronika": "Elektronika",
  "mekatronika": "Mekatronika",
  "otomotif": "Otomotif",
  "tkr": "TKR",
  "tekstil": "Tekstil",
  "tjkt": "TJKT",
  "tkj": "TKJ",
  "rpl": "RPL",
  "pplg": "PPLG",
  "bp": "BP",
  "desain gambar mesin": "DGM",
  "teknik mesin": "Mesin",
  "teknik kendaraan ringan": "TKR",
  "teknik elektronika": "Elektronika",
  "teknik otomotif": "Otomotif",
  "teknik tekstil": "Tekstil",
  "teknik komputer dan jaringan": "TKJ",
  "pengembangan perangkat lunak dan gim": "PPLG",
  "rekayasa perangkat lunak": "RPL",
  "broadcasting dan perfilman": "BP",
  "teknik jaringan komputer & telekomunikasi": "TJKT"
}

export function getNormalizedJurusanKey(jurusanFromDb: string): string {
  const lower = jurusanFromDb.toLowerCase().trim()
  if (JURUSAN_KEY_MAP[lower]) return JURUSAN_KEY_MAP[lower]

  const stripped = lower.replace(/[^a-z0-9]/g, "")
  const matchedKey = Object.keys(JURUSAN_STYLE_MAP).find(
    (key) => key.toLowerCase() === stripped
  )
  return matchedKey || jurusanFromDb
}

export function getJurusanStyle(jurusanFromDb: string) {
  const key = getNormalizedJurusanKey(jurusanFromDb)
  const found = JURUSAN_STYLE_MAP[key]
  if (found) return found

  // Fallback: use BP icon
  return {
    color: "#9ca3af",
    icon: "/images/Logo/BP.png",
    displayName: jurusanFromDb,
  }
}