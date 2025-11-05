import React from "react"
import { Download, RefreshCw } from "lucide-react"
import * as ExcelJS from "exceljs"
import { KelasListItem, RekapAbsensiResult } from "@/utils/types"

export function ExportButton({
  classesToUse,
  selectedDates,
  onFetchDetailData,
  isFetching,
}: {
  classesToUse: KelasListItem[]
  selectedDates: string[]
  onFetchDetailData: (classIds: number[], startDate: string, endDate: string) => Promise<RekapAbsensiResult[]>
  isFetching: boolean
}) {
  const exportXLSX = async () => {
    if (selectedDates.length === 0 || classesToUse.length === 0) return;

    const classIds = classesToUse.map(k => k.id);
    const sortedDates = selectedDates.slice().sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    try {
      const detailData = await onFetchDetailData(classIds, startDate, endDate);

      if (detailData.length === 0) {
        alert("Tidak ada data absensi yang ditemukan untuk rentang tanggal ini.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Sistem Absensi Sekolah";

      const dataByClassId = new Map<number, RekapAbsensiResult[]>();
      detailData.forEach(siswa => {
        const classId = siswa.id_class;
        dataByClassId.set(classId, [...(dataByClassId.get(classId) || []), siswa]);
      });

      const classesSorted = [...classesToUse].sort((a, b) => a.kelas.localeCompare(b.kelas));

      for (const kls of classesSorted) {
        const siswaInClass = dataByClassId.get(kls.id) || [];
        if (siswaInClass.length === 0) continue;

        const worksheet = workbook.addWorksheet(kls.kelas.substring(0, 31));

        // Header kolom standar + tanggal dinamis
        const columns = [
          { header: "NIS", key: "nis", width: 15 },
          { header: "Nama", key: "nama", width: 25 },
          { header: "JK", key: "jk", width: 5 },
          { header: "Status Siswa", key: "status_siswa", width: 15 },
        ];

        sortedDates.forEach(dateStr => {
          const formattedDate = new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
          columns.push({ header: formattedDate, key: dateStr, width: 15 });
        });

        worksheet.columns = columns;

        siswaInClass.forEach(siswa => {
          const rowData: Record<string, any> = {
            nis: siswa.NIS,
            nama: siswa.Nama,
            jk: siswa.JK,
            status_siswa: siswa.status,
          };

          sortedDates.forEach(dateStr => {
            const absensi = siswa.absensi.find(abs => abs.tanggal === dateStr);
            rowData[dateStr] = absensi ? absensi.keterangan : "-";
          });

          worksheet.addRow(rowData);
        });

        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rekap-absensi-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export Error:', error);
      alert("Gagal mengekspor data. Cek konsol untuk detail error.");
    }
  };

  return (
    <button
      onClick={exportXLSX}
      disabled={selectedDates.length === 0 || classesToUse.length === 0 || isFetching}
      className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors w-full sm:w-auto ${
        selectedDates.length === 0 || classesToUse.length === 0 || isFetching
          ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
          : "bg-green-600 text-white hover:bg-green-500"
      }`}
    >
      {isFetching ? (
        <RefreshCw size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
      Export Excel ({classesToUse.length} Kelas)
    </button>
  );
}
