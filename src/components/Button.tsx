import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface ButtonProps {
  children: ReactNode
  href?: string
  external?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  ariaLabel?: string
  disabled?: boolean
}

const baseClasses =
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-cyan to-cyan-bright text-void shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5',
  secondary: 'glass text-ink hover:border-edge-bright hover:-translate-y-0.5 hover:bg-cyan/5',
  ghost: 'text-slate-300 hover:text-cyan',
}

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-[0.8125rem]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[0.9375rem]',
}

function ButtonContent({
  children,
  icon,
  iconPosition,
}: Pick<ButtonProps, 'children' | 'icon' | 'iconPosition'>) {
  if (!icon) return <>{children}</>
  return (
    <>
      {iconPosition === 'right' && <span>{children}</span>}
      <span
        className={cn(
          'transition-transform duration-300',
          iconPosition === 'right' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5',
        )}
      >
        {icon}
      </span>
      {iconPosition !== 'right' && <span>{children}</span>}
    </>
  )
}

export function Button({
  children,
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon,
  iconPosition = 'right',
  className,
  ariaLabel,
  disabled = false,
}: ButtonProps) {
  const classes = cn(baseClasses, variants[variant], sizes[size], className)

  const content = (
    <ButtonContent icon={icon} iconPosition={iconPosition}>
      {children}
    </ButtonContent>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} aria-label={ariaLabel} disabled={disabled}>
      {content}
    </button>
  )
}