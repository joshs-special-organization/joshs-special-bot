import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { config } from "./config";
import * as commands from "./commands";

const client = new Client({
	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildModeration"],
});

client.once("ready", () => console.log("Discord bot is ready! 🤖"));
client.on("guildCreate", async guild => await deployCommands(guild.id));
client.on("interactionCreate", async interaction => {

	if (!interaction.isCommand()) return;

	commands[interaction.commandName].execute(interaction);
});

client.on("messageCreate", async message => {

})


client.login(config.DISCORD_TOKEN);