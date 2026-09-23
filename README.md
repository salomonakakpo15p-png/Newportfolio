# Portfolio — SamDev

Premium personal portfolio for a software developer / digital creative. Dark navy design with cyan accents, glassmorphism cards, floating statistics and smooth animations. Built as a single-page React application.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8**
- **Tailwind CSS** v4 (design tokens centralized in `src/index.css`)
- **Motion** (Framer Motion successor) for animations
- **Lucide React** for icons + custom brand icons (`GitHub`, `LinkedIn`, `X`)
- **React Router** for the public site + admin space routing
- **Express** server for the contact form + a content API + a protected admin CMS

Performance engineering applied to this build:
- **Async bootstrap** (`src/main.tsx`) — react-router + the whole admin app are **dynamically imported only under `/admin`**; the public site never downloads them.
- **Code splitting** (`vite.config.ts` `manualChunks`) — `react` (react-dom only), `motion`, `icons`, `router`, `lazy-sections` are separate cacheable chunks.
- **`preloadAssets` Vite plugin** — inlines critical above-the-fold CSS, loads the full stylesheet asynchronously (with `<noscript>` fallback) and preloads the hero image + fonts.
- Lazy-loaded page sections.

## Requirements

- Node.js **≥ 20.19** (the project was developed on Node 24 LTS)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev          # Starts BOTH the API (port 4000) and the Vite dev server (http://localhost:5173) together
```

That's the only command you need. It runs the Express API (`server/index.mjs`) and Vite in the same terminal;
the dev server proxies `/api` and `/uploads` to the API server, so the public site **and the admin space** work
out of the box.

You can still run them separately if you prefer (two terminals):

```bash
npm run dev:only     # Vite only → http://localhost:5173
npm run server       # API only → http://localhost:4000
```

## Admin space (CMS)

Every piece of content on the site can be edited from a password-protected admin area at **`/admin`**
(login, dashboard, editors for profile, skills, projects, testimonials, stats, process and SEO, plus file uploads).
Uploaded files have a **Download** button to fetch them back.

The admin is **disabled by default** (secure): it only activates when `ADMIN_PASSWORD` is set in the server's
environment. Copy `.env.example` → `.env` and configure:

| Variable | Default | Purpose |
| --- | --- | --- |
| `ADMIN_USER` | `admin` | Login username |
| `ADMIN_PASSWORD` | *(unset)* | Required — enables the admin. Use a long random value. |
| `SESSION_TTL_HOURS` | `12` | Session lifetime in hours (re-login required afterwards) |
| `COOKIE_SECURE` | `false` | Set `true` when serving over HTTPS to mark the session cookie `Secure` |
| `SERVE_DIST` | `false` | When `true` (or `NODE_ENV=production`), the Express server also serves the built `dist/` on port 4000 — handy for a single-process deployment |

How it works:

1. The admin saves content via the protected content API (`/api/admin/*` — needs the session cookie).
2. Data is persisted JSON files under `server/data/` (atomic writes).
3. The public site fetches the same content from `GET /api/content` and **merges** it with the
   defaults bundled in `src/lib/site-data.ts` — missing keys fall back to the compiled defaults,
   so an empty database still renders a complete site.
4. Uploaded images/files land in `server/uploads/` and are served from `/uploads/`.

> Content in `src/data/` is now the **default/fallback content**; live content lives in `server/data/content.json`.

## Production build

```bash
npm run build        # type-check + generate CV PDF + vite build → dist/
npm run preview      # serve the production build locally
```

## Contact form backend

The form posts to `/api/contact`. Configure email delivery via environment variables
(copy `.env.example` → `.env` and fill in one provider):

- **SMTP (Nodemailer)**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- **Resend**: `RESEND_API_KEY`, `RESEND_FROM`
- **Recipient**: `CONTACT_RECIPIENT`
- **Allowed origins**: `CORS_ORIGIN` (comma-separated)

If no provider is configured, submissions are **logged to the console** (dev fallback only — never use in production).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server → http://localhost:5173 |
| `npm run build` | Type-check + generate CV PDF + Vite build → `dist/` |
| `npm run preview` | Vite preview of the production build |
| `npm run server` | API server (contact + content + admin) → http://localhost:4000 |
| `npm run server:dev` | API server with hot reload |
| `npm run dev:only` | Vite only → http://localhost:5173 |
| `npm run cv` | Regenerate the CV PDF from profile data |
| `npm run test:smoke` | Headless end-to-end smoke test (uses Edge), writes output to `artifacts/` |
| `npm run test:lighthouse` | Lighthouse desktop audit + budget check |

## Customization

The easiest way is the **admin CMS** at `/admin`. The compiled defaults live in `src/data/` (and their
types/defaults in `src/lib/site-data.ts`) — these show up whenever a piece of content hasn't been
saved through the admin yet:

| File | What it configures |
| --- | --- |
| `profile.ts` | Name, role, bio, photo, contact info, social links, hero stats, CV URL |
| `skills.ts` | Skill names + percentages |
| `projects.ts` | Project cards (image, tech, links, featured flag) |
| `testimonials.ts` | Carousel testimonials |
| `stats.ts` | "By The Numbers" counters |
| `process.ts` | Work process steps |
| `site.ts` | SEO meta (title, description, URL) |

### Personalization checklist

1. Hero photo: `public/mon-profil.jpg` is served at `/mon-profil.jpg` and referenced by `profile.photo` in
   `server/data/content.json` (or manage it from the admin → Profile → Photo).
2. Put real project images in `src/assets/projects/` and update `projects.ts`.
3. Update `profile.socialLinks` with your GitHub / LinkedIn / X / email URLs.
4. Place your CV at `public/cv/` (or run `npm run cv` to regenerate from profile data) and set `profile.cvUrl`.
5. Update `site.url` and every URL in `index.html`, `public/robots.txt`, `public/sitemap.xml`.
6. Create `.env` from `.env.example` and configure email delivery.
7. Replace the placeholder project screenshots and avatars with real assets.

### Design tokens

Colors, fonts, shadows and keyframes are defined once in `src/index.css` under `@theme`
(background `#020817`, navy `#061426`, cyan `#12E6F3`, text `#F5F7FA`, borders `rgba(80,200,255,0.18)`).

## Architecture

```
src/
  main.tsx            async bootstrap — dynamically loads the router + admin only for /admin, else the public site
  assets/            images, project covers, avatars
  components/        reusable UI (Button, GlassCard, SkillBar, ProjectCard, carousel, form, header, ...)
  sections/          page sections (Hero, About, Skills, Projects, Process, Testimonials, Stats, Contact, Footer)
  data/              default content, centralized and typed
  pages/             PortfolioPage + the admin space (pages/admin/*)
  hooks/             useScrollSpy, useCountUp
  lib/               content-store (shared public content), site-data (types + defaults)
  index.css          Tailwind theme + global styles
public/              mon-profil.jpg (hero photo), CV, og-image.png, robots.txt, sitemap.xml
vite.config.ts       build pipeline: preloadAssets plugin (critical CSS + preloads), manualChunks, Tailwind
server/
  index.mjs          Express API: contact, public content, protected admin CRUD, uploads, prod static serving
  auth.mjs           Admin sessions (cookie/TTL) + uploads (multer)
  store.mjs          JSON persistence with atomic writes (server/data/content.json)
  validate.mjs       Per-collection sanitizers/validators
scripts/             CV generator, smoke test, Lighthouse audit
```

Admin flows use `src/pages/admin`: `AdminRoutes` (login guard + layout + dashboard) with a generic
`CollectionEditor` driven by `collection-configs.ts` (skills, stats, process, testimonials) and
bespoke editors for profile, projects and site SEO (`fields.tsx` / `fields-hooks.ts` provide the UI).

## Accessibility & performance

- Semantic HTML, aria labels on icon-only buttons, keyboard-navigable carousel, visible focus outlines.
- `prefers-reduced-motion` respected (reveal, counters, carousel, floats, smooth scroll are reduced/disabled).
- Lazy-loaded images, explicit image dimensions (no CLS), WebP/AVIF ready, font subsetting via unicode-range.
- **Critical CSS is inlined** in `<head>` and the full stylesheet loads asynchronously (with `<noscript>` fallback) — the initial paint doesn't wait for the 49 KB Tailwind stylesheet.
- **Resource preloads**: hero image + `Space Grotesk`/`Inter` subsets preloaded via the `preloadAssets` plugin.
- The admin space and react-router are excluded from the initial bundle (async bootstrap + `manualChunks`); vendor code is split into cacheable chunks.

## SEO

Indexable single page: dynamic `<title>`, meta description, canonical, Open Graph, Twitter Cards,
`robots.txt`, `sitemap.xml`, and Schema.org `Person` JSON-LD (injected from profile data).
`og-image.png` is generated from the profile photo.

## Security

- No API keys or secrets in the frontend — the form and the admin always call the API, which holds credentials server-side in `.env`.
- Server-side: body size limit, input sanitization, rate limiting (10 req / 10 min per IP on the form, 20 logins / 15 min on `/api/admin/login`), honeypot, double-submit guard, CORS allowlist, security headers.
- **Admin**: disabled until `ADMIN_PASSWORD` is set; mandatory login (server-side session, HttpOnly + SameSite=Lax cookie, TTL), authenticated writes rejected without the session, uploaded files whitelisted by extension and size-limited; `COOKIE_SECURE=true` over HTTPS.