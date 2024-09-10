import client from '../bot'
import { getRulesMadeFor, isRuleApplicable } from '../functions'

const TIMEOUT_MINS = 5

client.on('messageCreate', async (interaction) => {
    try {
        if (interaction.author.bot) return
        const rules = await getRulesMadeFor(interaction.author.id)

        if (
            rules.error != null ||
            rules.rules == null ||
            rules.rules.length == 0
        ) {
            return
        }

        rules.rules?.forEach(async (rule) => {
            if (await isRuleApplicable(rule, interaction.content)) {
                const member = await interaction.member
                    ?.timeout(
                        TIMEOUT_MINS * 60 * 1000,
                        'saying `${rule.phrase}` thanks to <@${rule.creatorId}>'
                    )
                    .catch((err) => {
                        console.log(err)
                        interaction.reply("Couldn't time out")
                        return
                    })

                if (member != null)
                    interaction.reply(
                        `You have been timed out for saying \`${rule.phrase}\` thanks to <@${rule.creatorId}>`
                    )
            }
        })
    } catch (e) {
        console.log(e)
    }
})

export default client
