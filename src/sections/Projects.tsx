import { ArrowUpRight } from 'lucide-react'
import { Button } from '../components/Button'
import { ProjectGrid } from '../components/ProjectGrid'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useSiteData } from '../lib/content-store'

export function Projects() {
  const data = useSiteData()
  const featured = data.projects
    .filter((project) => project.featured)
    .sort((a, b) => a.order - b.order)

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Œuvres sélectionnées"
          description="A selection of products I've designed and engineered. Each one solved a real problem for real users."
          animated
        />

        <Reveal>
          <ProjectGrid projects={featured} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Button href={data.profile.projectsUrl} external variant="secondary" icon={<ArrowUpRight className="size-4" />}>
            View All Projects
          </Button>
        </Reveal>
      </div>
    </section>
  )
}