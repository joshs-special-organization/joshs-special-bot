-- CreateTable
CREATE TABLE "botsChannel" (
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "botsChannel_pkey" PRIMARY KEY ("guildId")
);
