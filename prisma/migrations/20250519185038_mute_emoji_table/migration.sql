-- CreateTable
CREATE TABLE "muteEmoji" (
    "guildId" TEXT NOT NULL,
    "emojiId" TEXT NOT NULL,

    CONSTRAINT "muteEmoji_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "muteRule" (
    "guildId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "forId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "phrase" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "muteRule_creatorId_guildId_key" ON "muteRule"("creatorId", "guildId");
