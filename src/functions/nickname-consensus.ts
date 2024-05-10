import { GuildMember } from 'discord.js'
import { prisma } from '../prisma-client'

export async function getIntendedNickname(member: GuildMember) {
    const record = await prisma.nickname.findFirst({
        where: {
            guildId: member.guild.id,
            userId: member.user.id,
        },
    })
    return record?.nickname
}

export function getFallbackNickname(member: GuildMember) {
    return member.user.username
}

export async function setIntendedNickname(member: GuildMember) {
    const intendedNickname =
        (await getIntendedNickname(member)) || getFallbackNickname(member)

    await member.setNickname(intendedNickname, 'Because')
}
