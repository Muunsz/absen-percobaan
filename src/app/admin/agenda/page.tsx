"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Calendar } from "lucide-react";
import AgendaCard from "../../components/agenda/AgendaCard";
import AgendaFilters from "../../components/agenda/AgendaFilters";
import AddAgendaForm from "../../components/agenda/AddAgendaFormUmum";
import Modal from "../../components/UI/Modal";
import AgendaDetail from "../../components/agenda/AgendaDetail";

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

type ModalState = {
  isOpen: boolean;
  mode: "add" | "edit" | "view" | null;
  agendaId: string | null;
};

export default function AgendaListPage() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [daftarGuru, setDaftarGuru] = useState<{ id: number; nama_lengkap: string }[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<{ id: number; nama: string }[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: null, agendaId: null });

  const selectedAgenda = useMemo(() => {
    return agendas.find(a => a.id === modalState.agendaId);
  }, [agendas, modalState.agendaId]);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: null as number | null,
    kelasId: null as number | null,
    guruId: null as number | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaRes, guruRes, kelasRes] = await Promise.all([
          fetch("/api/agenda"),
          fetch("/api/agenda/guru"),
          fetch("/api/agenda/kelas"),
        ]);
        if (!agendaRes.ok || !guruRes.ok || !kelasRes.ok) throw new Error("Gagal mengambil data");
        setAgendas(await agendaRes.json());
        setDaftarGuru(await guruRes.json());
        const kelasData = await kelasRes.json();
        console.log("Data Kelas:", kelasData);
        setDaftarKelas(kelasData);
      } catch (error) {
        console.error("Error fetching", error);
        setToastMsg("Gagal memuat data agenda.");
        setTimeout(() => setToastMsg(null), 3000);
      }
    };
    fetchData();
  }, []);

  const filteredAgendas = useMemo(() => {
    return agendas.filter((agenda) => {
      const agendaDate = new Date(agenda.date.replace(/-/g, "/"));
      const yearMatch = agendaDate.getFullYear() === filters.year;
      const monthMatch = filters.month === null || agendaDate.getMonth() === filters.month;
      const kelasMatch = filters.kelasId === null || agenda.id_kelas === filters.kelasId;
      const guruMatch = filters.guruId === null || agenda.id_guru === filters.guruId;
      return yearMatch && monthMatch && kelasMatch && guruMatch;
    });
  }, [agendas, filters]);

  const closeModal = () => setModalState({ isOpen: false, mode: null, agendaId: null });
  const openAddModal = () => setModalState({ isOpen: true, mode: "add", agendaId: null });
  const handleEditAgenda = (id: string) => setModalState({ isOpen: true, mode: "edit", agendaId: id });
  const handleViewAgenda = (id: string) => setModalState({ isOpen: true, mode: "view", agendaId: id });

  const handleSaveAgenda = async (formData: FormData, id?: string) => {
    const isEdit = !!id;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/agenda/${id}` : "/api/agenda";

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(`Gagal ${isEdit ? "mengubah" : "menambahkan"} agenda`);
      const updatedAgenda = await res.json();

      setAgendas(prev =>
        isEdit ? prev.map(a => (a.id === id ? updatedAgenda : a)) : [...prev, updatedAgenda]
      );

      setToastMsg(`Agenda berhasil di${isEdit ? "ubah" : "tambahkan"}.`);
      closeModal();
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error) {
      setToastMsg(`Gagal ${isEdit ? "mengubah" : "menambahkan"} agenda.`);
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;
    try {
      const res = await fetch(`/api/agenda/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus agenda");
      setAgendas(prev => prev.filter(a => a.id !== id));
      setToastMsg("Agenda berhasil dihapus.");
      setTimeout(() => setToastMsg(null), 2500);
    } catch (error) {
      setToastMsg("Gagal menghapus agenda.");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full rounded-lg border border-green-200 bg-green-50 text-green-900 shadow-lg dark:border-green-800 dark:bg-gray-900 dark:text-green-200 animate-fade-in"
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-green-500" />
              <div className="text-sm font-medium">{toastMsg}</div>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-xs text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white"
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0 border dark:border-white/10 rounded-lg p-4 dark:bg-gray-800">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-semibold">Daftar Agenda</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kelola semua agenda sekolah</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Tambah Agenda
          </button>
        </div>

        <AgendaFilters
          onFilterChange={setFilters}
          daftarKelas={daftarKelas}
          daftarGuru={daftarGuru}
        />

        <section className="mt-6">
          {filteredAgendas.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tidak Ada Agenda</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Tidak ada agenda yang sesuai dengan filter yang dipilih.
              </p>
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 text-sm transition-colors font-medium shadow-md"
              >
                <Plus className="w-4 h-4" />
                Buat Agenda Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAgendas.map((agenda) => (
                <AgendaCard
                  key={agenda.id}
                  agenda={agenda}
                  daftarGuru={daftarGuru}
                  daftarKelas={daftarKelas}
                  onView={handleViewAgenda}
                  onEdit={handleEditAgenda}
                  onDelete={handleDeleteAgenda}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.mode === "add"
            ? "Tambah Agenda Baru"
            : modalState.mode === "edit"
            ? `Edit Agenda: ${selectedAgenda?.judul || "..."}`
            : "Detail Agenda"
        }
        size={modalState.mode === "view" ? "md" : "lg"}
      >
        {(modalState.mode === "add" || modalState.mode === "edit") && (
          <AddAgendaForm
            onAdd={handleSaveAgenda}
            daftarGuru={daftarGuru}
            daftarKelas={daftarKelas}
            initialData={modalState.mode === "edit" ? selectedAgenda : undefined}
            onCancel={closeModal}
          />
        )}

        {modalState.mode === "view" && selectedAgenda && (
          <AgendaDetail
            agenda={selectedAgenda}
            daftarGuru={daftarGuru}
            daftarKelas={daftarKelas}
          />
        )}
      </Modal>
    </div>
  );
}
