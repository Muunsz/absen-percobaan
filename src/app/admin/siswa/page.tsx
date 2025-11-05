"use client";

import React, { useState, ChangeEvent, useMemo, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, PlusCircle, X, Search, Upload, Eye, RotateCcw } from "lucide-react";

// Updated to match Prisma: NIS is string, and kelas/jurusan are derived
interface OptionKelas {
  id: number;
  kelas: string;      // e.g., "XII RPL 1"
  jurusan: string;    // e.g., "Rekayasa Perangkat Lunak"
}

type Siswa = {
  nis: string;
  nama: string;
  JK: "L" | "P";
  status: "Aktif" | "NonAktif";
  kelas: string;      // class name
  jurusan: string;    // jurusan name (derived from kelas)
  absensi: {
    tanggal: string;
    status: "Hadir" | "Sakit" | "Izin" | "Alfa";
    keterangan?: string;
  }[];
};

const jenisKelaminOptions = ["L", "P"];
const statusOptions = ["Aktif", "NonAktif"];

export default function SiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  const [nisInput, setNisInput] = useState("");
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<"L" | "P">("L");
  const [status, setStatus] = useState<"Aktif" | "NonAktif">("Aktif");
  const [selectedKelasId, setSelectedKelasId] = useState<number | "">("");

  const [editingNis, setEditingNis] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<OptionKelas[]>([]);

  const [filterJurusan, setFilterJurusan] = useState<string>("");
  const [filterKelas, setFilterKelas] = useState<string>("");
  const [filterJenisKelamin, setFilterJenisKelamin] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const kelasOptions = useMemo(() => {
    return Array.from(new Set(siswaList.map(s => s.kelas))).sort();
  }, [siswaList]);

  const jurusanOptions = useMemo(() => {
    return Array.from(new Set(siswaList.map(s => s.jurusan))).sort();
  }, [siswaList]);

  const { totalSiswa, totalLakiLaki, totalPerempuan } = useMemo(() => {
    const total = siswaList.length;
    const laki = siswaList.filter(s => s.JK === "L").length;
    const perempuan = total - laki;
    return { totalSiswa: total, totalLakiLaki: laki, totalPerempuan: perempuan };
  }, [siswaList]);

  // Fetch siswa
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/siswa");
        const data: Siswa[] = await response.json();
        setSiswaList(data);
      } catch (err: any) {
        console.error("Fetch siswa error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSiswa();
  }, []);

  // Fetch kelas options (with jurusan)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/options/kelas");
        if (!response.ok) throw new Error("Failed to fetch kelas");
        const data: OptionKelas[] = await response.json();
        setOptions(data);
        if (data.length > 0) {
          setSelectedKelasId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching kelas options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import/siswa', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        // Optionally refetch data
        window.location.reload();
      } else {
        alert(`Error: ${result.error}\n${result.errors?.join('\n') || ''}`);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghubungi server');
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const nis = nisInput.trim();
  if (!nis) return alert("NIS wajib diisi");
  if (!nama.trim()) return alert("Nama wajib diisi");
  if (!selectedKelasId) return alert("Kelas wajib dipilih");

  const selectedKelas = options.find(k => k.id === selectedKelasId);
  if (!selectedKelas) return alert("Kelas tidak valid");

  const newSiswa = {
    nis,
    nama: nama.trim(),
    jenisKelamin,
    status,
    kelas: selectedKelas.kelas,
    jurusan: selectedKelas.jurusan,
  };

  try {
    if (editingNis === null) {
      // 🆕 CREATE
      const res = await fetch("/api/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSiswa),
      });

      if (!res.ok) throw new Error("Gagal menambah siswa");
      alert("Siswa berhasil ditambahkan");
    } else {
      // ✏️ UPDATE
      const res = await fetch(`/api/siswa/${editingNis}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSiswa),
      });

      if (!res.ok) throw new Error("Gagal memperbarui siswa");
      alert("Data siswa berhasil diperbarui");
    }

    resetForm();
    setModalOpen(false);

    // 🔄 Refresh list setelah update
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menyimpan data");
  }
};


  const handleEdit = (siswa: Siswa) => {
    setNisInput(siswa.nis);
    setNama(siswa.nama);
    setJenisKelamin(siswa.JK);
    setStatus(siswa.status);

    const kelasOption = options.find(opt => opt.kelas === siswa.kelas && opt.jurusan === siswa.jurusan);
    if (kelasOption) {
      setSelectedKelasId(kelasOption.id);
    } else {
      setSelectedKelasId("");
    }

    setEditingNis(siswa.nis);
    setModalOpen(true);
  };

  const handleDelete = async (nis: string) => {
  if (!confirm("Yakin ingin menghapus siswa ini?")) return;

  try {
    const res = await fetch(`/api/siswa/${nis}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus siswa");
    alert("Siswa berhasil dihapus");
    window.location.reload(); // refresh data
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghapus siswa");
  }
};


  const handleShowDetail = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setDetailModalOpen(true);
  };

  const resetForm = () => {
    setNisInput("");
    setNama("");
    setJenisKelamin("L");
    setStatus("Aktif");
    setSelectedKelasId(options.length > 0 ? options[0].id : "");
    setEditingNis(null);
  };

  const handleCloseModals = () => {
    setModalOpen(false);
    setDetailModalOpen(false);
    setSelectedSiswa(null);
    resetForm();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterJurusan("");
    setFilterKelas("");
    setFilterJenisKelamin("");
    setFilterStatus("");
  };

  const filteredSiswa = useMemo(() => {
    return siswaList.filter(
      (s) =>
        (s.nis.includes(searchTerm) ||
          s.nama.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterJurusan === "" || s.jurusan === filterJurusan) &&
        (filterKelas === "" || s.kelas === filterKelas) &&
        (filterJenisKelamin === "" || s.JK === filterJenisKelamin) &&
        (filterStatus === "" || s.status === filterStatus)
    );
  }, [siswaList, searchTerm, filterJurusan, filterKelas, filterJenisKelamin, filterStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const totalPages = Math.ceil(filteredSiswa.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSiswa = filteredSiswa.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKelas, filterJurusan, filterJenisKelamin, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold">Manajemen Siswa</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kelola data siswa aktif
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center justify-center sm:justify-start gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95 cursor-pointer">
              <Upload size={18} />
              <span>Import</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
              className="flex items-center justify-center sm:justify-start gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              Tambah Siswa
            </button>
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center sm:justify-start gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
            >
              Kembali
            </Link>
          </div>
        </div>

        {/* Statistik Singkat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Siswa</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSiswa}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Laki-laki</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalLakiLaki}</p>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Perempuan</p>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{totalPerempuan}</p>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="relative flex-grow max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari NIS atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              <RotateCcw size={16} />
              Reset Filter
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="filter-jurusan" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jurusan
              </label>
              <select
                id="filter-jurusan"
                value={filterJurusan}
                onChange={(e) => setFilterJurusan(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              >
                <option value="">Semua Jurusan</option>
                {jurusanOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-kelas" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kelas
              </label>
              <select
                id="filter-kelas"
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              >
                <option value="">Semua Kelas</option>
                {kelasOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-jk" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jenis Kelamin
              </label>
              <select
                id="filter-jk"
                value={filterJenisKelamin}
                onChange={(e) => setFilterJenisKelamin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              >
                <option value="" className="dark:bg-[#0f172a]">Semua JK</option>
                {jenisKelaminOptions.map((jk) => (
                  <option key={jk} value={jk} className="dark:bg-[#0f172a]">
                    {jk}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-status" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              >
                <option value="" className="dark:bg-[#0f172a]">Semua Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="dark:bg-[#0f172a]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden lg:block"></div>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-semibold">{filteredSiswa.length}</span> dari <span className="font-semibold">{siswaList.length}</span> siswa.
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Memuat data siswa...
          </p>
        ) : filteredSiswa.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada siswa ditemukan berdasarkan filter yang dipilih.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1e293b]/70 backdrop-blur-lg shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[60px]">No</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[100px]">NIS</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[150px]">Nama</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[80px]">JK</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[80px]">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[120px]">Kelas</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[150px]">Jurusan</th>
                  <th className="py-3 px-4 sm:px-5 text-left font-semibold min-w-[120px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentSiswa.length > 0 ? (
                  currentSiswa.map((siswa, index) => (
                    <tr
                      key={siswa.nis}
                      className="hover:bg-gray-50 dark:hover:bg-[#27364f] transition-colors duration-200"
                    >
                      <td className="py-3 px-4 sm:px-5">{indexOfFirst + index + 1}</td>
                      <td className="py-3 px-4 sm:px-5 font-medium">{siswa.nis}</td>
                      <td className="py-3 px-4 sm:px-5">{siswa.nama}</td>
                      <td className="py-3 px-4 sm:px-5">{siswa.JK}</td>
                      <td className="py-3 px-4 sm:px-5">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${siswa.status === "Aktif"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                        >
                          {siswa.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-5">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold">
                          {siswa.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-5">
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-semibold">
                          {siswa.jurusan}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-5">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={() => handleEdit(siswa)}
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium transition text-xs sm:text-sm"
                            aria-label={`Edit ${siswa.nama}`}
                          >
                            <Edit size={14} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(siswa.nis)}
                            className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 font-medium transition text-xs sm:text-sm"
                            aria-label={`Hapus ${siswa.nama}`}
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                          <button
                            onClick={() => handleShowDetail(siswa)}
                            className="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 font-medium transition text-xs sm:text-sm"
                            aria-label={`Detail ${siswa.nama}`}
                          >
                            <Eye size={14} />
                            <span className="hidden sm:inline">Detail</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 px-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Tidak ada data siswa yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Menampilkan {indexOfFirst + 1}–{Math.min(indexOfLast, filteredSiswa.length)} dari{" "}
            {filteredSiswa.length} siswa
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] hover:bg-gray-100 dark:hover:bg-[#27364f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>

            <div className="flex gap-1">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                className="w-16 px-3 py-1 rounded-lg border text-center border-blue-600 text-blue-600 bg-white dark:bg-[#1e293b] hover:bg-gray-100 dark:hover:bg-[#27364f] transition"
                min={1}
                max={totalPages}
              />
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e293b] hover:bg-gray-100 dark:hover:bg-[#27364f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        {/* Modal Tambah/Edit Siswa */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModals}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm sm:max-w-md relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModals}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                aria-label="Tutup modal"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">
                {editingNis !== null ? "Edit Siswa" : "Tambah Siswa"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    NIS
                  </label>
                  <input
                    type="text"
                    value={nisInput}
                    onChange={(e) => setNisInput(e.target.value)}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan NIS"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jenis Kelamin
                    </label>
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value as "L" | "P")}
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "Aktif" | "NonAktif")}
                      className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="NonAktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kelas
                  </label>
                  <select
                    value={selectedKelasId}
                    onChange={(e) => {
                      const id = e.target.value === "" ? "" : Number(e.target.value);
                      setSelectedKelasId(id);
                    }}
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kelas</option>
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.kelas} ({option.jurusan})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-95"
                  >
                    {editingNis !== null ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Siswa */}
        {detailModalOpen && selectedSiswa && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModals}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md sm:max-w-lg relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModals}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                aria-label="Tutup modal"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">Detail Siswa</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Informasi Dasar</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-600 dark:text-gray-400">NIS:</span> <span className="font-medium">{selectedSiswa.nis}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Nama:</span> <span className="font-medium">{selectedSiswa.nama}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">JK:</span> <span className="font-medium">{selectedSiswa.JK === "L" ? "Laki-laki" : "Perempuan"}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Status:</span> <span className={`font-medium px-2 py-0.5 rounded text-xs ${selectedSiswa.status === "Aktif"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      }`}>{selectedSiswa.status}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Kelas:</span> <span className="font-medium">{selectedSiswa.kelas}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Jurusan:</span> <span className="font-medium">{selectedSiswa.jurusan}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Riwayat Absensi (Terakhir)</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada data absensi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
