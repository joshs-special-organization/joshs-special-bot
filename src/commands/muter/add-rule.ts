import { CommandInteraction, SlashCommandBuilder, User } from 'discord.js'
import { userHasRuleCreated } from '../../functions'
import { prisma } from '../../prisma-client'

const MIN_RULE_LENGTH = 2

export const data = new SlashCommandBuilder()
	.setName('addrule')
	.setDescription('Add a new mute rule for a week')
	.addUserOption((opt) =>
		opt
			.setName('user')
			.setDescription('The user that the rule applies to')
			.setRequired(true)
	)
	.addStringOption((opt) =>
		opt
			.setName('phrase')
			.setDescription(
				`A word or phrase to be muted. Min ${MIN_RULE_LENGTH} letters`
			)
			.setRequired(true)
			.setMinLength(MIN_RULE_LENGTH)
	)

export async function execute(interaction: CommandInteraction) {
	if (await userHasRuleCreated(interaction.user.id, interaction.guildId as string))
		return interaction.reply({
			content: 'You cannot have more than 1 rule at a time on each server',
			ephemeral: true,
		})

	try {
		const { user } = interaction.options.get('user', true) as { user: User }
		const { value } = interaction.options.get('phrase', true) as {
			value: string
		}

		if (user.bot) {
			return interaction.reply({
				content: 'nice try dumbass',
				ephemeral: true,
			})
		}

		if (!user)
			return interaction.reply({
				content: 'No user given',
				ephemeral: true,
			})

		if (!value)
			return interaction.reply({
				content: 'No phrase given',
				ephemeral: true,
			})

		if (value.length < MIN_RULE_LENGTH)
			return interaction.reply({
				content: `Rule too short`,
				ephemeral: true,
			})

		await prisma.muteRule.create({
			data: {
				guildId: interaction.guildId || "NOGUILD",
				createdAt: new Date().toString(),
				creatorId: interaction.user.id,
				forId: user.id,
				phrase: value,
			},
		})

		return interaction.reply(
			`Rule successfully created\n<@${user.id}> will be timed out for saying \`${value}\``
		)
	} catch {
		return interaction.reply({
			content: 'Bro tried it :skull:',
			ephemeral: true,
		})
	}
}
