export const kelasJadwal: Record<
  string,
  Record<
    string,
    { id: number; hari: string; mapel: string; guru: string; jam: string }[]
  >
> = {
  RPL: {
    "X RPL 1": [
      { id: 1, hari: "Senin", mapel: "Pemrograman Dasar", guru: "Ibu Lestari", jam: "07.00 - 08.30" },
      { id: 2, hari: "Selasa", mapel: "Basis Data", guru: "Pak Adi", jam: "08.30 - 10.00" },
    ],
    "XI RPL 1": [
      { id: 3, hari: "Rabu", mapel: "PBO", guru: "Pak Budi", jam: "07.00 - 08.30" },
      { id: 4, hari: "Kamis", mapel: "Web Dinamis", guru: "Ibu Nia", jam: "09.00 - 10.30" },
    ],
  },
  TKJ: {
    "X TKJ 1": [
      { id: 5, hari: "Senin", mapel: "Jaringan Dasar", guru: "Pak Arif", jam: "07.00 - 08.30" },
      { id: 6, hari: "Jumat", mapel: "Sistem Operasi", guru: "Ibu Dina", jam: "09.00 - 10.30" },
    ],
  },
};
