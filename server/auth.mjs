import { createRequire } from 'node:module'
import { createHmac, timingSafeEqual } from 'node:crypto'

const require = createRequire(import.meta.url)
const multer = require('multer')

export const multerError = multer.MulterError

const SESSION_COOKIE = 'portfolio_admin'
const SESSION_TTL = (Number(process.env.SESSION_TTL_HOURS) || 12) * 60 * 60 * 1000

function sign(payload) {
  return createHmac('sha256', process.env.ADMIN_PASSWORD || '').update(payload).digest('base64url')
}

export function authEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

// Stateless sessions: the token is an HMAC-signed payload, so it survives
// serverless cold starts and multi-instance execution on Vercel.
export function login(username, password) {
  if (!authEnabled()) return null
  const expectedUser = process.env.ADMIN_USER || 'admin'
  const expected = process.env.ADMIN_PASSWORD
  if (username !== expectedUser || password !== expected) return null
  const payload = Buffer.from(
    JSON.stringify({ u: expectedUser, exp: Date.now() + SESSION_TTL }),
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function logout() {
  // Sessions are stateless — there is nothing to revoke server-side.
}

export function validSession(token) {
  if (!token || !authEnabled()) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  if (!timingSafeEqual(a, b)) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof exp !== 'number' || Date.now() > exp) return false
    return true
  } catch {
    return false
  }
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
  const secure = process.env.COOKIE_SECURE === 'true' || process.env.VERCEL === '1'
  const securePart = secure ? 'Secure; ' : ''
  if (opts.clear) {
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${securePart.trim()}`)
    return
  }
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL / 1000}`,
  ]
  if (secure) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.pdf']
    const ext = (file.originalname.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Unsupported file type'))
  },
})