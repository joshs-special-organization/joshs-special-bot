import {
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js'
import { isMemberMod } from '../../common_functions'
import { prisma } from '../../prisma-client'

export const data = new SlashCommandBuilder()
    .setName('setmuteemoji')
    .setDescription('Set which emoji the democratic people use to mute people')
    .addStringOption((opt) =>
        opt
            .setName('emoji')
            .setDescription('The full emoji you want to use/ (not just the id)')
            .setRequired(true)
    )

export async function execute(interaction: CommandInteraction) {
    try {
        const {
            member,
            user,
            value: rawEmojiMessage,
        } = interaction.options.get('emoji', true)
        const emojiMatch = /<:(.*):(.*)>/.exec(rawEmojiMessage as string)

        if (user?.bot) {
            return await interaction.reply(
                'I have created general intelligence'
            )
        }

        if (!isMemberMod(member as GuildMember)) {
            return await interaction.reply('User is not mod')
        }

        if (!emojiMatch) {
            return await interaction.reply('Not an emoji')
        }

        const emojiId = (emojiMatch as RegExpExecArray)[2]

        if (!emojiId) {
            return await interaction.reply('Could not find that emoji')
        }

        await prisma.muteEmoji.upsert({
            where: { guildId: interaction.guild?.id as string },
            update: { emojiId },
            create: { guildId: interaction.guild?.id as string, emojiId },
        })

        return interaction.reply(`Mute emoji set to ${rawEmojiMessage}`)
    } catch (err) {
        return interaction.reply({
            content: `Bro tried it :skull:\n${err}`,
            ephemeral: true,
        })
    }
}
