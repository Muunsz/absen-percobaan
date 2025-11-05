// Warna, ikon, dan kelas per jurusan dipisah di file ini supaya reusable
export const jurusanKelas: Record<string, string[]> = {
  ELEKTRONIKA: [
    "X ELEKTRONIKA 1", "X ELEKTRONIKA 2", "X ELEKTRONIKA 3",
    "XI ELEKTRONIKA 1", "XI ELEKTRONIKA 2", "XI ELEKTRONIKA 3",
    "XII ELEKTRONIKA 1", "XII ELEKTRONIKA 2", "XII ELEKTRONIKA 3",
  ],
  MEKATRONIKA: [
    "XI MEKATRONIKA", "XII MEKATRONIKA"
  ],
  MESIN: [
    "X MESIN 1", "X MESIN 2", "X MESIN 3",
    "XI MESIN 1", "XI MESIN 2",
    "XII MESIN 1", "XII MESIN 2",
  ],
  DGM: [
    "XI DGM", "XII DGM"]
  ,
  OTOMOTIF: [
    "X OTOMOTIF 1", "X OTOMOTIF 2", "X OTOMOTIF 3"
  ],
  TKR: [
    "XI TKR 1", "XI TKR 2", "XI TKR 3", "XII TKR 1", "XII TKR 2", "XII TKR 3"
  ],
  TEKSTIL: [
    "X TEKSTIL 1", "X TEKSTIL 2", "X TEKSTIL 3",
    "XI TEKSTIL 1", "XI TEKSTIL 2", "XI TEKSTIL 3",
    "XII TEKSTIL 1", "XII TEKSTIL 2",
  ],
  TJKT: [
    "X TJKT 1", "X TJKT 2", "X TJKT 3"
  ],
  TKJ: [
    "XI TKJ 1", "XI TKJ 2", "XII TKJ 1", "XII TKJ 2"
  ],
  PPLG: [
    "X PPLG 1", "X PPLG 2", "X PPLG 3"
  ],
  RPL: [
    "XI RPL 1", "XI RPL 2", "XII RPL 1", "XII RPL 2"
  ],
  BP: [
    "X BP 1", "X BP 2", "X BP 3"
  ],
  PSPT: [
    "XI PSPT 1", "XI PSPT 2", "XI PSPT 3", "XII PSPT 1", "XII PSPT 2"]
    ,
};

export const jurusanColors: Record<string, string> = {
  MESIN: "#ef4444",
  DGM: "#ef4444",
  ELEKTRONIKA: "#facc15",
  MEKATRONIKA: "#facc15",
  OTOMOTIF: "#fb923c",
  TKR: "#fb923c",
  TEKSTIL: "#22c55e",
  TJKT: "#3b82f6",
  TKJ: "#3b82f6",
  PPLG: "#60a5fa",
  RPL: "#60a5fa",
  BP: "#9ca3af",
  PSPT: "#9ca3af",
};

export const jurusanIcons: Record<string, string> = {
  MESIN: "⚙️",
  DGM: "⚙️",
  ELEKTRONIKA: "💡",
  MEKATRONIKA: "💡",
  OTOMOTIF: "🚗",
  TKR: "🚗",
  TEKSTIL: "🧵",
  TJKT: "🖥️",
  TKJ: "🖥️",
  PPLG: "💻",
  RPL: "💻",
  BP: "📚",
  PSPT: "📚",
};
