import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { prisma } from '../../prisma-client'
import { isMemberMod } from '../../common_functions'
import { getKevinId } from './helper'


// https://discordjs.guide/slash-commands/parsing-options.html#subcommands
// https://discordjs.guide/slash-commands/parsing-options.html#command-options


export const data = new SlashCommandBuilder()
    .setName('setkevin')
    .setDescription("Set the 'kevin' of your server")
    .addUserOption((option) =>
            option
                .setName('kevin')
                .setDescription("Who's the 'kevin' of the server")
                .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const kevin = interaction.options.getMember('kevin') as GuildMember
    const member = interaction.member as GuildMember | null
    const guild = interaction.guild

    if (!member || !guild)
        return interaction.reply({ content: 'uhh uhhmmm uhh', ephemeral: true })

    if (interaction.user?.bot) {
            return await interaction.reply(
                'I have created general intelligence'
            )
        }

    if (!isMemberMod(interaction.member)) {
        return await interaction.reply('User is not mod')
    }

    if (interaction.user.id == "346221699605200907") { // kevins alt
        return await interaction.reply("nice try lol")
    }

    if (interaction.user.id == (await getKevinId(guild.id))) { // kevin cannot change the kevin
        return await interaction.reply("you're not getting out of this one that easy")
    }


    await prisma.kevinId.upsert({
            where: {
                guildId: guild.id as string
            },
            update: { kevinId: kevin.user.id },
            create: { guildId: interaction.guild?.id as string, kevinId: kevin.user.id },
        })

    await interaction.reply({ content: "The 'kevin' has been set successfully", ephemeral: true })
}
