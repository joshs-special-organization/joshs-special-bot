import client from '../bot'
import { getMuteEmojiId } from '../functions/emoji-mute-vote'

const TIMEOUT_MINS = 2
const REACTION_THRESHOLD_COUNT = 3

client.on('messageReactionAdd', async (reaction, user) => {
	try {
		if (user.bot) return

		const muteEmojiId = await getMuteEmojiId(
			reaction.message.guild?.id as string
		)

		if (!muteEmojiId) {
			console.log(
				`Warning: GuildId=${reaction.message.guild?.id} has no mute emoji configured`
			)
			return
		}

		const reactionCount = reaction.message.reactions.cache.find(
			(reaction) => reaction.emoji.id == muteEmojiId
		)?.count // good lord i do NOT miss javascript what the SIGMA is this

		if (reactionCount != REACTION_THRESHOLD_COUNT) {
			console.log(`Count at ${reactionCount}`)
			return // you're safe... for now.
		}

		const member = await reaction.message.member
			?.timeout(
				TIMEOUT_MINS * 60 * 1000,
				`ALMIGHTY MUTED due to DEMOCRACY MANIFEST`
			)
			.catch(async (err) => {
				console.log(err)
				await reaction.message.reply("Couldn't time out, rip democracy")
				return
			})

		if (member != null) {
			await reaction.message.reply(
				`THIS. IS. DEMOCRACY. MANIFEST.\nThe people have spoken <@${reaction.message.member?.id}>`
			)
			await Promise.all(
				reaction.message.reactions.cache
					.filter(reaction => reaction.emoji.id == muteEmojiId)
					.map(reaction => reaction.remove()));

		}
	} catch (e) {
		console.log(e)
	}
})

export default client
