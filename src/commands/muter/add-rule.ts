import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { userHasRuleCreated } from "../../functions";
import { prisma } from "../../prisma-client";

const MIN_RULE_LENGTH = 2;



export const data = new SlashCommandBuilder()
	.setName("addrule")
	.setDescription("Add a new mute rule for a week")
	.addUserOption(opt => opt.setName("user").setDescription("The user that the rule applies to"))
	.addStringOption(opt => opt.setName("phrase").setDescription(`A word or phrase to be muted. Min ${MIN_RULE_LENGTH} letters`))

export async function execute(interaction: CommandInteraction) {

	if (await userHasRuleCreated(interaction.user.id))
		return interaction.reply({ content: "You cannot have more than 1 rule at a time", ephemeral: true })

	try {
		const { user } = interaction.options.get("user", true) as { user: User }
		const { value } = interaction.options.get("phrase", true) as { value: string }

		if (user.id == "1234553438784983112" || user.bot) {
			return interaction.reply({ content: "nice try dumbass", ephemeral: true })
		}

		if (!user)
			return interaction.reply({ content: "No user given", ephemeral: true })

		if (!value)
			return interaction.reply({ content: "No phrase given", ephemeral: true })

		if (value.length < MIN_RULE_LENGTH)
			return interaction.reply({ content: `Rule too short`, ephemeral: true })

		await prisma.muteRule.create({
			data: {
				createdAt: (new Date()).toString(),
				creatorId: interaction.user.id,
				forId: user.id,
				phrase: value
			}
		})

		return interaction.reply(`Rule successfully created\n<@${user.id}> will be timed out for saying \`${value}\``)
	} catch {
		return interaction.reply({ content: "Bro tried it :skull:", ephemeral: true })
	}
}
