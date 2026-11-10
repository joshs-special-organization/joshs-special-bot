import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'

const coinFlipGifUrls = {
    tails: 'https://host.jeynes.uk/jsb/xJhpXrO8nkoAAAAd.gif',
    heads: 'https://host.jeynes.uk/jsb/xJhpXr08nkoAAAAd.gif',
}

const activeUserCalls = new Set()

export const data = new SlashCommandBuilder()
    .setName('flipcoinmute')
    .setDescription('Mute someone (5m) or yourself (10m)')
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription("Who's do you want to mute?")
            .setRequired(true)
    )
    .addBooleanOption((option) =>
        option
            .setName('is_heads')
            .setDescription('Set as true for heads, false for tails')
            .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null
    const guild = interaction.guild
    const user = interaction.options.getMember('user') as GuildMember
    const choseHeads = interaction.options.getBoolean('is_heads') as boolean
    const _sleep = async (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    let lockAcquired = false

    try {
        console.log(activeUserCalls)
        if (activeUserCalls.has(interaction.user.id)) {
            console.log('yerp')
            return interaction.reply({
                content: 'You already have a command running!',
                ephemeral: true,
            })
        }

        if (!member || !guild)
            return interaction.reply({
                content: 'uhh uhhmmm uhh',
                ephemeral: true,
            })

        if (user.user.bot) {
            return interaction.reply({
                content: 'cannot mute a bot',
                ephemeral: true,
            })
        }

        if (user.user.id == interaction.user.id) {
            return interaction.reply({
                content: 'cannot mute yourself',
                ephemeral: true,
            })
        }

        activeUserCalls.add(interaction.user.id)
        lockAcquired = true
        await interaction.deferReply({ ephemeral: true })

        const isHeadsRoll = Math.random() > 0.5
        await interaction.channel?.send(
            `<@${interaction.user.id}> is betting on **${choseHeads ? 'heads' : 'tails'}** to mute <@${user.user.id}>`
        )
        await _sleep(5 * 1000) // 5s

        const coinFlipMessage = await interaction.channel?.send(
            isHeadsRoll ? coinFlipGifUrls.heads : coinFlipGifUrls.tails
        )
        await _sleep(6 * 1000) // takes 6s for the gif
        await coinFlipMessage?.delete()

        if ((isHeadsRoll && choseHeads) || (!isHeadsRoll && !choseHeads)) {
            // doesnt show "heads" or "tails" if the user did not specify
            await user.timeout(5 * 60 * 1000, '5 minute flip coin mute')
            await interaction.channel?.send(
                `It landed on **${isHeadsRoll ? 'heads' : 'tails'}**, mute successful`
            )
        } else {
            await member.timeout(10 * 60 * 1000, 'guess wrong lol, 10m mute')
            await interaction.channel?.send(
                `It landed on **${isHeadsRoll ? 'heads' : 'tails'}**, not so lucky, goodbye :saluting_face:`
            )
        }

        activeUserCalls.delete(interaction.user.id)
    } catch (err) {
        console.log('erm...', err)
    } finally {
        if (lockAcquired) {
            activeUserCalls.delete(interaction.user.id)
        }

        if (interaction.deferred || interaction.replied) {
            await interaction.deleteReply().catch(console.error)
        }
    }
}
