import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getRuleMadeBy, removeRuleMadeBy } from '../../functions'

export const data = new SlashCommandBuilder()
    .setName('removerule')
    .setDescription('Removes the rule you have currently made')

export async function execute(interaction: CommandInteraction) {
    const { rule, error: _ } = await getRuleMadeBy(
        interaction.user.id,
        interaction.guildId as string
    )
    const { error } = await removeRuleMadeBy(
        interaction.user.id,
        interaction.guildId as string
    )

    if (error)
        return await interaction.reply({ content: error, ephemeral: true })

    return await interaction.reply(
        `You have removed your rule\nPhrase \`${rule?.phrase}\` for <@${rule?.forId}>`
    )
}
