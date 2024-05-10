import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { deployCommands } from '../deploy-commands'
import { isMemberMod } from '../functions'

export const data = new SlashCommandBuilder()
    .setName('refreshcommands')
    .setDescription('Refreshes the slash commands')

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member

    if (!isMemberMod(member)) {
        interaction.reply({
            content: 'Sorry, you do not have permission',
            ephemeral: true,
        })
    }

    if (interaction.guild_id == null) {
        console.log('Error: guild_id is null')
        return
    }
    await deployCommands(interaction.guild_id)
    return interaction.reply({
        content: 'Refreshed commands successfully',
        ephemeral: true,
    })
}
