import client from "../bot";

client.on("guildMemberUpdate", async (oldMember, newMember) => {
	console.log("someone changed nickname")
})

export default client;