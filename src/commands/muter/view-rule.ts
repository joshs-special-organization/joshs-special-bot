import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRuleMadeBy } from "../functions";

export const data = new SlashCommandBuilder()
	.setName("viewrule")
	.setDescription("Shows you the rule you have in place");

export async function execute(interaction: CommandInteraction) {

	let { rule, error } = await getRuleMadeBy(interaction.user.id)

	if (error)
		return await interaction.reply({ content: error, ephemeral: true })

	return interaction.reply({ content: `Phrase \`${rule?.phrase}\` for <@${rule?.for_id}>`, ephemeral: true });
}
