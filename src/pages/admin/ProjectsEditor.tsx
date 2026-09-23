import { EditorShell, LoadingState } from './CollectionEditor'
import {
  AddButton,
  ImageInput,
  ItemCard,
  NumberInput,
  SaveBar,
  TextArea,
  TextInput,
  Toggle,
} from './fields'
import { useAdminEditor } from './fields-hooks'
import type { SiteData } from '../../lib/site-data'

function emptyProject() {
  return {
    id: `project-${Date.now()}`,
    title: '',
    slug: '',
    category: '',
    description: '',
    image: '',
    technologies: [] as string[],
    liveUrl: '',
    githubUrl: '',
    featured: true,
    order: 1,
  }
}

export function ProjectsEditor() {
  const { loading, value, setValue, save, saving, saved, error } = useAdminEditor<SiteData['projects']>(
    'projects',
    (values) => structuredClone(values.projects),
  )

  const update = (index: number, key: keyof SiteData['projects'][number], next: unknown) => {
    setValue((current) => current.map((item, i) => (i === index ? { ...item, [key]: next } : item)))
  }

  const add = () =>
    setValue((current) => [
      ...current,
      { ...emptyProject(), id: `project-${Date.now()}`, order: current.length + 1 },
    ])

  const remove = (index: number) => setValue((current) => current.filter((_, i) => i !== index))

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    setValue((current) => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div>
      <div className="space-y-4">
        {value.map((project, index) => (
          <ItemCard
            key={project.id || `project-${index}`}
            title={project.title || 'New project'}
            subtitle={`${project.category}${project.featured ? ' · Featured' : ''}`}
            onRemove={() => remove(index)}
            onMoveUp={index > 0 ? () => move(index, -1) : undefined}
            onMoveDown={index < value.length - 1 ? () => move(index, 1) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Title" value={project.title} onChange={(next) => update(index, 'title', next)} placeholder="FinTrack Dashboard" />
              <TextInput label="Slug" value={project.slug} onChange={(next) => update(index, 'slug', next)} hint="Not visible publicly yet" />
              <TextInput label="Category" value={project.category} onChange={(next) => update(index, 'category', next)} placeholder="SaaS · Finance" />
              <NumberInput label="Order" value={project.order} onChange={(next) => update(index, 'order', next)} hint="Sorts featured projects" />
              <TextArea label="Description" value={project.description} onChange={(next) => update(index, 'description', next)} />
              <div className="flex items-end pb-1">
                <Toggle
                  label="Featured"
                  checked={Boolean(project.featured)}
                  onChange={(next) => update(index, 'featured', next)}
                />
              </div>
              <TextInput label="Live URL" value={project.liveUrl ?? ''} onChange={(next) => update(index, 'liveUrl', next)} placeholder="https://example.com" />
              <TextInput label="GitHub URL" value={project.githubUrl ?? ''} onChange={(next) => update(index, 'githubUrl', next)} placeholder="https://github.com/you/repo" />
            </div>
            <div className="mt-4">
              <ImageInput
                label="Cover image"
                value={project.image}
                onChange={(next) => update(index, 'image', next)}
                hint="Upload an image or paste a URL. A gradient cover is shown when empty."
              />
            </div>
            <div className="mt-4">
              <TextInput
                label="Technologies"
                value={project.technologies.join(', ')}
                onChange={(next) =>
                  update(
                    index,
                    'technologies',
                    next.split(',').map((tech) => tech.trim()).filter(Boolean),
                  )
                }
                placeholder="React, TypeScript, Tailwind"
                hint="Comma-separated list of technologies"
              />
            </div>
          </ItemCard>
        ))}
      </div>

      <AddButton onClick={add} label="Add project" />
      <SaveBar onSave={() => void save()} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export function ProjectsEditorShell() {
  return (
    <EditorShell
      eyebrow="Portfolio"
      title="Projects"
      description="The projects shown in the “Selected Work” grid. Feature the ones you want on the homepage."
    >
      <ProjectsEditor />
    </EditorShell>
  )
}