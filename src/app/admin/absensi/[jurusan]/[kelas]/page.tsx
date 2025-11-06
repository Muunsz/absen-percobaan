"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "../../../../components/Absensi/BreadcrumbKelas";
import {
  Search,
  Calendar,
  Save,
  Loader2,
  User,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Barcode,
} from "lucide-react";

type Siswa = {
  NIS: number;
  Nama: string;
  JK: "L" | "P" | string;
  status: "Aktif" | "NonAktif";
  absen: { status: "HADIR" | "IZIN" | "SAKIT" | "ALPA"; deskripsi: string } | null;
};

type AbsensiItem = {
  NIS: number;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPA";
  deskripsi?: string;
};

type PopupNotification = {
  message: string;
  type: "success" | "error";
} | null;

function pretty(v: string) {
  try {
    return decodeURIComponent(v).replace(/_/g, " ");
  } catch {
    return v.replace(/_/g, " ");
  }
}

const STATUS_META: Record<AbsensiItem["status"], { label: string; icon: string; active: string; idle: string }> = {
  HADIR: {
    label: "Hadir",
    icon: "✓",
    active: "bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/50",
    idle: "bg-gray-700 text-emerald-400 border-gray-600 hover:bg-gray-600/70 dark:bg-gray-700/50 dark:hover:bg-gray-600/70",
  },
  IZIN: {
    label: "Izin",
    icon: "ℹ",
    active: "bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/50",
    idle: "bg-gray-700 text-blue-400 border-gray-600 hover:bg-gray-600/70 dark:bg-gray-700/50 dark:hover:bg-gray-600/70",
  },
  SAKIT: {
    label: "Sakit",
    icon: "🤒",
    active: "bg-amber-600 text-white border-amber-700 shadow-md shadow-amber-500/50",
    idle: "bg-gray-700 text-amber-400 border-gray-600 hover:bg-gray-600/70 dark:bg-gray-700/50 dark:hover:bg-gray-600/70",
  },
  ALPA: {
    label: "Alpa",
    icon: "✗",
    active: "bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/50",
    idle: "bg-gray-700 text-rose-400 border-gray-600 hover:bg-gray-600/70 dark:bg-gray-700/50 dark:hover:bg-gray-600/70",
  },
};

