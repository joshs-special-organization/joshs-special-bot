import { prisma } from '../prisma-client'

export async function getMuteEmojiId(guildId: string) {
    try {
        const record = await prisma.muteEmoji.findFirst({
            where: {
                guildId,
            },
        })

        return record?.emojiId
    }
    catch {
        return undefined;
    }
}
