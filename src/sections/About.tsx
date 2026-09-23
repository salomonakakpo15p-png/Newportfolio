import { ArrowRight, CalendarCheck, Mail, MapPin, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../components/Button'
import { GlassCard } from '../components/GlassCard'
import { Reveal } from '../components/Reveal'
import { useSiteData } from '../lib/content-store'

interface AboutRow {
  label: string
  value: string
  icon: LucideIcon
}

export function About() {
  const { profile } = useSiteData()

  const rows: AboutRow[] = [
    { label: 'Name', value: profile.name, icon: User },
    { label: 'Location', value: profile.location, icon: MapPin },
    { label: 'Email', value: profile.email, icon: Mail },
    { label: 'Availability', value: profile.availability, icon: CalendarCheck },
  ]

  return (
    <section id="about" aria-labelledby="about-title" className="flex h-full scroll-mt-24 flex-col">
      <Reveal>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">About</span>
        <h2 id="about-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          About Me
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mt-8 h-full">
        <GlassCard className="flex h-full flex-col p-7 md:p-9">
          <p className="text-base leading-relaxed text-ink/90 md:text-lg">{profile.bio}</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {rows.map((row) => (
              <li key={row.label} className="flex items-center gap-3.5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-edge bg-cyan/5 text-cyan">
                  <row.icon className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-slate-500">{row.label}</span>
                  <p className="mt-0.5 truncate text-sm font-medium text-ink">{row.value}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-2">
            <Button href="#contact" variant="secondary" icon={<ArrowRight className="size-4" />}>
              More About Me
            </Button>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  )
}