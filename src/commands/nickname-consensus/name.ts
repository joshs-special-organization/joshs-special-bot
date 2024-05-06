import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("name")
	.setDescription("Change a user's nickname")
  .addMentionableOption(option =>
    option
    .setName("user")
    .setDescription("Who's nickname to change")
    .setRequired(true)
  )
  .addStringOption(option =>
    option
    .setName("nickname")
    .setDescription("Their new nickname until someone changes it")
    .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  // get victim user
  // ensure it is not
	return interaction.reply({ content: "pong" })
}