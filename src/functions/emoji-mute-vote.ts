import { GuildMember } from 'discord.js'
import { prisma } from '../prisma-client'

export async function getMuteEmojiId(guildId: string) {
	const record = await prisma.muteEmoji.findFirst({
		where: {
			guildId
		},
	})
	return record?.emojiId
}