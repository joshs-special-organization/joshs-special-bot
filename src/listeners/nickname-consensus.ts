import client from "../bot";

import { setIntendedNickname } from "../functions/nickname-consensus";

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  setIntendedNickname(newMember);
})

export default client;