/*
  Warnings:

  - Added the required column `address` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL,
ADD COLUMN     "websiteUrl" TEXT;
