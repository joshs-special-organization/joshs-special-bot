import { prisma } from "../../prisma-client"

export async function getKevinId(guildId: string) {
    const record = await prisma.kevinId.findFirst({ 
        where: { guildId }
    })

    return record?.kevinId
}