-- CreateTable
CREATE TABLE "Nickname" (
    "id" SERIAL NOT NULL,
    "guildId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nickname_pkey" PRIMARY KEY ("id")
);
