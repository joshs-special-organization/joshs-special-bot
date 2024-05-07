import client from "../bot";
import { setIntendedNickname } from "../functions/nickname-consensus";

client.on("guildMemberUpdate", async (_, newMember) => {
	await setIntendedNickname(newMember);
})

export default client;