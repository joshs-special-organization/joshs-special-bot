/**
 * Loads every command under src/commands (including subfolders) and checks
 * that it is valid according to discord.js builders, without connecting to
 * Discord. No token needed, so it is safe to run in CI.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

async function main() {
    const dir = join(process.cwd(), 'src', 'commands')

    // recursive readdir returns paths relative to dir (Node 20+)
    const files = readdirSync(dir, { recursive: true })
        .map(String)
        .filter((f) => /\.(ts|js)$/.test(f) && !f.endsWith('.d.ts'))

    const names = new Set<string>()
    const errors: string[] = []

    for (const file of files) {
        try {
            const mod = await import(pathToFileURL(join(dir, file)).href)
            const cmd = mod.default ?? mod

            // helper files (no data and no execute) are not commands: skip
            if (!cmd.data && !cmd.execute) {
                console.log(`- ${file} (not a command, skipped)`)
                continue
            }

            if (!cmd.data || typeof cmd.data.toJSON !== 'function')
                throw new Error('missing `data` (a SlashCommandBuilder)')
            if (typeof cmd.execute !== 'function')
                throw new Error('missing `execute` function')

            // toJSON() runs the builder's own validation
            // (name format, lengths, option limits)
            const json = cmd.data.toJSON()

            if (names.has(json.name))
                throw new Error(`duplicate command name "${json.name}"`)
            names.add(json.name)

            console.log(`✓ ${file} → /${json.name}`)
        } catch (e) {
            errors.push(`✗ ${file}: ${(e as Error).message}`)
        }
    }

    if (names.size > 100)
        errors.push(`✗ ${names.size} commands exceeds Discord's limit of 100`)

    if (errors.length) {
        console.error('\n' + errors.join('\n'))
        process.exit(1)
    }
    console.log(`\n${names.size} command(s) valid.`)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})