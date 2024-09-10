import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRulesMadeFor } from "../functions";

export const data = new SlashCommandBuilder()
	.setName("myrules")
	.setDescription("Shows you the rules you must follow");

export async function execute(interaction: CommandInteraction) {

	let { rules, error } = await getRulesMadeFor(interaction.user.id)

	if (error)
		return await interaction.reply({ content: error, ephemeral: true })
	if (!rules || rules.length == 0)
		return await interaction.reply({ content: "You have no rules made for you", ephemeral: true })

	let message = rules.map(rule => "`" + rule.phrase + "`").join("\n")

	return interaction.reply({ content: "You'll get muted for saying of any of these: \n" + message, ephemeral: true });
}
