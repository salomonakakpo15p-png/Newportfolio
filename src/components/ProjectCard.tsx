import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { cn } from '../lib/utils'
import { Button } from './Button'
import { GlassCard } from './GlassCard'
import { GithubIcon } from './icons'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <GlassCard
      interactive
      className={cn(
        'group flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1.5',
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-edge">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} cover`}
            loading="lazy"
            decoding="async"
            width={480}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan/10 via-card to-void">
            <span className="px-4 text-center font-display text-2xl font-semibold text-cyan/40">
              {project.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-edge bg-void/70 px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-cyan backdrop-blur">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-ink">{project.title}</h3>
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-edge bg-white/5 text-slate-300 transition-colors duration-300 group-hover:border-cyan/40 group-hover:text-cyan">
            <span className="sr-only">Project index {index + 1}</span>
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">{project.description}</p>

        <ul className="mt-auto flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-edge bg-cyan/5 px-2.5 py-1 text-[0.6875rem] font-medium text-cyan/90"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-center gap-3">
          {project.liveUrl && (
            <Button href={project.liveUrl} external size="sm" variant="primary" icon={<ArrowUpRight className="size-4" />}>
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              href={project.githubUrl}
              external
              size="sm"
              variant="ghost"
              ariaLabel={`${project.title} source code on GitHub`}
              icon={<GithubIcon className="size-4" />}
            >
              Code
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}