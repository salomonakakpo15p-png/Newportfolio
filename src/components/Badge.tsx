import { cn } from '../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export function Badge({ children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-edge bg-card/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-cyan',
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot"
        />
      )}
      {children}
    </span>
  )
}