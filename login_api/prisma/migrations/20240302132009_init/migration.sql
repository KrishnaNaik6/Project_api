/*
  Warnings:

  - Added the required column `login_time` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "login_time" INTEGER NOT NULL;
