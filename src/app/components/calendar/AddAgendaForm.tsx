"use client";
import { useState, useEffect } from "react";

type Agenda = {
  id: string;
  date: string;
  judul: string;
  deskripsi?: string;
  materi?: string;
  time_start?: string;
  time_end?: string;
  lokasi?: string;
  id_guru: number;
  id_kelas?: number;
  doc_path?: string;
};

type AddAgendaFormProps = {
  onAdd: (formData: FormData) => void;
  daftarGuru: { id: number; nama_lengkap: string }[];
  daftarKelas: { id: number; nama: string }[];
  initialData?: Agenda; // opsional untuk edit
};

export default function AddAgendaForm({
  onAdd,
  daftarGuru,
  daftarKelas,
  initialData,
}: AddAgendaFormProps) {
  const [judul, setJudul] = useState(initialData?.judul || "");
  const [tanggal, setTanggal] = useState(
    initialData?.date || new Date().toISOString().split("T")[0]
  );
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");
  const [materi, setMateri] = useState(initialData?.materi || "");
  const [jamMulai, setJamMulai] = useState(initialData?.time_start || "");
  const [jamSelesai, setJamSelesai] = useState(initialData?.time_end || "");
  const [lokasi, setLokasi] = useState(initialData?.lokasi || "");
  const [guruId, setGuruId] = useState<number | "">(initialData?.id_guru || "");
  const [kelasId, setKelasId] = useState<number | "">(initialData?.id_kelas || "");
  const [attachment, setAttachment] = useState<File | null>(null);

  const isEditMode = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !tanggal) return;

    const formData = new FormData();
    formData.append("judul", judul.trim());
    formData.append("tanggal", tanggal);
    if (deskripsi.trim()) formData.append("deskripsi", deskripsi.trim());
    formData.append("materi", materi.trim());
    if (jamMulai) formData.append("jamMulai", jamMulai);
    if (jamSelesai) formData.append("jamSelesai", jamSelesai);
    formData.append("lokasi", lokasi.trim()); // pastikan tidak null
    if (guruId !== "") formData.append("guruId", guruId.toString());
    if (kelasId !== "") formData.append("kelasId", kelasId.toString());
    if (attachment) formData.append("attachment", attachment);

    onAdd(formData);

    if (!isEditMode) {
      // Reset hanya jika bukan edit
      setJudul("");
      setTanggal(new Date().toISOString().split("T")[0]);
      setDeskripsi("");
      setMateri("");
      setJamMulai("");
      setJamSelesai("");
      setLokasi("");
      setGuruId("");
      setKelasId("");
      setAttachment(null);
    }
  };

  return (
    <div className="rounded-xl border shadow-lg p-5 h-full flex flex-col border-sky-200 dark:border-gray-700 bg-sky-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Agenda" : "Tambah Agenda"}
        </h2>
        <span className="text-xs px-2.5 py-1 rounded bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-gray-300 font-medium">
          Form
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Judul</span>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              placeholder="Contoh: Rapat Komite"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Deskripsi</span>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              placeholder="Keterangan singkat agenda (opsional)"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Jam Mulai</span>
              <input
                type="time"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Jam Selesai</span>
              <input
                type="time"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tanggal</span>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Lokasi</span>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                placeholder="Mis. Aula, R. Rapat, Lab 1"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Guru/ Pengurus</span>
              <select
                value={guruId}
                onChange={(e) => setGuruId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                required
              >
                <option value="" className="bg-white dark:bg-gray-800">Pilih Guru</option>
                {daftarGuru.map((g) => (
                  <option key={g.id} value={g.id} className="bg-white dark:bg-gray-800">
                    {g.nama_lengkap}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-600 dark:text-gray-400">Kelas</span>
              <select
                value={kelasId}
                onChange={(e) => setKelasId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              >
                <option value="" className="bg-white dark:bg-gray-800">Pilih Kelas</option>
                {daftarKelas.map((k) => (
                  <option key={k.id} value={k.id} className="bg-white dark:bg-gray-800">
                    {k.nama}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Materi</span>
            <input
              type="text"
              value={materi}
              onChange={(e) => setMateri(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              placeholder="Mis. Pemrograman Web, Basis Data"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-400">Lampiran / Unggah File</span>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              className="w-full rounded-lg px-3 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:px-3 file:py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            />
            {attachment && (
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">File: {attachment.name}</span>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors mt-2 font-medium shadow-md hover:shadow-lg"
        >
          {isEditMode ? "Simpan Perubahan" : "Tambah Agenda"}
        </button>
      </form>
    </div>
  );
}