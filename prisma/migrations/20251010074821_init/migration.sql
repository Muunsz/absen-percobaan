/*
  Warnings:

  - The values [GURUMP,GURUBK,TU,WALAS] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Agenda` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_kelas` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_mapel` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('laki_laki', 'perempuan');

-- CreateEnum
CREATE TYPE "Absent" AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALPA');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SEKRETARIS', 'GURU', 'VIEW');
ALTER TABLE "Account" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "id_kelas" INTEGER NOT NULL,
ADD COLUMN     "id_mapel" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Agenda";

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "class" TEXT NOT NULL,
    "id_jurusan" INTEGER NOT NULL,
    "id_waliKelas" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jurusan" (
    "id" SERIAL NOT NULL,
    "jurusan" TEXT NOT NULL,

    CONSTRAINT "Jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda_Kelas" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "time_start" TIME NOT NULL,
    "time_end" TIME NOT NULL,
    "id_class" INTEGER NOT NULL,
    "id_mapel" INTEGER NOT NULL,
    "materi" TEXT,
    "keterangan" TEXT,
    "id_guru" INTEGER NOT NULL,
    "doc_path" TEXT,

    CONSTRAINT "Agenda_Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda_Khusus" (
    "id" SERIAL NOT NULL,
    "deskripsi" TEXT,
    "date" DATE NOT NULL,
    "time_start" TIME NOT NULL,
    "time_end" TIME NOT NULL,
    "materi" TEXT NOT NULL,
    "keterangan" TEXT,
    "lokasi" TEXT NOT NULL,
    "id_guru" INTEGER NOT NULL,
    "id_kelas" INTEGER,
    "doc_path" TEXT,

    CONSTRAINT "Agenda_Khusus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jadwal" (
    "id" SERIAL NOT NULL,
    "hari" TEXT NOT NULL,
    "waktu_mulai" TIME NOT NULL,
    "waktu_selesai" TIME NOT NULL,
    "id_class" INTEGER NOT NULL,
    "id_mapel" INTEGER NOT NULL,
    "id_guru" INTEGER NOT NULL,

    CONSTRAINT "Jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "NIS" INTEGER NOT NULL,
    "Nama" TEXT NOT NULL,
    "JK" "Gender" NOT NULL,
    "status" "Status" NOT NULL,
    "id_class" INTEGER NOT NULL,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("NIS")
);

-- CreateTable
CREATE TABLE "Absensi" (
    "id" SERIAL NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "keterangan" "Absent" NOT NULL,
    "tanggal" DATE NOT NULL,

    CONSTRAINT "Absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rekap_Agenda" (
    "id" SERIAL NOT NULL,
    "tanggal" DATE NOT NULL,
    "id_class" INTEGER NOT NULL,
    "id_agenda" INTEGER NOT NULL,

    CONSTRAINT "Rekap_Agenda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "Mapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_id_jurusan_fkey" FOREIGN KEY ("id_jurusan") REFERENCES "Jurusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_id_waliKelas_fkey" FOREIGN KEY ("id_waliKelas") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda_Kelas" ADD CONSTRAINT "Agenda_Kelas_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda_Kelas" ADD CONSTRAINT "Agenda_Kelas_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "Mapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda_Kelas" ADD CONSTRAINT "Agenda_Kelas_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda_Khusus" ADD CONSTRAINT "Agenda_Khusus_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda_Khusus" ADD CONSTRAINT "Agenda_Khusus_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "Mapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absensi" ADD CONSTRAINT "Absensi_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "Siswa"("NIS") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rekap_Agenda" ADD CONSTRAINT "Rekap_Agenda_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rekap_Agenda" ADD CONSTRAINT "Rekap_Agenda_id_agenda_fkey" FOREIGN KEY ("id_agenda") REFERENCES "Agenda_Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
