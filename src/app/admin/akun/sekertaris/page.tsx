"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2, PlusCircle, X, Search } from "lucide-react";

interface Option {
  id: number;
  kelas: string;
}

type User = {
  id: number;
  username: string;
  nama_lengkap?: string | null;
  password?: string;
  id_kelas: number;
  kelas: string;
  role: string;
};

export default function SekertarisPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [selectedKelasId, setSelectedKelasId] = useState<number | string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/options/kelas");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: Option[] = await response.json();
        setOptions(data);
        if (data.length > 0 && selectedKelasId === "") {
          setSelectedKelasId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchSekertarisUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/users/sekertaris");
        if (!response.ok) throw new Error("Gagal memuat data sekertaris");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Fetch sekertaris error:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchSekertarisUsers();
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !selectedKelasId) {
      alert("Username dan Kelas wajib diisi");
      return;
    }

    const bodyPayload = {
      username,
      nama_lengkap: namaLengkap,
      password,
      id_kelas: selectedKelasId,
      role: "SEKRETARIS",
    };

    const bodyPayloadUpdate = {
      id: editingId,
      username,
      nama_lengkap: namaLengkap,
      password,
      id_kelas: selectedKelasId,
    };

    try {
      if (editingId === null) {
        if (!password.trim()) {
          alert("Password wajib diisi untuk sekertaris baru");
          return;
        }
        const res = await fetch("/api/add_account/sekertaris", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal menambah sekertaris");
        }
        const newUser = await res.json();
        setUsers((prev) => [...prev, newUser]);
      } else {
        const res = await fetch("/api/edit_account/sekertaris", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayloadUpdate),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal memperbarui sekertaris");
        }
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === editingId ? updatedUser : u))
        );
      }
      resetForm();
      setModalOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  }

  const handleEdit = (user: User) => {
    setUsername(user.username);
    setNamaLengkap(user.nama_lengkap || "");
    setPassword("");
    setSelectedKelasId(user.id_kelas);
    setEditingId(user.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    try {
      const res = await fetch("/api/delete_account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus");
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error: any) {
      console.error(error);
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  const resetForm = () => {
    setUsername("");
    setNamaLengkap("");
    setPassword("");
    setSelectedKelasId(options.length > 0 ? options[0].id : "");
    setEditingId(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Pengguna - Sekertaris</h1>
            <p className="text-gray-500 dark:text-gray-400">Kelola data akun sekertaris</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition active:scale-95 mt-4 sm:mt-0"
          >
            <PlusCircle size={18} />
            Tambah Sekertaris
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan username, nama, atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1e293b]/70 backdrop-blur-lg shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Nama Lengkap</th>
                <th className="py-3 px-4 text-left">Kelas</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#27364f]">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">{user.nama_lengkap || "-"}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold">
                      {user.kelas}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleEdit(user)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Tidak ada data sekertaris yang cocok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md relative mx-4"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                aria-label="Tutup modal"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold mb-4">
                {editingId !== null ? "Edit Sekertaris" : "Tambah Sekertaris"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                    placeholder="Nama lengkap sekertaris"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                    placeholder={editingId !== null ? "Kosongkan jika tidak diubah" : ""}
                    required={editingId === null}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kelas</label>
                  <select
                    value={selectedKelasId}
                    onChange={(e) => setSelectedKelasId(Number(e.target.value))}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border dark:border-gray-600"
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
