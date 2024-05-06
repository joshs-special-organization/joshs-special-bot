import { CommandInteraction, Guild, GuildMember, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../../deploy-commands";
import { getModAdmin } from "../../functions";


export const data = new SlashCommandBuilder()
    .setName("musicconfig")
    .setDescription("Sets the config for the music section (mod only)")
    .addStringOption(opt => opt.setName("pipedurl").setDescription(`url`))
    .addStringOption(opt => opt.setName("pipedproxy").setDescription(`url`));

export async function execute(interaction: CommandInteraction) {
    let member = interaction.member

    if (!getModAdmin(member)) {
        interaction.reply({content: "Sorry, you do not have permission", ephemeral: true})
    }

    //TODO: Set config
    //AWAITING DB SETUP

    return interaction.reply({ content: "Set config successfully", ephemeral: true })

}