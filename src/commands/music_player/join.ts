import {
    DiscordGatewayAdapterCreator,
    createAudioPlayer,
    joinVoiceChannel,
} from '@discordjs/voice'
import {
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { channels, players, queues, statuses, vcs } from './dicts'
import { playSong } from './play'

export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('join your current vc')

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guildId as string
    const member = interaction.member as GuildMember
    const voice = member.voice.channelId
    console.log(member)
    const text = interaction.channel

    if (voice == null) {
        return interaction.reply({
            content: 'You are not in a VC',
            ephemeral: true,
        })
    }

    const connection = joinVoiceChannel({
        channelId: voice,
        guildId: guild,
        adapterCreator: interaction.guild
            ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    })

    channels[guild] = text
    vcs[guild] = connection
    queues[guild] = []

    const player = createAudioPlayer()

    player.on('error', (_) => {
        console.error('Error')
    })
    player.on('stateChange', (_, evt2) => {
        if (statuses[guild] != 'none') {
            if (evt2.status == 'idle') {
                statuses[guild] = evt2.status
                playSong(guild)
            }
        }
        statuses[guild] = evt2.status
    })

    connection.subscribe(player)

    players[guild] = player
    statuses[guild] = 'idle'

    return interaction.reply({ content: 'Joined Channel' })
}
