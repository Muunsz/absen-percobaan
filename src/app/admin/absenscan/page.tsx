"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Barcode,
  Play,
  StopCircle,
  Save,
  Search,
  User,
  Trash2,
  RotateCcw,
  LayoutList,
  Grid3x3,
  Keyboard,
} from "lucide-react";
import SiswaCard from "../../components/Absensi/SiswaCard";

interface SiswaTerpindai {
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
}

export default function AbsenScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [scannedStudents, setScannedStudents] = useState<SiswaTerpindai[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [classInfo, setClassInfo] = useState<{ kelas: string; jurusan: string } | null>(null);

  const [filterKelas, setFilterKelas] = useState<string | null>(null);
  const [filterJurusan, setFilterJurusan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isScanning && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [isScanning]);

  const showNotification = useCallback((type: "success" | "warning" | "error", message: string) => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else if (type === "warning") {
      setWarningMessage(message);
      setTimeout(() => setWarningMessage(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  const processNIS = useCallback(async (nis: string) => {
    if (!nis.trim()) return;

    if (scannedStudents.some(s => s.nis === nis)) {
      showNotification("warning", "Anda sudah mengabsen siswa ini.");
      playSound("error");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/absensi/scan/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nis }),
      });

      const data = await res.json();

      if (data.status === "success") {
        const newStudent: SiswaTerpindai = {
          nis: data.data.nis,
          nama: data.data.nama,
          kelas: data.data.kelas,
          jurusan: data.data.jurusan,
        };

        if (!classInfo) {
          setClassInfo({
            kelas: data.data.kelas,
            jurusan: data.data.jurusan
          });
        }

        setScannedStudents(prev => [newStudent, ...prev]);
        showNotification("success", `✅ Berhasil! ${newStudent.nama} - ${newStudent.kelas} - Hadir.`);
        playSound("success");
      } else if (data.status === "warning") {
        showNotification("warning", data.message);
        playSound("error");
      } else {
        showNotification("error", data.message || "Data tidak ditemukan.");
        playSound("error");
      }
    } catch (err) {
      showNotification("error", "Gagal memverifikasi data. Silakan coba lagi.");
      playSound("error");
    } finally {
      setLoading(false);
      setInputValue("");
      if (isScanning && hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }
  }, [classInfo, scannedStudents, showNotification, isScanning]);

  const handleHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleHiddenKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isScanning) {
      const nis = inputValue.trim();
      if (nis) processNIS(nis);
    }
  };

  const handleManualSubmit = () => {
    const nis = inputValue.trim();
    if (nis) {
      processNIS(nis);
    }
  };

  const removeStudent = (nis: string) => {
    setScannedStudents(prev => {
      const updated = prev.filter(s => s.nis !== nis);
      if (updated.length === 0) setClassInfo(null);
      return updated;
    });
  };

  const clearAll = () => {
    setScannedStudents([]);
    setClassInfo(null);
    setFilterKelas(null);
    setFilterJurusan(null);
  };

  const handleConfirm = async () => {
    if (scannedStudents.length === 0) {
      showNotification("error", "Belum ada siswa yang dipindai.");
      return;
    }

    setLoading(true);
    try {
      const classId = await getClassId(classInfo?.kelas || "");
      if (!classId) {
        throw new Error("Kelas tidak ditemukan.");
      }

      const res = await fetch("/api/absensi/scan/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scannedStudents: scannedStudents.map(s => s.nis),
          classId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification("success", `🎉 Konfirmasi berhasil! ${scannedStudents.length} siswa hadir, siswa lain izin otomatis.`);
        setTimeout(() => {
          router.push("/admin/absensi");
        }, 3000);
      } else {
        showNotification("error", data.message || "Gagal menyimpan absensi.");
      }
    } catch (err) {
      showNotification("error", "Gagal menyimpan absensi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getClassId = async (className: string) => {
    try {
      const res = await fetch(`/api/absensi/class?nama=${encodeURIComponent(className)}`);
      const data = await res.json();
      return data.id;
    } catch {
      return null;
    }
  };

  const playSound = (type: "success" | "error") => {
    const audio = new Audio(`/audio/${type}.mp3`);
    audio.play().catch(() => {});
  };

  // 🔹 Panel Scan - Tanpa gradasi, UI bersih
  const ScanPanel = () => (
    <div className="rounded-2xl p-6 mb-6 shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Barcode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mode Pemindaian Aktif</h2>
        </div>
        <button
          onClick={() => setIsScanning(false)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors duration-300 shadow-md"
        >
          <StopCircle className="w-4 h-4" />
          <span>Stop Scan</span>
        </button>
      </div>

      <input
        ref={hiddenInputRef}
        type="text"
        value={inputValue}
        onChange={handleHiddenInputChange}
        onKeyDown={handleHiddenKeyDown}
        className="absolute left-[-9999px] top-[-9999px]"
        autoFocus={isScanning}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Area Visual */}
      <div className="relative bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 text-center mb-5 border-2 border-dashed border-blue-400 dark:border-blue-600/50">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-pulse"></div>
          <Barcode className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" />
        </div>
        <p className="text-blue-700 dark:text-blue-300 font-medium">
          Arahkan pemindai ke QR/Barcode siswa
        </p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-50 dark:bg-blue-900/10 rotate-45 border-l border-b border-blue-400 dark:border-blue-600/50"></div>
      </div>

      {/* Input Manual - Diperbagus */}
      <div className="text-center mb-5">
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <Keyboard className="w-4 h-4" />
          {showManualInput ? "Sembunyikan input manual" : "Masukkan NIS manual"}
        </button>
      </div>

      {/* Input Manual - Diperbagus dengan margin bawah */}
        {showManualInput && (
        <div className="mt-5 mb-4 animate-fade-in"> {/* <-- Tambahkan mb-4 di sini */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <label htmlFor="manual-nis" className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Masukkan NIS Siswa Secara Manual
            </label>
            <div className="flex gap-3">
                <input
                id="manual-nis"
                ref={manualInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik NIS..."
                className="flex-1 h-11 px-4 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                onClick={handleManualSubmit}
                disabled={loading || !inputValue.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors disabled:opacity-60"
                >
                Tambah
                </button>
            </div>
            </div>
        </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
        <strong>💡 Tips:</strong> Scanner harus mengirim NIS + Enter secara otomatis.
        </div>
    </div>
  );

  const uniqueKelas = [...new Set(scannedStudents.map(s => s.kelas))];
  const uniqueJurusan = [...new Set(scannedStudents.map(s => s.jurusan))];

  const filteredAndSearched = scannedStudents.filter(student => {
    const matchesKelas = !filterKelas || student.kelas === filterKelas;
    const matchesJurusan = !filterJurusan || student.jurusan === filterJurusan;
    const matchesSearch = student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.nis.includes(searchTerm);
    return matchesKelas && matchesJurusan && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="rounded-2xl p-6 mb-6 shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Barcode className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Absensi Scan QR/Barcode</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Pindai QR/Barcode atau masukkan NIS secara manual untuk absensi cepat.
              </p>
            </div>
          </div>
        </header>

        {!isScanning ? (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setIsScanning(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors duration-300 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Mulai Scan
            </button>
          </div>
        ) : (
          <ScanPanel />
        )}

        {/* Filter & Search */}
        {scannedStudents.length > 0 && (
          <section className="mb-6 p-5 bg-white rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterKelas || ""}
                  onChange={(e) => setFilterKelas(e.target.value || null)}
                  className="h-11 px-4 rounded-xl text-sm border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kelas</option>
                  {uniqueKelas.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>

                <select
                  value={filterJurusan || ""}
                  onChange={(e) => setFilterJurusan(e.target.value || null)}
                  className="h-11 px-4 rounded-xl text-sm border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Jurusan</option>
                  {uniqueJurusan.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama/NIS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-xl ${viewMode === "list" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700"}`}
                    title="Daftar"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-xl ${viewMode === "grid" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700"}`}
                    title="Kotak"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Daftar Siswa Terpindai */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Siswa Terpindai ({filteredAndSearched.length})
              </h2>
            </div>
            {scannedStudents.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Hapus Semua
              </button>
            )}
          </div>

          {filteredAndSearched.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 opacity-60">
                <Search className="w-full h-full" />
              </div>
              Tidak ada siswa yang sesuai filter/pencarian.
            </div>
          ) : viewMode === "list" ? (
            <div className="rounded-2xl shadow overflow-hidden bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSearched.map((student, index) => (
                  <li key={student.nis} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-sm font-bold w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                        {index + 1}
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">{student.nama}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.kelas} • {student.jurusan}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
                      <button
                        onClick={() => removeStudent(student.nis)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Hapus dari daftar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAndSearched.map((student) => (
                <SiswaCard
                  key={student.nis}
                  nama={student.nama}
                  nis={student.nis}
                  kelas={student.kelas}
                  jurusan={student.jurusan}
                  onRemove={() => removeStudent(student.nis)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tombol Konfirmasi */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={loading || scannedStudents.length === 0}
            className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-colors duration-300 shadow min-w-[200px] ${
              loading || scannedStudents.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Konfirmasi Kehadiran
              </>
            )}
          </button>
        </div>

        {/* Notifikasi Toast */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
        {warningMessage && (
          <div className="fixed bottom-6 right-6 bg-yellow-500 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{warningMessage}</span>
          </div>
        )}
        {error && (
          <div className="fixed bottom-6 right-6 bg-red-500 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}