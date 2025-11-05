"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2, PlusCircle, X, Search } from "lucide-react";

type User = {
  id: number;
  username: string;
  nama_lengkap: string | null;
  role: string;
};

export default function UserViewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserViewUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/users/userView");
        if (!response.ok) throw new Error("Gagal memuat data user view");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Fetch user view error:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserViewUsers();
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
    if (!username.trim()) {
      alert("Username wajib diisi");
      return;
    }

    if (editingId === null && !password) {
      alert("Password wajib diisi untuk pengguna baru");
      return;
    }

    const bodyPayload = {
      username,
      nama_lengkap: namaLengkap || null,
      password: password || undefined,
      role: "VIEW",
    };

    const url = editingId === null ? "/api/add_account/userView" : "/api/edit_account/userView";
    const method = editingId === null ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId !== null ? { ...bodyPayload, id: editingId } : bodyPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Gagal ${editingId !== null ? "memperbarui" : "menambah"} user view`);
      }

      const returnedUser: User = await res.json();

      if (editingId === null) {
        setUsers((prev) => [...prev, returnedUser]);
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingId ? returnedUser : u))
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
    setEditingId(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="text-center py-10 dark:text-white">Memuat data...</div>;
  if (error) return <div className="text-center py-10 text-red-500 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Pengguna - User View</h1>
            <p className="text-gray-500 dark:text-gray-400">Kelola data akun View</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition active:scale-95 mt-4 sm:mt-0"
          >
            <PlusCircle size={18} />
            Tambah User View
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan username atau nama..."
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
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#27364f]">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">{user.nama_lengkap || "-"}</td>
                  <td className="py-3 px-4">{user.role}</td>
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
                    Tidak ada data user view yang cocok
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
                {editingId !== null ? "Edit User View" : "Tambah User View"}
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
                    placeholder="Nama lengkap pengguna"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={editingId === null}
                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                    placeholder={editingId !== null ? "Kosongkan jika tidak diubah" : ""}
                  />
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