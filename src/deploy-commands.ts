import { REST, Routes } from "discord.js";
import { config } from "./config";
import * as commands from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.TOKEN);

export async function deployCommands(guildId: string) {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, guildId),
			{
				body: commandsData,
			}
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
}
