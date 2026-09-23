import { Mail } from 'lucide-react'
import type { SocialLink } from '../data/profile'
import { cn } from '../lib/utils'
import { GithubIcon, LinkedinIcon, XIcon } from './icons'

type IconComponent = (props: { className?: string }) => React.ReactNode

const iconMap: Record<string, IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  'twitter / x': XIcon,
  twitter: XIcon,
  x: XIcon,
  email: Mail,
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {links.map((link) => {
        const Icon = iconMap[link.label.toLowerCase()] ?? GithubIcon
        const external = !link.url.startsWith('mailto:')
        return (
          <li key={link.label}>
            <a
              href={link.url}
              aria-label={link.label}
              {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="inline-flex size-10 items-center justify-center rounded-full border border-edge bg-card/60 text-slate-300 transition-all duration-300 hover:border-cyan/40 hover:text-cyan hover:shadow-glow-sm"
            >
              <Icon className="size-[1.05rem]" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}