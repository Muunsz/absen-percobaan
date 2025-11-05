"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, PlusCircle, X, Search, BookOpen } from "lucide-react";

interface OptionJur {
    id: number;
    jurusan: string;
};

interface OptionGuru {
    id: number;
    username: string;
    nama_lengkap: string;
}

type kelas = {
    id: number;
    kelas: string;
    id_jurusan: number;
    id_waliKelas: number;
    Jurusan: {
        jurusan: string; // assuming your Jurusan model has a "jurusan" field
    } | null;
    Account_kelas_id_waliKelasToAccount: {
        username: string; // assuming your Account model has a "username" field
        nama_lengkap: string | null;
    } | null;
};

export default function KelasClient({ kelass }: { kelass: kelas[] }) {
    const [nama, setNama] = useState("");
    const [selectedJurusanId, setSelectedJurusanId] = useState<number | string>("");
    const [selectedGuruId, setSelectedGuruId] = useState<number | string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<OptionJur[]>([]);
    const [optionsGuru, setOptionsGuru] = useState<OptionGuru[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch("/api/options/jurusan");
                if (!response.ok) throw new Error("Failed to fetch");
                const data: OptionJur[] = await response.json();
                setOptions(data);
                if (data.length > 0) {
                    setSelectedJurusanId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch("/api/options/guru");
                if (!response.ok) throw new Error("Failed to fetch");
                const data: OptionGuru[] = await response.json();
                setOptionsGuru(data);
                if (data.length > 0) {
                    setSelectedGuruId(data[0].id);
                }
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    const filteredkelass = kelass.filter(kelas =>
        kelas.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!nama.trim()) return alert("Nama kelas wajib diisi");
        if (selectedJurusanId === "" || selectedGuruId === "") {
            return alert("Jurusan dan Wali Kelas wajib dipilih");
        }

        const url = editingId !== null ? `/api/kelas/${editingId}` : "/api/kelas";
        const method = editingId !== null ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                kelas: nama.trim(),
                id_jurusan: Number(selectedJurusanId),
                id_waliKelas: Number(selectedGuruId),
            }),
        });

        if (res.ok) {
            window.location.reload();
        } else {
            alert("Gagal menyimpan data");
        }

        setModalOpen(false);
        resetForm();
    }

    const handleEdit = (kelas: kelas) => {
        setNama(kelas.kelas);
        setSelectedJurusanId(kelas.id_jurusan);
        setSelectedGuruId(kelas.id_waliKelas);
        setEditingId(kelas.id);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus mata pelajaran ini beserta relasinya?")) return;

        const res = await fetch(`/api/kelas/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            window.location.reload();
        } else {
            alert("Gagal menghapus data");
        }
    };

    const resetForm = () => {
        setNama("");
        setEditingId(null);
        if (options.length > 0) setSelectedJurusanId(options[0].id);
        if (optionsGuru.length > 0) setSelectedGuruId(optionsGuru[0].id);
    };

    const handleCloseModals = () => {
        setModalOpen(false);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] dark:text-white transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white dark:bg-[#1e293b] p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-4 sm:gap-0">
                    <div className="text-center sm:text-left">
                        <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-xl sm:text-2xl font-bold">Manajemen Kelas</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Kelola data kelas dan guru pengajarnya
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                resetForm();
                                setModalOpen(true);
                            }}
                            className="flex items-center justify-center sm:justify-start gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
                        >
                            <PlusCircle size={18} />
                            Tambah kelas
                        </button>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center justify-center sm:justify-start gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari mata pelajaran..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1e293b]/70 backdrop-blur-lg shadow-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 uppercase text-xs">
                            <tr>
                                <th scope="col" className="py-4 px-5 text-left font-semibold min-w-[60px]">No</th>
                                <th scope="col" className="py-4 px-5 text-left font-semibold min-w-[150px]">Nama kelas</th>
                                <th scope="col" className="py-4 px-5 text-left font-semibold min-w-[180px]">Jurusan</th>
                                <th scope="col" className="py-4 px-5 text-left font-semibold min-w-[180px]">Wali Kelas</th>
                                <th scope="col" className="py-4 px-5 text-left font-semibold min-w-[120px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredkelass.map((kelas, index) => (
                                <tr key={kelas.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <td className="py-4 px-5">{index + 1}</td>
                                    <td className="py-4 px-5">{kelas.kelas}</td>
                                    <td className="py-4 px-5">
                                        {kelas.Jurusan?.jurusan || "—"}
                                    </td>
                                    <td className="py-4 px-5">
                                        {kelas.Account_kelas_id_waliKelasToAccount?.nama_lengkap ||
                                            kelas.Account_kelas_id_waliKelasToAccount?.username ||
                                            "—"}
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleEdit(kelas)}
                                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium transition"
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(kelas.id)}
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

                {/* Modal */}
                {modalOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={handleCloseModals}
                    >
                        <div
                            className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-md relative shadow-xl border border-gray-200 dark:border-gray-700 mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleCloseModals}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-lg font-bold mb-4">
                                {editingId !== null ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
                            </h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kelas
                                    </label>
                                    <input
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        required
                                        className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan nama mata pelajaran"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Jurusan
                                    </label>
                                    <select id="mapel" name="mapel"
                                        value={selectedJurusanId}
                                        onChange={(e) => setSelectedJurusanId(Number(e.target.value))}
                                        className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {options.map((option) => (
                                            <option key={option.id} value={option.id} className="dark:bg-[#0f172a]">
                                                {option.jurusan}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Wali Kelas
                                    </label>
                                    <select id="mapel" name="mapel"
                                        value={selectedGuruId}
                                        onChange={(e) => setSelectedGuruId(Number(e.target.value))}
                                        className="mt-2 w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {optionsGuru.map((option) => (
                                            <option key={option.id} value={option.id} className="dark:bg-[#0f172a]">
                                                {option.nama_lengkap}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
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