import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), 'data')
const storeFile = join(dataDir, 'content.json')
mkdirSync(dataDir, { recursive: true })

function read() {
  try {
    return JSON.parse(readFileSync(storeFile, 'utf8'))
  } catch {
    return {}
  }
}

function write(content) {
  const tmp = `${storeFile}.tmp`
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(tmp, JSON.stringify(content, null, 2), 'utf8')
  renameSync(tmp, storeFile)
}

export function getContent() {
  return read()
}

export function updateCollection(name, value) {
  const content = read()
  content[name] = structuredClone(value)
  write(content)
  return content[name]
}

export function getCollection(name) {
  return read()[name]
}