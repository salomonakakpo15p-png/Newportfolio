import { Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data/site'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useSiteData } from '../lib/content-store'
import { cn } from '../lib/utils'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const profile = useSiteData().profile
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionIds = NAV_LINKS.map((link) => link.href.slice(1))
  const activeId = useScrollSpy(sectionIds, 140)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong border-b border-edge' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-cyan-bright font-display text-sm font-bold text-void shadow-glow-sm">
            {profile.initials}
          </span>
          <span className="hidden font-display text-base font-semibold tracking-tight text-ink sm:block">
            {profile.name}
          </span>
        </a>

        <nav className="hidden lg:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === `#${activeId}`
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                      isActive ? 'text-cyan' : 'text-slate-300 hover:text-ink',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-cyan shadow-[0_0_12px_rgba(18,230,243,0.8)]"
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              download
              className="hidden items-center gap-2 rounded-full border border-edge bg-card/60 px-4 py-2 text-sm font-medium text-ink transition-all duration-300 hover:border-cyan/40 hover:text-cyan hover:shadow-glow-sm sm:inline-flex"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-edge bg-card/60 text-ink transition-colors duration-300 hover:border-cyan/40 lg:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} activeId={activeId} onClose={() => setMenuOpen(false)} />
    </header>
  )
}