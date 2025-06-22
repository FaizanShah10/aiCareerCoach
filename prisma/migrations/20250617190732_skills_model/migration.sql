/*
  Warnings:

  - You are about to drop the column `skills` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "skills";

-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
