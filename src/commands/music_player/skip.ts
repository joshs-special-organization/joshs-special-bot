import { CommandInteraction, Guild, GuildMember, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import {DiscordGatewayAdapterCreator, createAudioPlayer, joinVoiceChannel} from "@discordjs/voice"
import { channels, players, queues, statuses, vcs } from "./dicts";
import { playSong } from "./play";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skips the current song");

export async function execute(interaction: CommandInteraction) {
    let guild = interaction.guildId as string;
    let member = interaction.member as GuildMember
    
    statuses[guild] = "none"
    playSong(guild)
  
    return interaction.reply({ content: "Skipped Song" })
}