import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRuleMadeBy, removeRuleMadeBy } from "../functions";

export const data = new SlashCommandBuilder()
	.setName("removerule")
	.setDescription("Removes the rule you have currently made");

export async function execute(interaction: CommandInteraction) {

	let { rule, error: _ } = await getRuleMadeBy(interaction.user.id)
	let { error } = await removeRuleMadeBy(interaction.user.id)

	if (error)
		return await interaction.reply({ content: error, ephemeral: true });

	return await interaction.reply(`You have removed your rule\nPhrase \`${rule?.phrase}\` for <@${rule?.for_id}>`);
}
