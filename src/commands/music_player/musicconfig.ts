import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { isMemberMod } from '../../common_functions'

export const data = new SlashCommandBuilder()
    .setName('musicconfig')
    .setDescription('Sets the config for the music section (mod only)')
    .addStringOption((opt) => opt.setName('pipedurl').setDescription(`url`))
    .addStringOption((opt) => opt.setName('pipedproxy').setDescription(`url`))

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member

    if (!isMemberMod(member)) {
        interaction.reply({
            content: 'Sorry, you do not have permission',
            ephemeral: true,
        })
    }

    //TODO: Set config
    //AWAITING DB SETUP

    return interaction.reply({
        content: 'Set config successfully',
        ephemeral: true,
    })
}
