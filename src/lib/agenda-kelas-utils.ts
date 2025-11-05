// config.ts

// --- Tipe Data ---
export type Kelas = {
  id: number;
  kelas: string;
  id_jurusan: number;
  id_waliKelas: number;
};

// --- Data Statis Jurusan ---
export const JURUSAN_STYLE_DATA: Record<string, { color: string; icon: string; displayName: string }> = {
  Mesin: { color: "#ef4444", icon: "/images/Logo/Mesin.webp", displayName: "Teknik Mesin" },
  DGM: { color: "#ef4444", icon: "/images/Logo/Mesin.webp", displayName: "Desain Gambar Mesin" },
  Elektronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png", displayName: "Teknik Elektronika" },
  Mekatronika: { color: "#facc15", icon: "/images/Logo/Elektronika.png", displayName: "Mekatronika" },
  Otomotif: { color: "#fb923c", icon: "/images/Logo/Otomotif.png", displayName: "Teknik Otomotif" },
  TKR: { color: "#fb923c", icon: "/images/Logo/Otomotif.png", displayName: "Teknik Kendaraan Ringan" },
  Tekstil: { color: "#22c55e", icon: "/images/Logo/Tekstil.png", displayName: "Teknik Tekstil" },
  TJKT: { color: "#3b82f6", icon: "/images/Logo/TKJ.png", displayName: "Teknik Jaringan Komputer & Telekomunikasi" },
  RPL: { color: "#60a5fa", icon: "/images/Logo/PPLG.png", displayName: "Rekayasa Perangkat Lunak" },
  PPLG: { color: "#60a5fa", icon: "/images/Logo/PPLG.png", displayName: "Pengembangan Perangkat Lunak & Gim" },
  BP: { color: "#9ca3af", icon: "/images/Logo/BP.png", displayName: "Broadcasting & Perfilman" },
  TKJ: { color: "#3b82f6", icon: "/images/Logo/TKJ.png", displayName: "Teknik Komputer dan Jaringan" },
};

// --- Map Normalisasi Key Jurusan (Case-Insensitive) ---
const KEY_NORMALIZATION_MAP: Record<string, string> = {
  mesin: "Mesin",
  dgm: "DGM",
  elektronika: "Elektronika",
  mekatronika: "Mekatronika",
  otomotif: "Otomotif",
  tkr: "TKR",
  tekstil: "Tekstil",
  tjkt: "TJKT",
  tkj: "TKJ",
  rpl: "RPL",
  pplg: "PPLG",
  bp: "BP",

  "desain gambar mesin": "DGM",
  "teknik kendaraan ringan": "TKR",
  "rekayasa perangkat lunak": "RPL",
  "teknik komputer dan jaringan": "TKJ",
  "pengembangan perangkat lunak dan gim": "PPLG",
  "broadcasting dan perfilman": "BP",
  "teknik jaringan komputer & telekomunikasi": "TJKT",
  "teknik otomotif": "Otomotif",
  "teknik elektronika": "Elektronika",
  "teknik mesin": "Mesin",
  "teknik tekstil": "Tekstil",
  rekayasaperangkatlunak: "RPL",
  "pengembanganperangkatlunak&gim": "PPLG",
  teknikkomputerjaringantelekomunikasi: "TJKT",
};

// --- Fungsi Utilitas ---
export function pretty(v: string) {
  try {
    return decodeURIComponent(v).replace(/-/g, " ").toUpperCase();
  } catch {
    return v.replace(/-/g, " ").toUpperCase();
  }
}

export function getJurusanKey(jurusan: string): string {
  const lowerCaseJurusan = jurusan.toLowerCase().trim();
  
  const keyMatch = KEY_NORMALIZATION_MAP[lowerCaseJurusan];
  if (keyMatch) {
    return keyMatch; 
  }
  
  const strippedName = lowerCaseJurusan.replace(/[^a-z0-9]/g, "");
  const strippedKeyMatch = KEY_NORMALIZATION_MAP[strippedName];
  if (strippedKeyMatch) {
    return strippedKeyMatch;
  }
  
  return jurusan; 
}

export function getJurusanStyle(jurusanName: string) {
  const key = getJurusanKey(jurusanName);
  const styleMatch = JURUSAN_STYLE_DATA[key];

  if (styleMatch) {
    return styleMatch;
  }
  
  const safeFallback = JURUSAN_STYLE_DATA["RPL"]; 

  return { 
    color: "#9ca3af", 
    icon: safeFallback.icon,
    displayName: jurusanName 
  };
}