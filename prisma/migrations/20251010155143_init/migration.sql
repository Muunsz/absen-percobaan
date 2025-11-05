-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_id_kelas_fkey";

-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_id_mapel_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "id_kelas" DROP NOT NULL,
ALTER COLUMN "id_mapel" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "Mapel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
