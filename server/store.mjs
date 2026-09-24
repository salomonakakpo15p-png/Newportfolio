import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { get, put } from '@vercel/blob'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, 'data')
const storeFile = join(dataDir, 'content.json')
mkdirSync(dataDir, { recursive: true })

const BLOB_CONTENT_KEY = 'portfolio/content.json'
const BLOB_UPLOAD_PREFIX = 'portfolio/uploads/'

export function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

// Bundled content snapshot (committed by scripts/build-content.mjs). Used to
// seed the store on Vercel, where the local server/data/ file does not exist.
function readSeed() {
  try {
    const file = join(here, '..', 'src', 'generated', 'content.json')
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return {}
  }
}

function readLocal() {
  try {
    return JSON.parse(readFileSync(storeFile, 'utf8'))
  } catch {
    return {}
  }
}

function writeLocal(content) {
  const tmp = `${storeFile}.tmp`
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(tmp, JSON.stringify(content, null, 2), 'utf8')
  renameSync(tmp, storeFile)
}

async function streamToString(stream) {
  const reader = stream.getReader()
  const chunks = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export async function getContent() {
  if (blobEnabled()) {
    try {
      const entry = await get(BLOB_CONTENT_KEY, { access: 'private', useCache: false })
      if (entry) {
        const parsed = JSON.parse(await streamToString(entry.stream))
        if (parsed && typeof parsed === 'object') return parsed
      }
    } catch (error) {
      console.error('Blob read failed — using bundled content:', error?.message)
    }
    return structuredClone(readSeed())
  }
  return readLocal()
}

export async function updateCollection(name, value) {
  const content = await getContent()
  content[name] = structuredClone(value)
  if (blobEnabled()) {
    await put(BLOB_CONTENT_KEY, JSON.stringify(content, null, 2), {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
  } else {
    writeLocal(content)
  }
  return content[name]
}

export async function getCollection(name) {
  const content = await getContent()
  return content[name]
}

export function uploadsDir() {
  const dir = join(here, 'uploads')
  mkdirSync(dir, { recursive: true })
  return dir
}

export async function saveUpload(file) {
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}-${(file.originalname || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .slice(-60)}`
  if (blobEnabled()) {
    const entry = await put(`${BLOB_UPLOAD_PREFIX}${filename}`, file.buffer, {
      access: 'public',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: file.mimetype || 'application/octet-stream',
      cacheControlMaxAge: 31536000,
    })
    return { url: entry.url, filename }
  }
  writeFileSync(join(uploadsDir(), filename), file.buffer)
  return { url: `/uploads/${filename}`, filename }
}