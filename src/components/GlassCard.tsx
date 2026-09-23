import type { ElementType, RefObject } from 'react'
import { cn } from '../lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  as?: ElementType
  glow?: boolean
  interactive?: boolean
  innerRef?: RefObject<HTMLElement | null>
  id?: string
  'aria-label'?: string
}

export function GlassCard({
  children,
  className,
  as: Tag = 'div',
  glow = false,
  interactive = false,
  innerRef,
  id,
  'aria-label': ariaLabel,
}: GlassCardProps) {
  return (
    <Tag
      ref={innerRef}
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'glass relative rounded-2xl shadow-card',
        interactive && 'transition-all duration-300 hover:border-edge-bright hover:shadow-glow',
        glow && 'shadow-glow',
        className,
      )}
    >
      {children}
    </Tag>
  )
}