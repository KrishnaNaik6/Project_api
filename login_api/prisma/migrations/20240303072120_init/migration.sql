/*
  Warnings:

  - Added the required column `date_time` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL;
