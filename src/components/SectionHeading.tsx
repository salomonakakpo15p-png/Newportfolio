import { cn } from '../lib/utils'
import { Reveal } from './Reveal'
import SplitText from './SplitText'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  animated?: boolean
}

function Title({ text, animated, className }: { text: string; animated: boolean; className: string }) {
  if (!animated) return <h2 className={className}>{text}</h2>
  return (
    <SplitText
      tag="h2"
      text={text}
      className={className}
      textAlign="inherit"
      splitType="chars"
      threshold={0.3}
      duration={0.6}
      delay={20}
      from={{ opacity: 0, y: 36 }}
      to={{ opacity: 1, y: 0 }}
    />
  )
}

export function SectionHeading({ eyebrow, title, description, align = 'center', animated = false }: SectionHeadingProps) {
  const titleClass =
    'font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-[2.6rem] md:leading-tight'
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-col gap-3 md:mb-16',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{eyebrow}</span>
      <Title text={title} animated={animated} className={titleClass} />
      {description && (
        <p className={cn('max-w-2xl text-base leading-relaxed text-slate-400', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </Reveal>
  )
}