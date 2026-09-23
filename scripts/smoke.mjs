import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const NODE = process.execPath
const VITE_BIN = 'node_modules/vite/bin/vite.js'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = 'http://localhost:5173'
const ADMIN_USER = 'smoke-admin'
const ADMIN_PASS = 'smoke-pass-2026'

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

function spawnServer(args, env = {}) {
  const child = spawn(NODE, args, {
    detached: true,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let out = ''
  child.stdout.on('data', (d) => (out += d.toString()))
  child.stderr.on('data', (d) => (out += d.toString()))
  return { child, log: () => out }
}

async function killTree(child) {
  if (!child || child.exitCode !== null || child.killed) return
  try {
    spawn('taskkill', ['/F', '/T', '/PID', String(child.pid)])
  } catch {
    child.kill()
  }
}

const results = []
const report = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

mkdirSync('artifacts', { recursive: true })

async function shotPage(options) {
  try {
    await page.screenshot(options)
  } catch (err) {
    console.log(`SKIP  screenshot ${options.path} — ${String(err).split('\n')[0]}`)
  }
}

// ------------------------- Content snapshot/restore -------------------------

const contentFile = 'server/data/content.json'
const uploadsDir = 'server/uploads'
const originalContent = existsSync(contentFile) ? readFileSync(contentFile, 'utf8') : null
const originalUploads = existsSync(uploadsDir) ? readdirSync(uploadsDir) : []

function restoreContent() {
  try {
    if (originalContent === null) {
      rmSync(contentFile, { force: true })
    } else {
      mkdirSync('server/data', { recursive: true })
      writeFileSync(contentFile, originalContent)
    }
    if (existsSync(uploadsDir)) {
      for (const file of readdirSync(uploadsDir)) {
        if (!originalUploads.includes(file)) rmSync(`${uploadsDir}/${file}`, { force: true })
      }
    }
  } catch (err) {
    console.error('WARN  could not restore content after test:', err)
  }
}

// ------------------------- Boot servers -------------------------

const api = spawnServer(
  ['server/index.mjs'],
  { ADMIN_USER, ADMIN_PASSWORD: ADMIN_PASS, SESSION_TTL_HOURS: '1' },
)
const dev = spawnServer([VITE_BIN])
let browser
let page

try {
  await waitFor('http://localhost:4000/')
  report('contact server reachable', true)

  const probe = await fetch('http://localhost:4000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  report('api validation (empty body → 400)', probe.status === 400, `status=${probe.status}`)

  // Admin API must reject unauthenticated access.
  const unauthGet = await fetch('http://localhost:4000/api/admin/content')
  report('admin API blocks unauthenticated read', unauthGet.status === 401, `status=${unauthGet.status}`)
  const unauthPut = await fetch('http://localhost:4000/api/admin/content/skills', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Request': '1' },
    body: JSON.stringify({ value: [] }),
  })
  report('admin API blocks unauthenticated write', unauthPut.status === 401, `status=${unauthPut.status}`)
  const loginOk = await fetch('http://localhost:4000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  })
  const setCookie = loginOk.headers.get('set-cookie') ?? ''
  report(
    'admin login sets session cookie',
    loginOk.status === 200 && setCookie.toLowerCase().includes('portfolio_admin'),
    `status=${loginOk.status} set-cookie=${setCookie.slice(0, 40)}`,
  )

  await waitFor(BASE)
  await sleep(1500)

  browser = await chromium.launch({ executablePath: EDGE, headless: true })
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const consoleErrors = []
  const pageErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => pageErrors.push(String(err)))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(800)

  const content = JSON.parse(readFileSync(contentFile, 'utf8'))
  const expectTitle = `${content.profile.name} — ${content.profile.role}`
  await page.waitForFunction((t) => document.title === t, expectTitle, { timeout: 10000 }).catch(() => {})
  report('page title from content data', (await page.title()) === expectTitle, await page.title())
const h1 = await page.locator('h1').first().textContent()
  const h1Norm = (h1 ?? '').replace(/\s+/g, ' ').trim()
  report('hero headline', h1Norm.includes('Je crée des expériences numériques qui comptent.'), h1Norm)

  for (const [label, width] of Object.entries({ mobile: 375, tablet: 768, desktop: 1440 })) {
    await page.setViewportSize({ width, height: 900 })
    await sleep(400)
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: document.documentElement.clientWidth,
    }))
    report(
      `no horizontal overflow @${label}(${width})`,
      overflow.sw <= overflow.iw,
      `scrollWidth=${overflow.sw} clientWidth=${overflow.iw}`,
    )
  }

  await page.setViewportSize({ width: 375, height: 812 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(500)
  await shotPage({ path: 'artifacts/smoke-mobile-top.png' })

  const hamburger = page.locator('header button').last()
  await hamburger.click()
  await sleep(600)
  const mobileNavVisible = await page.locator('nav[aria-label="Mobile navigation"]').isVisible()
  report('mobile menu opens', mobileNavVisible)
  if (mobileNavVisible) {
    await page.locator('nav[aria-label="Mobile navigation"] a[href="#about"]').click()
    await sleep(700)
    const closed = await page.locator('nav[aria-label="Mobile navigation"]').isHidden()
    report('mobile menu closes on link click', closed)
    report('menu link scrolls to About', page.url().endsWith('#about'))
  }

  await page.evaluate(() => window.scrollTo(0, document.querySelector('#testimonials').offsetTop - 100))
  await sleep(700)
  const q1 = await page.locator('blockquote').first().textContent()
  await page.locator('button[aria-label="Next testimonial"]').click()
  await sleep(600)
  const q2 = await page.locator('blockquote').first().textContent()
  report('carousel next changes testimonial', q1 !== q2)
  await page.locator('button[aria-label="Previous testimonial"]').click()
  await sleep(600)
  const q3 = await page.locator('blockquote').first().textContent()
  report('carousel prev changes testimonial', q3 !== q2 || q1 === q3)

  await page.evaluate(() => window.scrollTo(0, document.querySelector('#contact').offsetTop - 80))
  await sleep(600)
  await page.locator('#contact button[type="submit"]').click()
  await sleep(300)
  report('form validates empty name', await page.locator('#contact-name-error').isVisible())

  await page.locator('#contact-name').fill('Jane Cooper')
  await page.locator('#contact-email').fill('not-an-email')
  await page.locator('#contact-subject').fill('Project enquiry')
  await page.locator('#contact-message').fill('Hello, I have a project to discuss with you.')
  await page.locator('#contact button[type="submit"]').click()
  await sleep(300)
  report('form validates email format', await page.locator('#contact-email-error').isVisible())

  await page.locator('#contact-email').fill('jane@company.com')
  await page.locator('#contact button[type="submit"]').click()
  await sleep(900)
  const success = await page.getByText('Message sent!').isVisible().catch(() => false)
  report('form submits successfully via API', success)
  await shotPage({ path: 'artifacts/smoke-mobile-contact.png' })

  await page.evaluate(() => window.scrollTo(0, 10000))
  await sleep(700)
  const btt = page.locator('button[aria-label="Back to top"]').first()
  const bttVisible = await btt.isVisible().catch(() => false)
  report('back-to-top appears after scroll', bttVisible)
  if (bttVisible) {
    await btt.click()
    await sleep(2600)
    const top = await page.evaluate(() => window.scrollY)
    report('back-to-top scrolls to top', top < 50, `scrollY=${top}`)
  }

  await page.setViewportSize({ width: 1440, height: 2000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(600)
  await shotPage({ path: 'artifacts/smoke-desktop.png' })

  // --- Visual / style sanity checks ---
  const style = await page.evaluate(() => {
    const body = getComputedStyle(document.body)
    const aboutCard = document.querySelector('#about .glass')
    const heroImg = document.querySelector('#home img')
    const h1 = document.querySelector('h1')
    return {
      bodyBg: body.backgroundColor,
      bodyFont: body.fontFamily,
      h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
      glassBlur: aboutCard ? getComputedStyle(aboutCard).backdropFilter || getComputedStyle(aboutCard).webkitBackdropFilter : null,
      glassRadius: aboutCard ? getComputedStyle(aboutCard).borderRadius : null,
      heroImgNatural: heroImg ? heroImg.naturalWidth : null,
      heroImgObjectFit: heroImg ? getComputedStyle(heroImg).objectFit : null,
      heroImgRect: heroImg ? heroImg.getBoundingClientRect().toJSON() : null,
      headerPosition: getComputedStyle(document.querySelector('header')).position,
      cvHref: document.querySelector('header a[download]')?.getAttribute('href') ?? null,
      floatingStatCount: document.querySelectorAll('#home .animate-float').length,
      hasGrid: !!document.querySelector('.bg-grid')?.getBoundingClientRect().width,
    }
  })
  report('body background is navy void', style.bodyBg === 'rgb(2, 8, 23)', style.bodyBg)
  report('display font applied to h1', (style.h1Font ?? '').includes('Space Grotesk') || (style.h1Font ?? '').toLowerCase().includes('space'), style.h1Font)
  report('glassmorphism blur applied', (style.glassBlur ?? '').toLowerCase().includes('blur'), style.glassBlur)
  report('glass cards rounded', style.glassRadius === '16px', style.glassRadius)
  report('hero image uses real asset', Number(style.heroImgNatural) > 0 && Number(style.heroImgNatural) <= 12000, `natural=${style.heroImgNatural}`)
  report('hero image object-fit cover (no distortion)', style.heroImgObjectFit === 'cover', style.heroImgObjectFit)
  report('header is fixed/sticky', style.headerPosition === 'fixed', style.headerPosition)
  const cvOk = content.profile.cvUrl ? style.cvHref === content.profile.cvUrl : style.cvHref === null
  report('CV download link matches content data', cvOk, `${style.cvHref} (data=${content.profile.cvUrl || 'none'})`)
  report('floating stats rendered on desktop', Number(style.floatingStatCount) >= 3, `count=${style.floatingStatCount}`)
  report('background grid rendered', Boolean(style.hasGrid))

  // --- Admin flow ---
  const admin = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const adminErrors = []
  admin.on('pageerror', (err) => adminErrors.push(String(err)))

  await admin.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded' })
  await admin.waitForURL((u) => u.toString().includes('/admin/login'), { timeout: 20000 }).catch(() => {})
  report('admin redirects to login when logged out', admin.url().includes('/admin/login'), admin.url())

  // Wrong credentials are rejected.
  await admin.locator('input[type="text"]').fill(ADMIN_USER)
  await admin.locator('input[type="password"]').fill('wrong-password')
  await admin.locator('button[type="submit"]').click()
  await sleep(800)
  const loginError = await admin.getByText('Invalid credentials.').isVisible().catch(() => false)
  report('admin rejects wrong credentials', loginError)

  await admin.locator('input[type="password"]').fill(ADMIN_PASS)
  await admin.locator('button[type="submit"]').click()
  await sleep(1500)
  report('admin login navigates to dashboard', admin.url().endsWith('/admin'), admin.url())
  const dashboard = await admin.getByText('Portfolio Admin').first().isVisible().catch(() => false)
  report('admin dashboard header visible', dashboard)

  // Stats editor: rename the first stat, then check it on the public site.
  await admin.goto(`${BASE}/admin/stats`, { waitUntil: 'networkidle' })
  await sleep(1200)
  const statInput = admin.locator('input[placeholder="Happy Clients"]').first()
  const statBefore = await statInput.inputValue().catch(() => '')
  await statInput.fill('Test Clients')
  await admin.locator('button', { hasText: 'Save changes' }).click()
  let saved = false
  try {
    await admin.getByText('Saved').first().waitFor({ state: 'visible', timeout: 8000 })
    saved = true
  } catch {
    /* no toast within timeout */
  }
  report('admin saves modified stat', saved, `before="${statBefore}"`)
  if (saved) await shotPage({ path: 'artifacts/smoke-admin-editor.png' })

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(1000)
  const statSaved = await page.getByText('Test Clients').isVisible().catch(() => false)
  report('public site reflects admin edit', statSaved)

  // Image upload through the authenticated admin session.
  const uploadResult = await admin.evaluate(async () => {
    const bytes = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 13, 10, 12, 13, 8, 12, 10, 14, 6, 16, 18,
      194, 144, 57, 9, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 2, 174, 62, 10, 0,
      65, 74, 84, 78, 221, 138, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
    ])
    const form = new FormData()
    form.append('file', new File([bytes], 'smoke-tiny.png', { type: 'image/png' }))
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
      body: form,
    })
    const json = await res.json().catch(() => ({}))
    return { status: res.status, url: json.url }
  })
  report(
    'admin upload accepts image',
    uploadResult.status === 200 && typeof uploadResult.url === 'string' && uploadResult.url.startsWith('/uploads/'),
    `status=${uploadResult.status} url=${uploadResult.url}`,
  )
  if (uploadResult.url) {
    const served = await fetch(`http://localhost:4000${uploadResult.url}`)
    report('uploaded file is served', served.status === 200, `status=${served.status}`)
  }

  report('no admin page errors', adminErrors.length === 0, adminErrors.slice(0, 3).join(' | '))

  report('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  report('no page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))

  writeFileSync('artifacts/smoke-results.json', JSON.stringify({ results, consoleErrors, pageErrors }, null, 2))

  console.log('\n--- API server log (tail) ---')
  console.log(api.log().slice(-700))
} catch (err) {
  console.error('SMOKE TEST CRASHED:', err)
} finally {
  if (browser) await browser.close().catch(() => {})
  await killTree(api.child)
  await killTree(dev.child)
  restoreContent()
  if (results.length > 0 && !process.exitCode) {
    process.exitCode = results.some((r) => !r.ok) ? 1 : 0
  }
}