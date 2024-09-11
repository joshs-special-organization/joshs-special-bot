import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getRuleMadeBy } from '../../functions'

export const data = new SlashCommandBuilder()
	.setName('viewrule')
	.setDescription('Shows you the rule you have in place')

export async function execute(interaction: CommandInteraction) {
	const { rule, error } = await getRuleMadeBy(interaction.user.id, interaction.guildId as string)

	if (error)
		return await interaction.reply({ content: error, ephemeral: true })

	return interaction.reply({
		content: `Phrase \`${rule?.phrase}\` for <@${rule?.forId}>`,
		ephemeral: true,
	})
}
