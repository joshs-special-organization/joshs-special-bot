import { Rule } from './types'

import {
    APIInteractionGuildMember,
    GuildMember,
    GuildMemberRoleManager,
} from 'discord.js'
import { prisma } from './prisma-client'

export function isMemberMod(
    member: GuildMember | APIInteractionGuildMember | null
) {
    const MOD_NAME = 'jsmod'
    if (!member) return false

    const roles = member.roles as GuildMemberRoleManager
    const isMod = roles.cache.some((role) => role.name == MOD_NAME)
    return isMod
}

// Omit used to convert Rule.createdAt type to 'string' temporarily to allow for DB data to be converted to JS Date
export function dateifyRule(
    data: Omit<Rule, 'createdAt'> & { createdAt: string }
) {
    return { ...data, createdAt: new Date(data.createdAt) } as Rule
}

export async function isRuleApplicable(rule: Rule, content: string) {
    if (await isRuleOutOfDate(rule)) return false

    return transliterate(content.toLowerCase())
        .replace(/ /g, '')
        .includes(rule.phrase.toLowerCase().replace(/ /g, ''))
}

export async function getRulesMadeFor(userId: string, guildId: string) {
    const data = await prisma.muteRule.findMany({
        where: { forId: userId, guildId },
    })

    if (!data || data.length == 0) return { error: 'No rules found!' }

    const rules: Rule[] = data.map(dateifyRule) // Convert createdAt attribute to a Date

    return { rules }
}

export async function getRuleMadeBy(userId: string, guildId: string) {
    const data = await prisma.muteRule.findFirst({
        where: {
            creatorId: userId,
            guildId,
        },
    })

    if (!data) return { error: 'No rule found!' }

    return { rule: dateifyRule(data) }
}

export async function removeRuleMadeBy(userId: string, guildId: string) {
    const { error: ruleError, rule } = await getRuleMadeBy(userId, guildId)
    if (!rule || ruleError)
        return { error: 'You currently have no rule in place' }

    await prisma.muteRule.delete({
        where: {
            creatorId_guildId: {
                creatorId: userId,
                guildId,
            },
        },
    })

    return {}
}

export async function isRuleOutOfDate(rule: Rule) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    if (rule.createdAt <= oneWeekAgo) {
        await removeRuleMadeBy(rule.creatorId, rule.guildId) // If you are checking, and its out of date. it should be deleted
        return true
    } else {
        return false
    }
}

export async function userHasRuleCreated(userId: string, guildId: string) {
    const { rule, error } = await getRuleMadeBy(userId, guildId)

    if (error) return false
    if (!rule) return false
    if (await isRuleOutOfDate(rule)) return false

    return true
}

const transliterate = function (text) {
    text = text
        .replace(/\u0401/g, 'YO')
        .replace(/\u0419/g, 'I')
        .replace(/\u0426/g, 'TS')
        .replace(/\u0423/g, 'U')
        .replace(/\u041A/g, 'K')
        .replace(/\u0415/g, 'E')
        .replace(/\u041D/g, 'N')
        .replace(/\u0413/g, 'G')
        .replace(/\u0428/g, 'SH')
        .replace(/\u0429/g, 'SCH')
        .replace(/\u0417/g, 'Z')
        .replace(/\u0425/g, 'H')
        .replace(/\u042A/g, '')
        .replace(/\u0451/g, 'yo')
        .replace(/\u0439/g, 'i')
        .replace(/\u0446/g, 'ts')
        .replace(/\u0443/g, 'u')
        .replace(/\u043A/g, 'k')
        .replace(/\u0435/g, 'e')
        .replace(/\u043D/g, 'n')
        .replace(/\u0433/g, 'g')
        .replace(/\u0448/g, 'sh')
        .replace(/\u0449/g, 'sch')
        .replace(/\u0437/g, 'z')
        .replace(/\u0445/g, 'h')
        .replace(/\u044A/g, "'")
        .replace(/\u0424/g, 'F')
        .replace(/\u042B/g, 'I')
        .replace(/\u0412/g, 'V')
        .replace(/\u0410/g, 'a')
        .replace(/\u041F/g, 'P')
        .replace(/\u0420/g, 'R')
        .replace(/\u041E/g, 'O')
        .replace(/\u041B/g, 'L')
        .replace(/\u0414/g, 'D')
        .replace(/\u0416/g, 'ZH')
        .replace(/\u042D/g, 'E')
        .replace(/\u0444/g, 'f')
        .replace(/\u044B/g, 'i')
        .replace(/\u0432/g, 'v')
        .replace(/\u0430/g, 'a')
        .replace(/\u043F/g, 'p')
        .replace(/\u0440/g, 'r')
        .replace(/\u043E/g, 'o')
        .replace(/\u043B/g, 'l')
        .replace(/\u0434/g, 'd')
        .replace(/\u0436/g, 'zh')
        .replace(/\u044D/g, 'e')
        .replace(/\u042F/g, 'Ya')
        .replace(/\u0427/g, 'CH')
        .replace(/\u0421/g, 'S')
        .replace(/\u041C/g, 'M')
        .replace(/\u0418/g, 'I')
        .replace(/\u0422/g, 'T')
        .replace(/\u042C/g, "'")
        .replace(/\u0411/g, 'B')
        .replace(/\u042E/g, 'YU')
        .replace(/\u044F/g, 'ya')
        .replace(/\u0447/g, 'ch')
        .replace(/\u0441/g, 's')
        .replace(/\u043C/g, 'm')
        .replace(/\u0438/g, 'i')
        .replace(/\u0442/g, 't')
        .replace(/\u044C/g, "'")
        .replace(/\u0431/g, 'b')
        .replace(/\u044E/g, 'yu')

    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
