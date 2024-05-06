import { Channel, CommandInteraction, Guild, GuildMember, GuildMemberRoleManager, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import { deployCommands } from "../../deploy-commands";
import { getModAdmin } from "../../functions";
import { channels, instances, players, proxies, queues, statuses } from "./dicts";
import { createAudioResource, StreamType, AudioPlayer } from "@discordjs/voice"


export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays a youtube url")
    .addStringOption(opt => opt.setName("tubeurl").setDescription(`A youtube.com url`));

export async function execute(interaction: CommandInteraction) {
    let guild = interaction.guildId as string;

    let { value: youtubeURL } = interaction.options.get("tubeurl", true) as { value: string }
    const youtubeRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?\=]*)?/;



    // Extracting video ID using regex
    const match = youtubeURL.match(youtubeRegex);
    if (match && match[1]) {
        const videoID = match[1];

        let instance = instances[guild] ?? "pipedapi.adminforge.de";
        // let proxy = proxies[guild] ?? "pipedimg.adminforge.de";

        fetch('https://' + instance + '/streams/' + videoID)
            .then((response) => response.json())
            .then((data) => addAudioElement(data, guild)).catch((err) => {
                (channels[guild] as TextBasedChannel).send("Unexpected Error")
            });

        return interaction.reply({ content: "Video Found" })
    }

}

function addAudioElement(data, guild) {
    let streamList = data['audioStreams'];
    if (streamList.length > 0) {
        let qualityList: number[] = [];


        for (let i = 0; i < streamList.length; i++) {

            let raw = streamList[i]['quality'];
            let no = raw.substring(0, raw.length - 5);

            qualityList.push(parseInt(no));
        }
        qualityList = qualityList.sort(function (a, b) { return b - a; });
        let maxQual = qualityList[0];
        console.log(qualityList);


        for (let i = 0; i < streamList.length; i++) {
            if (streamList[i]['quality'] == maxQual + " kbps") {

                console.log(streamList[i]['url'])
                console.log(streamList[i]['mimeType'])


                let r = data['thumbnailUrl'];
                let rr = r.substring("https://".length);
                let rrr = rr.substring(rr.indexOf("/"));
                let url = "https://" + (proxies[guild] ?? "pipedimg.adminforge.de") + rrr;

                queues[guild].push({ song: streamList[i]['url'], title: data["title"], thumb: url });
                playSong(guild)


                break;
            }
        }
    }
    else {
        (channels[guild] as TextBasedChannel).send("Unexpected Error")
    }

}

export async function playSong(guild) {
    let str;
    console.log(statuses[guild])
    if (queues[guild].length > 0) {
        if (statuses[guild] == "idle" || statuses[guild] == "none" || statuses[guild] == "autopaused") {
            let { song, title, thumb } = queues[guild].shift()
            console.log("SONG: " + song);
            await fetch(song)
                .then(response => response.body)
                .then(body => new ReadableStream({
                    start(controller) {
                        const reader = body?.getReader();

                        return pump();

                        function pump() {
                            return reader?.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    }
                }))
                .then(stream => {
                    str = stream;
                })
                .catch(error => { (channels[guild] as TextBasedChannel).send("Could't fetch the audio") });
            const resource = createAudioResource(str, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                //   volume: 10
            });

            (players[guild] as AudioPlayer).play(resource);
            (players[guild] as AudioPlayer).unpause();
            (channels[guild] as TextBasedChannel).send("NOW PLAYING: " + title);
            (channels[guild] as TextBasedChannel).send(thumb);
        }
        else {
            (channels[guild] as TextBasedChannel).send("Added to queue")
        }

    }
    else {
        (channels[guild] as TextBasedChannel).send("Queue empty");
        (players[guild] as AudioPlayer).pause();
        statuses[guild] = "idle"
    }
}