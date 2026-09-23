import { AnimatePresence, motion } from 'motion/react'
import { Download } from 'lucide-react'
import { useEffect } from 'react'
import { NAV_LINKS } from '../data/site'
import { useSiteData } from '../lib/content-store'
import { cn } from '../lib/utils'
import { SocialLinks } from './SocialLinks'

interface MobileMenuProps {
  open: boolean
  activeId: string
  onClose: () => void
}

export function MobileMenu({ open, activeId, onClose }: MobileMenuProps) {
  const profile = useSiteData().profile

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-void/80 backdrop-blur-2xl lg:hidden"
          aria-hidden="true"
        />
      )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Mobile navigation"
            className="fixed inset-x-0 top-16 z-50 origin-top px-4"
          >
            <div className="glass-strong rounded-2xl p-6 shadow-card">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      aria-current={link.href === `#${activeId}` ? 'true' : undefined}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200',
                        link.href === `#${activeId}`
                          ? 'bg-cyan/10 text-cyan'
                          : 'text-slate-300 hover:bg-white/5 hover:text-ink',
                      )}
                    >
                      {link.label}
                      {link.href === `#${activeId}` && (
                        <span className="inline-block size-1.5 rounded-full bg-cyan" aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-edge pt-4">
                <a
                  href={profile.cvUrl}
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-cyan-bright px-5 py-3 text-sm font-semibold text-void transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </a>
                <SocialLinks links={profile.socialLinks} className="mt-5 justify-center" />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}