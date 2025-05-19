import { Client } from 'discord.js'
import * as commands from './commands'
import { isMemberMod } from './common_functions'
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
		'GuildMessageReactions',
	],
})
export default client
	; (async (_) => {
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
		client.on('messageCreate', async (interaction) => {
			if (interaction.content == 'SETUP' && isMemberMod(interaction.member)) {
				await (
					await interaction.guild?.members.fetchMe()
				)?.setNickname('Joshs Special Bot')
				console.log('Set nickanme')
				await deployCommands(interaction.guildId)
			}
		})

		await client.login(config.DISCORD_TOKEN)
	})()
