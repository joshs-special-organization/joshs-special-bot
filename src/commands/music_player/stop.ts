import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { channels, players, queues, statuses, vcs } from '../../functions/dicts'

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('leaves vc')

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guildId as string

    if (vcs[guild] != null) {
        vcs[guild].destroy()
    } else {
        return interaction.reply('Not in VC')
    }
    vcs[guild] = null
    players[guild] = null
    channels[guild] = null
    statuses[guild] = 'none'
    queues[guild] = []

    return interaction.reply('Left Channel')
}
