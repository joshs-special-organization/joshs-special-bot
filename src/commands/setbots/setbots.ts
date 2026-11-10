import {
    ChannelType,
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { isMemberMod } from '../../common_functions'
import { prisma } from '../../prisma-client'

export const data = new SlashCommandBuilder()
    .setName('setbots')
    .setDescription('Set the #bots channel for this server')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to use as the bots channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null
    const guild = interaction.guild

    if (!member || !guild)
        return interaction.reply({ content: 'uhh uhhmmm uhh', ephemeral: true })

    if (interaction.user?.bot) {
        return await interaction.reply('I have created general intelligence')
    }

    if (!isMemberMod(interaction.member)) {
        return await interaction.reply({
            content: 'User is not mod',
            ephemeral: true,
        })
    }

    const channel = interaction.options.getChannel('channel', true)

    await prisma.botsChannel.upsert({
        where: {
            guildId: guild.id,
        },
        update: { channelId: channel.id },
        create: {
            guildId: guild.id,
            channelId: channel.id,
        },
    })

    await interaction.reply({
        content: `The bots channel has been set to <#${channel.id}>`,
        ephemeral: true,
    })
}
