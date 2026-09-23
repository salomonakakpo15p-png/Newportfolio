import { Heart } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/SocialLinks'
import { NAV_LINKS } from '../data/site'
import { useSiteData } from '../lib/content-store'

export function Footer() {
  const profile = useSiteData().profile
  const year = new Date().getFullYear()

  return (
    <Reveal y={16}>
      <footer className="border-t border-edge bg-void/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <a href="#home" className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-cyan-bright font-display text-sm font-bold text-void">
                {profile.initials}
              </span>
              <span className="font-display text-base font-semibold text-ink">{profile.name}</span>
            </a>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <SocialLinks links={profile.socialLinks} />

          <div className="flex w-full flex-col items-center gap-1 border-t border-edge pt-6 text-center">
            <p className="text-sm text-slate-500">
              © {year} {profile.name}. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-600">
              Designed & built with
              <Heart className="size-3.5 fill-cyan text-cyan" aria-hidden="true" />
              using React & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </Reveal>
  )
}