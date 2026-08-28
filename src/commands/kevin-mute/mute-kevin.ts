import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { prisma } from '../../prisma-client'

// https://discordjs.guide/slash-commands/parsing-options.html#subcommands
// https://discordjs.guide/slash-commands/parsing-options.html#command-options

async function getKevinId(guildId: string) {
    const record = await prisma.kevinId.findFirst({ 
        where: { guildId }
    })

    return record?.kevinId
}

async function hasMutedToday(guildId: string, userId: string) {
    const record = await prisma.dailyKevinMute.findFirst({
        where: {
            guildId,
            creatorId: userId
        }
    })

    if (record == null)
        return false

    return  (Date.now() - record.createdAt.getTime()) < 24 * 60 * 60 * 1000; // if done less 24 hours ago
}

export const data = new SlashCommandBuilder()
    .setName('mutekevin')
    .setDescription("Mute kevin")

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null
    const guild = interaction.guild

    if (!member || !guild)
        return interaction.reply({ content: 'uhh uhhmmm uhh', ephemeral: true })

    if ((await hasMutedToday(guild.id, interaction.user.id))) {
        return interaction.reply({ content: 'kevin has already been muted by you today', ephemeral: true })
    }

    const kevinId = await getKevinId(guild.id)

    if (!kevinId) {
        return interaction.reply({ content: 'no kevin has been set yet, please do so with /setkevin', ephemeral: true })
    }

    const kevin = await guild.members.fetch(kevinId)
    await kevin.timeout(5 * 60 * 1000, "Gone for 5 minutes... blissful silence")

    await prisma.dailyKevinMute.upsert({
            where: {
                muteId: {
                    guildId: guild.id as string,
                    creatorId: interaction.user.id,
                },
            },
            update: { createdAt: new Date() },
            create: { guildId: interaction.guild?.id as string, creatorId: interaction.user.id },
        })

    await interaction.reply("Kevin muted for a bit... blissful silence")
}