const PopupNotificationComponent: React.FC<{ notification: PopupNotification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  if (!notification) return null;

  const baseClasses =
    "fixed top-5 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out z-50 flex items-center gap-3";
  const successClasses = "bg-green-500 text-white";
  const errorClasses = "bg-red-500 text-white";

  return (
    <div className={`${baseClasses} ${notification.type === "success" ? successClasses : errorClasses}`}>
      {notification.type === "success" ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
      <span className="text-sm font-medium flex-grow">{notification.message}</span>
      <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/20 transition-colors -mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default function KelasAbsensiPage() {
  const { jurusan: jurParam, kelas: kelasParam } = useParams();
  const jurusan = pretty(jurParam as string);
  const kelas = pretty(kelasParam as string);
  const router = useRouter();

  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [absensi, setAbsensi] = useState<AbsensiItem[]>([]);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAlreadyAbsen, setIsAlreadyAbsen] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [popupNotification, setPopupNotification] = useState<PopupNotification>(null);

  const fetchSiswaAndCheckAbsen = useCallback(async () => {
    setLoading(true);
    try {
      const resSiswa = await fetch(
        `/api/absensi/${encodeURIComponent(jurusan)}/${encodeURIComponent(kelas)}?tanggal=${encodeURIComponent(tanggal)}`
      );
      const data = await resSiswa.json();
      if (!resSiswa.ok) throw new Error("Gagal memuat data siswa");
      setSiswaList(data.siswa || []);

      const resCheck = await fetch(
        `/api/absensi/${encodeURIComponent(jurusan)}/${encodeURIComponent(kelas)}?checkOnly=true&tanggal=${encodeURIComponent(tanggal)}`,
        { method: "GET" }
      );

      const alreadyAbsen = resCheck.status === 409;
      setIsAlreadyAbsen(alreadyAbsen);

      if (alreadyAbsen) {
        const absensiDariServer = data.siswa.map((s: Siswa) => ({
          NIS: s.NIS,
          status: s.absen?.status || "HADIR",
          deskripsi: s.absen?.deskripsi || "",
        }));
        setAbsensi(absensiDariServer);
      } else {
        const initialAbsensi = data.siswa.map((s: Siswa) => ({
          NIS: s.NIS,
          status: "HADIR",
          deskripsi: "",
        }));
        setAbsensi(initialAbsensi);
      }

      setShowAlert(false);
    } catch (error) {
      console.error("Error fetching siswa or checking absen:", error);
      setAlertMessage("Gagal memuat data siswa. Silakan coba lagi.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }, [jurusan, kelas, tanggal]);

  useEffect(() => {
    if (jurusan && kelas) {
      fetchSiswaAndCheckAbsen();
    }
  }, [jurusan, kelas, tanggal, fetchSiswaAndCheckAbsen]);

  useEffect(() => {
    if (popupNotification) {
      const timer = setTimeout(() => {
        setPopupNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popupNotification]);

  const filteredSiswa = siswaList.filter(
    (s) => s.Nama.toLowerCase().includes(search.toLowerCase()) || s.NIS.toString().includes(search)
  );

  const handleStatusChange = (nis: number, status: AbsensiItem["status"], deskripsi?: string) => {
    setAbsensi((prev) =>
      prev.map((item) => (item.NIS === nis ? { ...item, status, deskripsi: deskripsi ?? item.deskripsi ?? "" } : item))
    );
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    setPopupNotification(null);
    try {
      const res = await fetch(`/api/absensi/${encodeURIComponent(jurusan)}/${encodeURIComponent(kelas)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tanggal, absensi }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Gagal menyimpan absensi (Status ${res.status}).` }));
        throw new Error(errorData.message || `Gagal menyimpan absensi (Status ${res.status}).`);
      }

      const message = isAlreadyAbsen ? "Absensi berhasil diperbarui!" : "Absensi berhasil disimpan!";
      setPopupNotification({ message, type: "success" });

      setIsAlreadyAbsen(true);

      setSiswaList((prevSiswaList) =>
        prevSiswaList.map((siswa) => {
          const newAbsen = absensi.find((a) => a.NIS === siswa.NIS);
          if (newAbsen) {
            return {
              ...siswa,
              absen: {
                status: newAbsen.status,
                deskripsi: newAbsen.deskripsi || "",
              },
            };
          }
          return siswa;
        })
      );
    } catch (error) {
      setPopupNotification({ message: `Penyimpanan GAGAL! ${(error as Error).message}`, type: "error" });
      console.error("Error saving absensi:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-500" />
        Memuat data siswa...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <PopupNotificationComponent notification={popupNotification} onDismiss={() => setPopupNotification(null)} />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
        <header className="rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 shadow-xl bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-500">
                <span className="text-gray-900 dark:text-white">Absensi Kelas</span> {kelas}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Jurusan: {jurusan}</p>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <Breadcrumb jurusan={jurusan} kelas={kelas} />
        </div>

        {showAlert && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Info:</strong> {alertMessage}
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {isAlreadyAbsen && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Perhatian:</strong> Absensi untuk tanggal <strong>{tanggal}</strong> sudah pernah disimpan. Anda dapat memperbarui data di bawah ini.
              </div>
            </div>
          </div>
        )}

        {/* === RESPONSIVE FILTER SECTION === */}
        <section className="rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Tanggal & Tombol Scan */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="h-10 px-3 py-1 rounded-lg text-sm bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Tombol Scan */}
              <button
                onClick={() => router.push("/admin/absenscan")}
                className="h-10 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                aria-label="Isi Absen via Scan"
              >
                <Barcode className="w-4 h-4" />
                <span className="hidden sm:inline">Isi Absen via Scan</span>
                <span className="sm:hidden">Scan</span>
              </button>
            </div>

            {/* Pencarian */}
            <div className="w-full md:w-[320px]">
              <label className="relative block">
                <span className="sr-only">Cari siswa</span>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  placeholder="Cari nama/NIS siswa…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg text-sm bg-gray-50 text-gray-900 border border-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-500"
                />
              </label>
            </div>
          </div>
        </section>

        {/* === TABEL ABSENSI === */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Daftar Absensi
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Total <span className="font-bold text-blue-500">{filteredSiswa.length}</span> siswa
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold w-[50px]">NO</th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold min-w-[200px]">NAMA</th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold min-w-[300px]">STATUS</th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold min-w-[180px]">ALASAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-base text-gray-500 dark:text-gray-400">
                      Tidak ada siswa ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa, index) => {
                    const current = absensi.find((a) => a.NIS === siswa.NIS) || { status: "HADIR", deskripsi: "" };
                    return (
                      <tr key={siswa.NIS} className="transition-colors hover:bg-gray-500/10">
                        <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{siswa.Nama}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            NIS: <span className="font-mono">{siswa.NIS}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {(["HADIR", "IZIN", "SAKIT", "ALPA"] as const).map((st) => {
                              const meta = STATUS_META[st];
                              const active = current.status === st;
                              return (
                                <button
                                  key={st}
                                  aria-pressed={active}
                                  onClick={() => handleStatusChange(siswa.NIS, st)}
                                  className={`px-3 py-2 text-xs rounded-full font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-1 min-w-[80px] border-2 ${
                                    active ? meta.active : meta.idle
                                  }`}
                                  title={meta.label}
                                >
                                  <span aria-hidden className="text-[12px] font-extrabold leading-none">
                                    {meta.icon}
                                  </span>
                                  <span className="leading-none">{meta.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Masukkan alasan (opsional)"
                            value={current.deskripsi}
                            onChange={(e) => handleStatusChange(siswa.NIS, current.status, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900 border border-gray-300 placeholder:text-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder:text-gray-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 transform shadow-lg min-w-[180px] ${
                saving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isAlreadyAbsen
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isAlreadyAbsen ? "Memperbarui..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  {isAlreadyAbsen ? <RotateCcw className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                  {isAlreadyAbsen ? "Perbarui Absensi" : "Simpan Absensi"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}