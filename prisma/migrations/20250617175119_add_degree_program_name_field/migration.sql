/*
  Warnings:

  - Added the required column `degree` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "degree" TEXT NOT NULL;
