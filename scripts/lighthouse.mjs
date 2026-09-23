import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdirSync } from 'node:fs'

const NODE = process.execPath
const CLI = 'node_modules/lighthouse/cli/index.js'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const URL = process.env.LH_URL ?? 'http://localhost:4000'
const PRESET = process.env.LH_PRESET ?? 'desktop'
const TARGET = 97

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitFor(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url)
      if (res.status < 500) return true
    } catch {
      /* not ready */
    }
    await sleep(500)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function run() {
  const server = spawn(NODE, ['server/index.mjs'], {
    detached: true,
    env: { ...process.env, SERVE_DIST: 'true', PORT: '4000' },
    stdio: 'ignore',
  })
  try {
    await waitFor(URL)
    mkdirSync('artifacts', { recursive: true })
    const outPath = 'artifacts/lighthouse.json'
    const flags = [
      '--chrome-path=' + EDGE,
      '--chrome-flags=--headless --no-sandbox --disable-gpu',
      `--preset=${PRESET}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${outPath}`,
      '--quiet',
      URL,
    ]
    const code = await new Promise((resolve) => {
      const child = spawn(NODE, [CLI, ...flags], { stdio: ['ignore', 'inherit', 'pipe'] })
      child.on('exit', resolve)
      child.stderr.on('data', (d) => {
        const text = d.toString()
        if (/error/i.test(text) && !/--output-file|deprecat/i.test(text)) console.error(text.trim())
      })
    })
    if (code !== 0) {
      console.error(`\nlighthouse exited with code ${code}`)
      process.exitCode = 1
      return
    }

    const report = JSON.parse(readFileSync(outPath, 'utf8'))
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
    )
    console.log(`\nLighthouse (${PRESET}) — ${URL}`)
    for (const [category, score] of Object.entries(scores)) {
      const ok = score >= TARGET ? 'PASS' : 'FAIL'
      console.log(`  ${ok}  ${category.padEnd(14)} ${score}`)
    }
    const failing = Object.entries(scores).filter(([, score]) => score < TARGET)
    if (failing.length > 0) {
      console.log('\nAudits to look at:')
      for (const [key, value] of Object.entries(report.categories)) {
        const failingRefs = value.auditRefs
          .filter((ref) => ref.score !== null && ref.score < 0.97)
          .map((ref) => `    - ${ref.id}`)
        if (failingRefs.length) {
          console.log(`  ${key}:`)
          console.log(failingRefs.join('\n'))
        }
      }
    }
    process.exitCode = failing.length > 0 ? 1 : 0
  } catch (err) {
    console.error('LIGHTHOUSE RUN FAILED:', err)
    process.exitCode = 1
  } finally {
    try {
      spawn('taskkill', ['/F', '/T', '/PID', String(server.pid)])
    } catch {
      server.kill()
    }
  }
}

run()