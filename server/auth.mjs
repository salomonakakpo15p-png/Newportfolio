import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const require = createRequire(import.meta.url)
const multer = require('multer')

export const multerError = multer.MulterError

const SESSION_COOKIE = 'portfolio_admin'
const SESSION_TTL = (Number(process.env.SESSION_TTL_HOURS) || 12) * 60 * 60 * 1000

export function uploadsDir() {
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'uploads')
  mkdirSync(dir, { recursive: true })
  return dir
}

const sessions = new Map()

export function authEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function login(username, password) {
  if (!authEnabled()) return null
  const expectedUser = process.env.ADMIN_USER || 'admin'
  const expected = process.env.ADMIN_PASSWORD
  if (username !== expectedUser || password !== expected) return null
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { username, expires: Date.now() + SESSION_TTL })
  return token
}

export function logout(token) {
  sessions.delete(token)
}

export function validSession(token) {
  if (!token || !authEnabled()) return false
  const session = sessions.get(token)
  if (!session) return false
  if (Date.now() > session.expires) {
    sessions.delete(token)
    return false
  }
  return true
}

export function readSessionCookie(req) {
  const header = req.headers.cookie || ''
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === SESSION_COOKIE) return rest.join('=')
  }
  return null
}

export function setSessionCookie(res, token, opts = {}) {
  const secure = process.env.COOKIE_SECURE === 'true'
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL / 1000}`,
  ]
  if (secure) parts.push('Secure')
  if (opts.clear) {
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`)
    return
  }
  res.setHeader('Set-Cookie', parts.join('; '))
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir(),
    filename(_req, file, cb) {
      const safe = (file.originalname || 'file')
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .slice(-60)
      cb(null, `${Date.now()}-${randomBytes(4).toString('hex')}-${safe}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.pdf']
    const ext = (file.originalname.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Unsupported file type'))
  },
})