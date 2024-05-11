import { REST, Routes } from 'discord.js'
import * as commands from './commands'
import { config } from './config'

const data = Object.values(commands)
const filteredData = data.filter((data) => data != null)
const commandsData = filteredData.map((command) => command.data)
const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN)

export async function deployCommands(guildId: string | null) {
    try {
        if (guildId === null) {
            return;
        }
        console.log('Started refreshing application (/) commands.')

        await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
            {
                body: commandsData,
            }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}
