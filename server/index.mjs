import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getContent, saveUpload, updateCollection, uploadsDir } from './store.mjs'
import {
  authEnabled,
  login,
  logout,
  multerError,
  readSessionCookie,
  setSessionCookie,
  upload,
  validSession,
} from './auth.mjs'
import { validateCollection } from './validate.mjs'

const app = express()
const PORT = Number(process.env.PORT) || 4000
const rootDir = dirname(fileURLToPath(import.meta.url))

app.disable('x-powered-by')
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)
app.use(express.json({ limit: '100kb' }))

app.use(function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// ------------------------- Content (public) -------------------------

app.get('/api/content', async (_req, res) => {
  res.json(await getContent())
})

// ------------------------- Uploads -------------------------

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  next()
})
app.use('/uploads', express.static(uploadsDir()))

// ------------------------- Admin auth -------------------------

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
})

app.post('/api/admin/login', loginLimiter, (req, res) => {
  if (!authEnabled()) {
    return res.status(503).json({
      message: 'Admin is not configured. Set ADMIN_PASSWORD in the server .env file.',
    })
  }
  const username = String(req.body?.username ?? '').slice(0, 120)
  const password = String(req.body?.password ?? '').slice(0, 200)
  const token = login(username, password)
  if (!token) return res.status(401).json({ message: 'Invalid credentials.' })
  setSessionCookie(res, token)
  res.json({ message: 'Welcome back.' })
})

function requireAdmin(req, res, next) {
  const token = readSessionCookie(req)
  if (!validSession(token)) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  next()
}

app.get('/api/admin/me', (req, res) => {
  if (!authEnabled()) return res.status(503).json({ message: 'Admin not configured.' })
  const token = readSessionCookie(req)
  if (!validSession(token)) return res.status(401).json({ message: 'Unauthorized.' })
  res.json({ username: process.env.ADMIN_USER || 'admin' })
})

app.post('/api/admin/logout', (req, res) => {
  logout(readSessionCookie(req))
  setSessionCookie(res, '', { clear: true })
  res.json({ message: 'Logged out.' })
})

// ------------------------- Admin content CRUD -------------------------

function adminWriteCheck(req, res, next) {
  if (req.get('x-admin-request') !== '1') return res.status(403).json({ message: 'Forbidden.' })
  next()
}

app.get('/api/admin/content', requireAdmin, async (_req, res) => {
  res.json(await getContent())
})

app.put('/api/admin/content/:collection', requireAdmin, adminWriteCheck, async (req, res) => {
  try {
    const name = String(req.params.collection)
    const value = validateCollection(name, req.body?.value)
    await updateCollection(name, value)
    res.json({ message: 'Saved', collection: name, value })
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid content.' })
  }
})

app.post(
  '/api/admin/upload',
  requireAdmin,
  adminWriteCheck,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
    try {
      const { url } = await saveUpload(req.file)
      res.json({ url, message: 'Uploaded' })
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Upload failed.' })
    }
  },
)

app.use((error, _req, res, next) => {
  if (error instanceof multerError) {
    return res.status(400).json({ message: error.message })
  }
  next(error)
})

// ------------------------- Contact form (public) -------------------------

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
})
app.use('/api/contact', limiter)

function sanitize(value) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, 2000)
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

app.post('/api/contact', async (req, res) => {
  try {
    const name = sanitize(req.body.name).slice(0, 120)
    const email = sanitize(req.body.email).slice(0, 254)
    const subject = sanitize(req.body.subject).slice(0, 160)
    const message = sanitize(req.body.message).slice(0, 2000)

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }
    if (message.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long.' })
    }
    const honeypot = sanitize(req.body.website)
    if (honeypot) {
      return res.status(200).json({ message: 'Thanks for your message!' })
    }

    const receipt = {
      to: process.env.CONTACT_RECIPIENT ?? 'hello@abdullahtariq.dev',
      from:
        process.env.SMTP_FROM ?? (process.env.CONTACT_RECIPIENT ?? 'no-reply@abdullahtariq.dev'),
      replyTo: email,
      subject: `[Portfolio] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
      await transporter.sendMail(receipt)
    } else if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? 'Portfolio <onboarding@resend.dev>',
          to: [receipt.to],
          reply_to: email,
          subject: receipt.subject,
          text: receipt.text,
        }),
      })
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(`Resend error: ${response.status} ${detail}`)
      }
    } else {
      // Dev fallback — never use in production without a configured provider.
      console.log('\n--- Contact form submission ---')
      console.log(`To: ${receipt.to}`)
      console.log(receipt.text)
      console.log('------------------------------\n')
    }

    res.status(200).json({ message: 'Thanks for your message! I will get back to you soon.' })
  } catch (error) {
    console.error('Contact handler error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

const root = join(rootDir, '..')

// Production: serve the built frontend from dist/ with SPA fallback.
if (process.env.SERVE_DIST === 'true' || process.env.NODE_ENV === 'production') {
  const dist = join(root, 'dist')
  if (existsSync(dist)) {
    app.use(express.static(dist))
    app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
      res.sendFile(join(dist, 'index.html'))
    })
  }
}

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found.' })
})

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Portfolio server listening on http://localhost:${PORT}`)
    if (!authEnabled()) {
      console.warn(
        'Warning: ADMIN_PASSWORD is not set — admin login is disabled. See .env.example.',
      )
    }
  })
}

export { app }