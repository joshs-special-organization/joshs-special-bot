import { Client } from 'discord.js'
import * as commands from './commands'
import { config } from './config'
import { deployCommands } from './deploy-commands'

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'DirectMessages',
        'MessageContent',
        'GuildModeration',
        'GuildVoiceStates',
    ],
})
export default client
;(async (_) => {
    // Wait for client listeners to be loaded, then add remaining and login
    await import('./listeners')

    client.once('ready', () => {
        console.log(`Running in ${process.env.NODE_ENV} mode...`)
        console.log('Discord bot is ready! 🤖')
    })
    client.on('guildCreate', async (guild) => await deployCommands(guild.id))
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return
        commands[interaction.commandName].execute(interaction)
    })

    await client.login(config.DISCORD_TOKEN)
})()
