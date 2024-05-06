/*
  Warnings:

  - The primary key for the `nickname` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `nickname` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nickname" DROP CONSTRAINT "nickname_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "nickname_pkey" PRIMARY KEY ("guildId", "userId");
