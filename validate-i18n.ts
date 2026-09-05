/**
 * validate-i18n.ts
 *
 * Checks:
 *   [ERROR] Missing       — key used in code but absent from JSON
 *   [ERROR] Lang mismatch — key present in one language but missing in another
 *   [WARN]  Orphan        — key in JSON but never referenced in code
 *   [WARN]  Interpolation — t('key') called without options but key has {{vars}}
 *
 * Auto-discovers all JSON files under src/config/locales/<lang>/*.json
 *
 * Usage: npx tsx validate-i18n.ts
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
type JsonObject = { [key: string]: JsonValue }

interface Usage {
    file: string
    line: number
    hasOptions: boolean
}

interface Issue {
    check: 'missing' | 'orphan' | 'mismatch' | 'interpolation'
    key: string
    file?: string
    line?: number
    hasOptions?: boolean
    vars?: string[]
    present?: string
    missing?: string
}

function readJson(path: string): JsonObject {
    const raw = readFileSync(path, 'utf8')
    return JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw) as JsonObject
}

/** Flatten nested object → Map<dotKey, stringValue> */
function flattenKeys(obj: JsonObject, prefix = '', result = new Map<string, string>()): Map<string, string> {
    for (const [k, v] of Object.entries(obj)) {
        const full = prefix ? `${prefix}.${k}` : k
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            flattenKeys(v as JsonObject, full, result)
        } else {
            result.set(full, String(v ?? ''))
        }
    }
    return result
}

function walk(dir: string, ext: string, files: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) walk(full, ext, files)
        else if (entry.endsWith(ext)) files.push(full)
    }
    return files
}

