-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SEKRETARIS', 'GURUMP', 'GURUBK', 'TU', 'WALAS');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
