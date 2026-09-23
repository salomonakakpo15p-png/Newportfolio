import type { Project } from '../data/projects'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.id}>
          <ProjectCard project={project} index={index} />
        </li>
      ))}
    </ul>
  )
}