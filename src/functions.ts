import { APIInteractionGuildMember, GuildMember, GuildMemberRoleManager } from "discord.js";

export function isMemberMod(member: GuildMember | APIInteractionGuildMember | null) {
	const MOD_NAME = "jsmod"
	if (!member) return false;

	let roles = member.roles as GuildMemberRoleManager
	let isMod = roles.cache.some(role => role.name == MOD_NAME)
	return isMod;
}