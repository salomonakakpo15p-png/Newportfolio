import { CalendarCheck, Mail, MapPin, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSiteData } from '../lib/content-store'

interface ContactRow {
  label: string
  value: string
  href?: string
  icon: LucideIcon
}

export function ContactInfo() {
  const { profile } = useSiteData()

  const rows: ContactRow[] = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    {
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^+\d]/g, '')}`,
      icon: Phone,
    },
    { label: 'Location', value: profile.location, icon: MapPin },
    { label: 'Availability', value: profile.availability, icon: CalendarCheck },
  ]

  return (
    <ul className="mt-8 space-y-4">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-center gap-4 rounded-2xl border border-edge bg-card/50 p-4 transition-colors duration-300 hover:border-cyan/30">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
              <row.icon className="size-[1.15rem]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-slate-500">{row.label}</p>
              {row.href ? (
                <a href={row.href} className="mt-0.5 block truncate text-sm font-medium text-ink hover:text-cyan">
                  {row.value}
                </a>
              ) : (
                <p className="mt-0.5 text-sm font-medium text-ink">{row.value}</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}