import { APIInteractionGuildMember, GuildMember, GuildMemberRoleManager } from "discord.js";

export function getModAdmin(member: GuildMember | APIInteractionGuildMember | null) {
    const MOD_NAME = "jsmod"
    if (member === null) {
        return false;
    }
    let roleman = member.roles as GuildMemberRoleManager
    let valid = false
    roleman.cache.each((role) => {
        if (role.name === MOD_NAME) {
            valid = true
        }
    })
    return valid;
} 


