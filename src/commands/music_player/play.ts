import { AudioPlayer, StreamType, createAudioResource } from '@discordjs/voice'
import {
    CommandInteraction,
    SlashCommandBuilder,
    TextBasedChannel,
} from 'discord.js'
import { config } from '../../config'
import { channels, players, queues, statuses, vcs } from '../../functions/dicts'

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a youtube url')
    .addStringOption((opt) =>
        opt.setName('tubeurl').setDescription(`A youtube.com url`)
    )

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guildId as string

    if (vcs[guild] == null) {
        return interaction.reply({ content: 'Not in VC' })
    }

    const { value: youtubeURL } = interaction.options.get('tubeurl', true) as {
        value: string
    }

    // prettier-ignore
    // eslint-disable-next-line
    const youtubeRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?\=]*)?/

    // Extracting video ID using regex
    const match = youtubeURL.match(youtubeRegex)
    if (match && match[1]) {
        const videoID = match[1]

        const instance = config.PIPED_URL ?? 'api.piped.private.coffee'

        fetch('http://' + instance + '/streams/' + videoID)
            .then((response) => response.json())
            .then((data) => addAudioElement(data, guild))
            .catch((_) => {
                ;(channels[guild] as TextBasedChannel).send(
                    'Unexpected Api Error'
                )
            })

        return interaction.reply({ content: 'Video Found' })
    }
}

function addAudioElement(data, guild) {
    const streamList = data['audioStreams']
    streamList.push(data['videoStreams'][0])

    if (streamList.length > 0) {
        let qualityList: number[] = []

        for (const stream of streamList) {
            const raw = stream['quality']
            if (stream["itag"] == 18) {
                qualityList.push(0)
            } else {
                const no = raw.substring(0, raw.length - 5)

                qualityList.push(parseInt(no))
            }
        }
        qualityList = qualityList.sort(function (a, b) {
            return b - a
        })
        const maxQual = qualityList[0]
        console.log(qualityList)

        for (const stream of streamList) {
            if (stream['quality'] == maxQual + ' kbps' || (stream['itag'] == 18 && maxQual == 0)) {
                console.log(stream['url'])
                console.log(stream['mimeType'])

                const r = data['thumbnailUrl']
                const rr = r.substring('http://'.length)
                const rrr = rr.substring(rr.indexOf('/'))
                const url =
                    'http://' +
                    (config.PIPED_PROXY_URL ?? 'proxy.piped.private.coffee') +
                    rrr

                queues[guild].push({
                    song: stream['url'],
                    title: data['title'],
                    thumb: url,
                })
                playSong(guild)

                break
            }
        }
    } else {
        ;(channels[guild] as TextBasedChannel).send('Unexpected Streams Error')
    }
}

export async function playSong(guild) {
    let str
    console.log(statuses[guild])
    if (queues[guild].length > 0) {
        if (
            statuses[guild] == 'idle' ||
            statuses[guild] == 'none' ||
            statuses[guild] == 'autopaused'
        ) {
            const { song, title, thumb } = queues[guild].shift()
            console.log('SONG: ' + song)
            await fetch(song)
                .then((response) => response.body)
                .then(
                    (body) =>
                        new ReadableStream({
                            start(controller) {
                                const reader = body?.getReader()

                                return pump()

                                function pump() {
                                    return reader
                                        ?.read()
                                        .then(({ done, value }) => {
                                            if (done) {
                                                controller.close()
                                                return
                                            }
                                            controller.enqueue(value)
                                            return pump()
                                        })
                                }
                            },
                        })
                )
                .then((stream) => {
                    str = stream
                })
                .catch((_) => {
                    ;(channels[guild] as TextBasedChannel).send(
                        "Could't fetch the audio"
                    )
                })
            const resource = createAudioResource(str, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                //   volume: 10
            })

            ;(players[guild] as AudioPlayer).play(resource)
            ;(players[guild] as AudioPlayer).unpause()
            ;(channels[guild] as TextBasedChannel).send('NOW PLAYING: ' + title)
            
            const response = await fetch(thumb);
            const buffer = Buffer.from(await response.arrayBuffer());

            ;(channels[guild] as TextBasedChannel).send({
                files: [
                    {
                        attachment: buffer,
                        name: "thumbnail.jpg",
                    },
                ],
            });
        } else {
            ;(channels[guild] as TextBasedChannel).send('Added to queue')
        }
    } else {
        ;(channels[guild] as TextBasedChannel).send('Queue empty')
        ;(players[guild] as AudioPlayer).pause()
        statuses[guild] = 'idle'
    }
}
