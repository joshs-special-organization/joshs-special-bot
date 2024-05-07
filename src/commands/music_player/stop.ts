import { CommandInteraction, Guild, GuildMember, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import {DiscordGatewayAdapterCreator, createAudioPlayer, joinVoiceChannel} from "@discordjs/voice"
import { channels, players, queues, statuses, vcs } from "./dicts";
import { playSong } from "./play";

export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("leaves vc");

export async function execute(interaction: CommandInteraction) {
    let guild = interaction.guildId as string;
    let member = interaction.member as GuildMember
    
    if (vcs[guild] != null) {
        vcs[guild].destroy();
      }
      else {
        return interaction.reply("Not in VC")
      }
      vcs[guild] = null;
      players[guild] = null;
      channels[guild] = null;
      statuses[guild] = "none";
      queues[guild] = [];

      return interaction.reply("Left Channel")
}