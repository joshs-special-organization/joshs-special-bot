import { CommandInteraction, Guild, GuildMember, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../deploy-commands";
import { isMemberMod } from "../functions";


export const data = new SlashCommandBuilder()
	.setName("refreshcommands")
	.setDescription("Refreshes the slash commands");

export async function execute(interaction: CommandInteraction) {
	let member = interaction.member

	if (!isMemberMod(member)) {
		interaction.reply({ content: "Sorry, you do not have permission", ephemeral: true })
	}

	await deployCommands(interaction.guildId!)
	return interaction.reply({ content: "Refreshed commands successfully", ephemeral: true })

}