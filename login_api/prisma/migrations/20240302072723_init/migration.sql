/*
  Warnings:

  - Added the required column `phNo` to the `login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "login" DROP COLUMN "phNo",
ADD COLUMN     "phNo" INTEGER NOT NULL;
