import { spawn } from 'node:child_process'
import net from 'node:net'

const NODE = process.execPath
const VITE_BIN = 'node_modules/vite/bin/vite.js'

const DEV_PORT = 5173

function isPortInUse(port, host) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host })
    const done = (inUse) => {
      socket.destroy()
      resolve(inUse)
    }
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
  })
}

const busy = (await isPortInUse(DEV_PORT, '127.0.0.1')) || (await isPortInUse(DEV_PORT, '::1'))

if (busy) {
  console.error(
    `\n  Port ${DEV_PORT} (localhost) is already in use — an older dev server is probably still running.\n` +
      `  Stop it (a terminal running an old "npm run dev"), then run "npm run dev" again.\n`,
  )
  process.exit(1)
}

const servers = [
  { name: 'api   ', args: ['server/index.mjs'] },
  { name: 'vite  ', args: [VITE_BIN] },
]

const children = servers.map(({ name, args }) => {
  const child = spawn(NODE, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  const prefix = (chunk) => String(chunk).split('\n').filter(Boolean).forEach((line) => console.log(`[${name}] ${line}`))
  child.stdout.on('data', prefix)
  child.stderr.on('data', prefix)
  child.on('exit', (code) => {
    if (code !== null && code !== 0) console.error(`[${name}] exited with code ${code}`)
  })
  return child
})

let shuttingDown = false
function stop() {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    try {
      child.kill()
    } catch {
      /* already gone */
    }
  }
  setTimeout(() => process.exit(0), 300)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)