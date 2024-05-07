import { ChatInputCommandInteraction, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { prisma } from '../../prisma-client';
import { getIntendedNickname, setIntendedNickname, getFallbackNickname } from "../../functions/nickname-consensus";

// https://discordjs.guide/slash-commands/parsing-options.html#subcommands
// https://discordjs.guide/slash-commands/parsing-options.html#command-options

export const data = new SlashCommandBuilder()
	.setName("name")
	.setDescription("Change a user's nickname")

	.addSubcommand(subcommand =>
		subcommand
			.setName("set")
			.setDescription("Set a user's nickname")

			.addUserOption(option =>
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
	)

	.addSubcommand(subcommand =>
		subcommand
			.setName("reset")
			.setDescription("Reset a user's nickname to their discord name")

			.addUserOption(option =>
				option
					.setName("user")
					.setDescription("Who's nickname to reset")
					.setRequired(true)
			)
	)

	.addSubcommand(subcommand =>
		subcommand
			.setName("info")
			.setDescription("Reveals info about your name")
	)


export async function execute(interaction: ChatInputCommandInteraction) {
	let mentionedUser = interaction.options.getMember('user') as GuildMember | null;
	let member = interaction.member as GuildMember | null;
	let guild = interaction.guild

	if (!mentionedUser || !member || !guild)
		return interaction.reply({ content: "uhh uhhmmm uhh", ephemeral: true })

	let oldNickname;
	if (["set", "reset"].includes(interaction.options.getSubcommand())) {
		if (mentionedUser.user.id == interaction.user.id) {
			return interaction.reply({ content: "Only other users can alter your nickname", ephemeral: true })
		}

		oldNickname = mentionedUser.nickname || getFallbackNickname(mentionedUser);
	}

	switch (interaction.options.getSubcommand()) {
		case "set":
			const intendedNickname = interaction.options.getString('nickname');

			if (!intendedNickname)
				return interaction.reply({ content: "No nickname given", ephemeral: true })

			if (await getIntendedNickname(mentionedUser) == intendedNickname)
				return interaction.reply({ content: `<@${mentionedUser.id}> already has that nickname`, ephemeral: true })

			// update, or create if it does not exist
			await prisma.nickname.upsert({
				where: {
					ruleId: {
						guildId: mentionedUser.guild.id,
						userId: mentionedUser.user.id
					}
				},
				update: {
					nickname: intendedNickname,
					setByUserId: interaction.user.id
				},
				create: {
					guildId: mentionedUser.guild.id,
					userId: mentionedUser.user.id,
					nickname: intendedNickname,
					setByUserId: interaction.user.id
				}
			})
			await setIntendedNickname(mentionedUser);
			return interaction.reply({ content: `<@${mentionedUser.id}>: Your name has been updated from **${oldNickname}** to **${intendedNickname}**` })

		case "reset":
			if (!await getIntendedNickname(mentionedUser))
				return interaction.reply({ content: `<@${mentionedUser.id}> currently has no nickname`, ephemeral: true })

			// If they have a nickname to reset
			await prisma.nickname.delete({
				where: {
					ruleId: {
						guildId: mentionedUser.guild.id,
						userId: mentionedUser.user.id
					}
				}
			})
			await setIntendedNickname(mentionedUser);
			return interaction.reply({ content: `Reset <@${mentionedUser.id}> from **${oldNickname}** to **${mentionedUser.user.username}**` })

		case "info":
			if (!await getIntendedNickname(member)) {
				return interaction.reply({ content: "No one has set your nickname, yet...", ephemeral: true })
			}

			// If they have a nickname to get info about
			const record = await prisma.nickname.findFirst({
				where: {
					guildId: guild.id,
					userId: interaction.user.id
				}
			})
			return interaction.reply({ content: `Your current nickname was set by <@${record?.setByUserId}>`, ephemeral: true })

	}

	return interaction.reply({ content: "Error, unknown subcommand.", ephemeral: true })
}