function groupByFile(items: Issue[]): Record<string, Issue[]> {
    const map: Record<string, Issue[]> = {}
    for (const item of items) {
        ;(map[item.file!] ??= []).push(item)
    }
    return map
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Auto-discover all language folders + merge their JSON files
// ─────────────────────────────────────────────────────────────────────────────

const LOCALES_DIR = './src/config/locales'
const languages: Record<string, Map<string, string>> = {}

for (const dir of readdirSync(LOCALES_DIR)) {
    const langPath = join(LOCALES_DIR, dir)
    if (!statSync(langPath).isDirectory()) continue
    let merged = {}
    for (const file of readdirSync(langPath)) {
        if (!file.endsWith('.json')) continue
        merged = { ...merged, ...readJson(join(langPath, file)) }
    }
    languages[dir] = flattenKeys(merged)
}

const langNames = Object.keys(languages)
if (langNames.length === 0) {
    console.error('No language directories found in', LOCALES_DIR)
    process.exit(1)
}

const primaryLang = langNames.includes('fr') ? 'fr' : langNames[0]
const primaryMap  = languages[primaryLang]

// ─────────────────────────────────────────────────────────────────────────────
// 2. Collect all keys referenced in source files
//    usedKeys: key → [{ file, line, hasOptions }]
// ─────────────────────────────────────────────────────────────────────────────

const usedKeys = new Map<string, Usage[]>()

function record(key: string, file: string, line: number, hasOptions: boolean): void {
    ;(usedKeys.get(key) ?? usedKeys.set(key, []).get(key)!).push({ file, line, hasOptions })
}

const srcFiles = [
    ...walk('./src', '.tsx'),
    ...walk('./src', '.ts').filter(f => !f.endsWith('.d.ts')),
]

for (const file of srcFiles) {
    const content  = readFileSync(file, 'utf8')
    const relPath  = file.replace(/\\/g, '/').replace(/^.*\/src\//, 'src/')
    const isConfig = file.replace(/\\/g, '/').includes('/config/')

    // t('key') / t('key', ...)
    for (const m of content.matchAll(/\bt\(\s*['"`]([\w.]+)['"`]\s*([,)])/g)) {
        const line = content.slice(0, m.index).split('\n').length
        record(m[1], relPath, line, m[2] === ',')
    }

    // <Trans i18nKey="key" /> or i18nKey={'key'}
    for (const m of content.matchAll(/i18nKey\s*=\s*["'{`]([\w.]+)["'`}]/g)) {
        const line = content.slice(0, m.index).split('\n').length
        record(m[1], relPath, line, true) // Trans always provides options via JSX props
    }

    // Config files: string values that look like i18n keys
    // e.g.  label: 'nav.home',  title: 'dashboard.layout.nav.overview'
    if (isConfig) {
        for (const m of content.matchAll(/:\s*'((?:[a-z]\w*\.){1,}[\w]+)'/g)) {
            const line = content.slice(0, m.index).split('\n').length
            record(m[1], relPath, line, false)
        }
    }
}

const usedKeySet = new Set(usedKeys.keys())

// ─────────────────────────────────────────────────────────────────────────────
// Plural helpers
// ─────────────────────────────────────────────────────────────────────────────

const PLURAL_SUFFIXES = ['_one', '_other', '_zero', '_two', '_few', '_many']

function pluralBase(key: string): string | null {
    for (const s of PLURAL_SUFFIXES) if (key.endsWith(s)) return key.slice(0, -s.length)
    return null
}

/** Does a code key resolve to something in a language map? */
function codeKeyExistsIn(lang: string, key: string): boolean {
    const m = languages[lang]
    return m.has(key) || m.has(`${key}_one`) || m.has(`${key}_other`)
}

/**
 * Keys reached through a computed name instead of a literal `t('...')` call.
 * `SeoHead` builds `seo.<routeId>.title` from the route table, and
 * `scripts/structured-data.mjs` reads the same block to emit JSON-LD.
 */
const DYNAMIC_KEY_PREFIXES = ['seo.']

/** Is a JSON key reachable from the code (direct or via plural base)? */
function jsonKeyIsUsed(key: string): boolean {
    if (usedKeySet.has(key)) return true
    if (DYNAMIC_KEY_PREFIXES.some(prefix => key.startsWith(prefix))) return true
    const base = pluralBase(key)
    return base !== null && usedKeySet.has(base)
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Checks
// ─────────────────────────────────────────────────────────────────────────────

const errors:   Issue[] = [] // exit 1
const warnings: Issue[] = [] // exit 0

// A) Missing: used in code but absent from primary JSON
for (const [key, usages] of usedKeys) {
    if (!codeKeyExistsIn(primaryLang, key)) {
        for (const u of usages) errors.push({ check: 'missing', key, ...u })
    }
}

// B) Orphan: in primary JSON but not referenced anywhere in code
for (const key of primaryMap.keys()) {
    if (!jsonKeyIsUsed(key)) warnings.push({ check: 'orphan', key })
}

// C) Language mismatch: key present in one lang but missing in another
for (let i = 0; i < langNames.length; i++) {
    for (let j = i + 1; j < langNames.length; j++) {
        const [a, b] = [langNames[i], langNames[j]]
        for (const key of languages[a].keys()) {
            if (!languages[b].has(key)) errors.push({ check: 'mismatch', key, present: a, missing: b })
        }
        for (const key of languages[b].keys()) {
            if (!languages[a].has(key)) errors.push({ check: 'mismatch', key, present: b, missing: a })
        }
    }
}

// D) Interpolation: t('key') without second arg but key has {{vars}}
for (const [key, usages] of usedKeys) {
    const value = primaryMap.get(key)
        ?? primaryMap.get(`${key}_one`)
        ?? primaryMap.get(`${key}_other`)
        ?? ''
    const vars = [...value.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1])
    if (vars.length === 0) continue
    for (const u of usages) {
        if (!u.hasOptions) warnings.push({ check: 'interpolation', key, vars, ...u })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Report
// ─────────────────────────────────────────────────────────────────────────────

const missingErrors  = errors.filter(e => e.check === 'missing')
const mismatchErrors = errors.filter(e => e.check === 'mismatch')
const orphanWarnings = warnings.filter(w => w.check === 'orphan')
const interpWarnings = warnings.filter(w => w.check === 'interpolation')

if (missingErrors.length > 0) {
    console.error(`[ERROR] ${missingErrors.length} missing key(s) — used in code but absent from JSON:\n`)
    for (const [file, items] of Object.entries(groupByFile(missingErrors))) {
        console.error(`  ${file}`)
        for (const { line, key } of items) console.error(`    L${line}: '${key}'`)
    }
    console.error()
}

if (mismatchErrors.length > 0) {
    console.error(`[ERROR] ${mismatchErrors.length} language mismatch(es) — key in one lang, missing in another:\n`)
    for (const { key, present, missing } of mismatchErrors) {
        console.error(`  '${key}'  (in '${present}', missing from '${missing}')`)
    }
    console.error()
}

if (orphanWarnings.length > 0) {
    console.warn(`[WARN] ${orphanWarnings.length} orphan key(s) — in JSON but never used in code:\n`)
    for (const { key } of orphanWarnings) console.warn(`  '${key}'`)
    console.warn()
}

if (interpWarnings.length > 0) {
    console.warn(`[WARN] ${interpWarnings.length} interpolation(s) — t('key') called without options but key has {{vars}}:\n`)
    for (const [file, items] of Object.entries(groupByFile(interpWarnings))) {
        console.warn(`  ${file}`)
        for (const { line, key, vars } of items) console.warn(`    L${line}: '${key}'  expects {{ ${vars?.join(', ')} }}`)
    }
    console.warn()
}

const totalErrors   = errors.length
const totalWarnings = warnings.length

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✓ All translation keys are valid. No issues found.')
    process.exit(0)
} else if (totalErrors === 0) {
    console.log(`✓ No errors. ${totalWarnings} warning(s).`)
    process.exit(0)
} else {
    console.error(`✗ ${totalErrors} error(s), ${totalWarnings} warning(s).`)
    process.exit(1)
}
