/*
  Warnings:

  - You are about to drop the `nickname_rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "nickname_rules";

-- CreateTable
CREATE TABLE "nickname" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nickname_pkey" PRIMARY KEY ("id")
);
