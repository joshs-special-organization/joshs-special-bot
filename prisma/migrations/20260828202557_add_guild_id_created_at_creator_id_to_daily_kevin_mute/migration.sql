-- CreateTable
CREATE TABLE "dailyKevinMute" (
    "guildId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "dailyKevinMute_pkey" PRIMARY KEY ("creatorId","guildId")
);
