import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// NOTE: This generator is intentionally self-contained (it cannot import
// `src/data/profile.ts`, which imports a `.png` asset Node cannot load).
// Keep the values below in sync with `src/data/profile.ts`.

const profile = {
  name: 'SamDev',
  role: 'Full-Stack Developer',
  email: 'hello@abdullahtariq.dev',
  phone: '+971 50 000 0000',
  location: 'Dubai, UAE',
  bioShort:
    "I'm a full-stack developer focused on building modern, responsive and user-focused digital experiences.",
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'cv')
const filePath = join(outDir, 'SamDev-CV.pdf')
mkdirSync(outDir, { recursive: true })

const lines = [
  { text: `${profile.name}`, size: 24, bold: true, x: 50, y: 720 },
  { text: `${profile.role}`, size: 14, bold: true, x: 50, y: 696 },
  { text: `${profile.email}  |  ${profile.phone}  |  ${profile.location}`, size: 10, bold: false, x: 50, y: 678 },
  { text: 'PROFILE', size: 12, bold: true, x: 50, y: 630 },
  { text: profile.bioShort, size: 10, bold: false, x: 50, y: 612 },
  { text: 'SKILLS', size: 12, bold: true, x: 50, y: 550 },
  { text: 'JavaScript / TypeScript, React / Next.js, Node.js / Express,', size: 10, bold: false, x: 50, y: 532 },
  { text: 'Python / Django, SQL / MongoDB, HTML / CSS / Tailwind', size: 10, bold: false, x: 50, y: 517 },
  { text: 'EXPERIENCE', size: 12, bold: true, x: 50, y: 470 },
  { text: `${profile.name} - Full-Stack Developer | 4+ years`, size: 10, bold: true, x: 50, y: 452 },
  { text: 'Building fast, accessible, user-focused web products for startups and agencies.', size: 10, bold: false, x: 50, y: 434 },
]

let stream = 'q\nBT\n'
for (const line of lines) {
  const font = line.bold ? '/F2' : '/F1'
  stream += `${font} ${line.size} Tf\n`
  stream += `1 0 0 1 ${line.x} ${line.y} Tm\n`
  stream += `(${line.text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj\n`
}
stream += 'ET\nQ\n'

const streamContent = Buffer.from(stream, 'latin1')
const objects = [
  '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
  `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n`,
]

let pdf = '%PDF-1.4\n'
const offsets = []
for (let i = 0; i < objects.length; i++) {
  offsets.push(Buffer.byteLength(pdf, 'latin1'))
  pdf += objects[i]
  if (i === 3) {
    pdf += streamContent.toString('latin1')
    pdf += '\nendstream\nendobj\n'
  }
}
const font1 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
const font2 = '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n'
const xrefStart = Buffer.byteLength(pdf, 'latin1')

const fontOffsets = []
for (const font of [font1, font2]) {
  fontOffsets.push(Buffer.byteLength(pdf, 'latin1'))
  pdf += font
}

pdf += `xref\n0 7\n0000000000 65535 f \n`
for (const offset of [...offsets, ...fontOffsets]) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
}
pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`

writeFileSync(filePath, Buffer.from(pdf, 'latin1'))
console.log(`CV generated at ${filePath} (${Buffer.byteLength(pdf, 'latin1')} bytes)`)