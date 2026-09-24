import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'server', 'data', 'content.json')
const outDir = join(root, 'src', 'generated')
const output = join(outDir, 'content.json')
const seedOutput = join(root, 'server', 'seed-data.mjs')

if (!existsSync(source)) {
  console.log('[build-content] server/data/content.json absent (CI) — garde le snapshot committé.')
  process.exit(0)
}

let raw = readFileSync(source, 'utf8').replace(/^\uFEFF/, '')
let parsed
try {
  parsed = JSON.parse(raw)
} catch (err) {
  console.error('[build-content] content.json invalide, snapshot committé conservé.', err.message)
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(output, JSON.stringify(parsed))
writeFileSync(seedOutput, `export default ${JSON.stringify(parsed)}\n`)
console.log(`[build-content] snapshot embarqué écrit → src/generated/content.json + server/seed-data.mjs`)