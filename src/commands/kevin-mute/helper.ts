import { prisma } from '../../prisma-client'

export async function getKevinId(guildId: string) {
    const record = await prisma.kevinId.findFirst({
        where: { guildId },
    })

    return record?.kevinId
}

export async function getBotsChannelId(guildId: string) {
    const row = await prisma.botsChannel.findUnique({ where: { guildId } })
    return row?.channelId ?? null
}
