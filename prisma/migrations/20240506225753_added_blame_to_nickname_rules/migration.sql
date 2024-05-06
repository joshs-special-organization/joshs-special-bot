/*
  Warnings:

  - Added the required column `setByUserId` to the `nickname` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nickname" ADD COLUMN     "setByUserId" TEXT NOT NULL;
