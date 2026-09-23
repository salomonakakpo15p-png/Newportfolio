import { Briefcase, Heart, Rocket, type LucideIcon } from 'lucide-react'
import type { FloatingStat } from '../data/profile'
import { cn } from '../lib/utils'

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  rocket: Rocket,
  heart: Heart,
}

interface FloatingStatProps {
  stat: FloatingStat
  className?: string
  compact?: boolean
}

export function FloatingStat({ stat, className, compact = false }: FloatingStatProps) {
  const Icon = iconMap[stat.icon] ?? Briefcase
  return (
    <div
      className={cn(
        'glass flex items-center gap-3 rounded-xl border-edge shadow-card animate-float',
        compact ? 'flex-col gap-1 px-2.5 py-2 text-center' : 'px-4 py-3',
        className,
      )}
    >
      <span
        className={cn(
          'shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan',
          compact ? 'flex size-7' : 'inline-flex size-9',
        )}
      >
        <Icon className={compact ? 'size-3.5' : 'size-4'} aria-hidden="true" />
      </span>
      <div>
        <p className={cn('font-display font-semibold leading-tight text-ink', compact ? 'text-sm' : 'text-base')}>
          {stat.value}
        </p>
        <p className={cn('text-slate-400', compact ? 'text-[0.625rem] leading-tight' : 'text-xs')}>
          {stat.label}
        </p>
      </div>
    </div>
  )
}