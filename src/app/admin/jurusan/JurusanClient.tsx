"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle, X, Search } from "lucide-react";

type Jurusan = {
  id: number;
  jurusan: string;
};

export default function JurusanClient({ jurusans }: { jurusans: Jurusan[] }) {
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);

  const [jurusan, setJurusan] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setJurusanList(jurusans);
    setLoading(false);
  }, [jurusans]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jurusan.trim()) return alert("Nama jurusan wajib diisi");

    const url = editingId !== null ? `/api/jurusan/${editingId}` : "/api/jurusan";
    const method = editingId !== null ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jurusan: jurusan.trim() }),
    });

    if (!res.ok) {
      alert("Gagal menyimpan data");
      return;
    }

    const data: Jurusan = await res.json();

    if (editingId !== null) {
      setJurusanList((prev) =>
        prev.map((j) => (j.id === editingId ? data : j))
      );
    } else {
      setJurusanList((prev) => [...prev, data]);
    }

    resetForm();
    setModalOpen(false);
  }

  const handleEdit = (jurusan: Jurusan) => {
    setJurusan(jurusan.jurusan);
    setEditingId(jurusan.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus mata pelajaran ini beserta relasinya?")) return;

    const res = await fetch(`/api/jurusan/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setJurusanList((prev) => prev.filter((j) => j.id !== id));
    } else {
      alert("Gagal menghapus data");
    }
  };

  const resetForm = () => {
    setJurusan("");
    setEditingId(null);
  };

  const filteredJurusan = jurusanList.filter(
    (j) =>
      j.jurusan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Jurusan</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kelola data jurusan sekolah
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
          >
            <PlusCircle size={18} />
            Tambah Jurusan
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari jurusan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Memuat data jurusan...
          </p>
        ) : filteredJurusan.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Tidak ada jurusan ditemukan.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1e293b]/70 backdrop-blur-lg shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="py-4 px-5 text-left font-semibold">No</th>
                  <th className="py-4 px-5 text-left font-semibold">Jurusan</th>
                  <th className="py-4 px-5 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJurusan.map(({ id, jurusan }, index) => (
                  <tr
                    key={id}
                    className="hover:bg-gray-50 dark:hover:bg-[#27364f] transition-colors duration-200"
                  >
                    <td className="py-4 px-5">{index + 1}</td>
                    <td className="py-4 px-5 font-medium">{jurusan}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit({ id, jurusan })}
                          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium transition"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 font-medium transition"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md relative shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">
                {editingId !== null ? "Edit Jurusan" : "Tambah Jurusan"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Jurusan
                  </label>
                  <input
                    type="text"
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    required
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama jurusan"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-95"
                  >
                    {editingId !== null ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
