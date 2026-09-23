import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

interface Block {
  prelude: string | null
  body: string
}

function parseCss(css: string): Block[] {
  const blocks: Block[] = []
  let i = 0
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++
    if (i >= css.length) break
    const open = css.indexOf('{', i)
    if (open === -1) {
      const semi = css.indexOf(';', i)
      i = semi === -1 ? css.length : semi + 1
      continue
    }
    const prelude = css.slice(i, open).trim()
    let depth = 0
    let end = -1
    for (let k = open; k < css.length; k++) {
      if (css[k] === '{') depth++
      else if (css[k] === '}') {
        depth--
        if (depth === 0) {
          end = k
          break
        }
      }
    }
    if (end === -1) break
    blocks.push({ prelude, body: css.slice(open + 1, end) })
    i = end + 1
  }
  return blocks
}

function escapeSelectors(text: string): string {
  return text.replace(/\\(.)/g, '$1')
}

function collectTokens(source: string): Set<string> {
  const tokens = new Set<string>()
  for (const match of source.matchAll(/className=["'`]([^"'`]*)["'`]/g)) {
    for (const token of match[1].split(/\s+/)) {
      if (token && !token.startsWith('{')) tokens.add(token)
    }
  }
  for (const match of source.matchAll(/class:\s*["'`]([^"'`]*)["'`]/g)) {
    for (const token of match[1].split(/\s+/)) {
      if (token) tokens.add(token)
    }
  }
  return tokens
}

function selectorHasToken(selector: string, tokens: Set<string>): boolean {
  for (const segment of selector.split(',')) {
    for (const match of segment.matchAll(/\.[_a-zA-Z][\w-\\:[\]%./]*/g)) {
      const token = escapeSelectors(match[0].slice(1))
      if (tokens.has(token)) return true
    }
    if (/^(html|body|:root|#root|\*|::)/.test(segment.trim())) return true
  }
  return false
}

function filterCss(css: string, tokens: Set<string>): string | null {
  const out: string[] = []
  for (const block of parseCss(css)) {
    const prelude = block.prelude ?? ''
    const inner = block.body
    if (prelude.startsWith('@font-face')) out.push(`${prelude}{${inner}}`)
    else if (prelude.startsWith('@keyframes')) {
      out.push(`${prelude}{${inner}}`)
    } else if (prelude.startsWith('@layer')) {
      const parts = prelude.split(/\s+/)
      const layerName = parts[1] ?? ''
      if (layerName === 'theme' || layerName === 'base') {
        out.push(`${prelude}{${inner}}`)
      } else {
        const kept = filterCss(inner, tokens)
        if (kept) out.push(`${prelude}{${kept}}`)
      }
    } else if (prelude.startsWith('@media') || prelude.startsWith('@supports') || prelude.startsWith('@container')) {
      const kept = filterCss(inner, tokens)
      if (kept) out.push(`${prelude}{${kept}}`)
    } else if (prelude.startsWith('@')) {
      out.push(`${prelude}{${inner}}`)
    } else if (selectorHasToken(prelude, tokens)) {
      out.push(`${prelude}{${inner}}`)
    }
  }
  return out.length > 0 ? out.join('\n') : null
}

function preloadAssets(): Plugin {
  return {
    name: 'portfolio-preload-assets',
    apply: 'build',
    writeBundle(_options, bundle) {
      const htmlPath = join('dist', 'index.html')
      let html = readFileSync(htmlPath, 'utf8')

      const asset = (pattern: RegExp) => Object.keys(bundle).find((key) => pattern.test(key))
      const heroImage = asset(/^assets\/hero-[A-Za-z0-9_-]+\.png$/)
      const spaceGrotesk = asset(/^assets\/space-grotesk-latin-[A-Za-z0-9_-]+\.woff2$/)
      const inter = asset(/^assets\/inter-latin-[A-Za-z0-9_-]+\.woff2$/)
      const styleSheet = asset(/^assets\/index-[A-Za-z0-9_-]+\.css$/)

      if (heroImage) {
        html = html.replace(
          '<!-- HERO_IMAGE_PRELOAD -->',
          `<link rel="preload" as="image" href="/${heroImage}" fetchpriority="high">`,
        )
      }
      const fontTag = (url: string) =>
        `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${url}">`
      const fonts = [spaceGrotesk, inter].filter((url): url is string => Boolean(url)).map(fontTag)
      if (fonts.length > 0) {
        html = html.replace('<!-- FONT_PRELOADS -->', fonts.join(''))
      }

      if (styleSheet) {
        const fullCss = readFileSync(join('dist', styleSheet), 'utf8')
        const aboveFoldFiles = [
          'src/components/Header.tsx',
          'src/components/MobileMenu.tsx',
          'src/components/Background.tsx',
          'src/components/BackToTop.tsx',
          'src/sections/Hero.tsx',
          'src/components/Badge.tsx',
          'src/components/Button.tsx',
          'src/components/FloatingStat.tsx',
          'src/components/SocialLinks.tsx',
          'src/components/icons.tsx',
          'src/components/icons/index.tsx',
          'src/lib/site-config.ts',
        ]
        const tokens = new Set<string>()
        for (const file of aboveFoldFiles) {
          try {
            for (const token of collectTokens(readFileSync(join(process.cwd(), file), 'utf8'))) {
              tokens.add(token)
            }
          } catch {
            /* component may not exist */
          }
        }
        const critical = filterCss(fullCss, tokens)
        const cssHref = `/${styleSheet}`
        const linkPattern =
          /<link rel="stylesheet"[^>]*\/assets\/index-[^"]*\.css"[^>]*>|__CSS_LINK__/
        if (critical && critical.length < fullCss.length * 0.9) {
          const replacement = `<style>${critical}</style>
    <noscript><link rel="stylesheet" href="${cssHref}"></noscript>
    <link rel="stylesheet" href="${cssHref}" media="print" onload="this.media='all'">`
          if (linkPattern.test(html)) {
            html = html.replace(linkPattern, replacement)
          }
        }
      }
      writeFileSync(htmlPath, html)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadAssets()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react')) return 'react'
          if (id.includes('node_modules/motion')) return 'motion'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
  },
})