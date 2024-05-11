import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { statuses } from '../../functions/dicts'
import { playSong } from './play'

export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skips the current song')

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guildId as string

    statuses[guild] = 'none'
    playSong(guild)

    return interaction.reply({ content: 'Skipped Song' })
}
