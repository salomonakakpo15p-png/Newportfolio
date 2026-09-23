import type { SiteData } from '../../lib/site-data'
import { AddButton, ImageInput, ItemCard, SaveBar, SelectInput, TextArea, TextInput } from './fields'
import { useAdminEditor } from './fields-hooks'
import { EditorShell, LoadingState } from './CollectionEditor'

const statIcons = ['briefcase', 'rocket', 'heart']

const emptyStat = () => ({ icon: 'briefcase', value: '', label: '' })
const emptySocial = () => ({ label: 'GitHub', url: 'https://' })

export function ProfileEditor() {
  const { loading, value, setValue, save, saving, saved, error } = useAdminEditor<SiteData['profile']>(
    'profile',
    (values) => structuredClone(values.profile),
  )

  const set = (key: keyof SiteData['profile'], next: unknown) => {
    setValue((current) => ({ ...current, [key]: next }))
  }

  const updateStat = (index: number, key: 'icon' | 'value' | 'label', next: string) => {
    setValue((current) => ({
      ...current,
      heroStats: current.heroStats.map((stat, i) => (i === index ? { ...stat, [key]: next } : stat)),
    }))
  }

  const updateSocial = (index: number, key: 'label' | 'url', next: string) => {
    setValue((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link, i) =>
        i === index ? { ...link, [key]: next } : link,
      ),
    }))
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Name" value={value.name} onChange={(next) => set('name', next)} placeholder="SamDev" />
        <TextInput label="Initials" value={value.initials} onChange={(next) => set('initials', next)} hint="Shown in the logo monogram" />
        <TextInput label="Role" value={value.role} onChange={(next) => set('role', next)} placeholder="Full-Stack Developer" />
        <TextInput label="Badge" value={value.badge} onChange={(next) => set('badge', next)} placeholder="Software Developer" />
        <TextInput label="Headline (before highlight)" value={value.headlinePre} onChange={(next) => set('headlinePre', next)} placeholder="I build" />
        <TextInput label="Headline (highlight)" value={value.headlineHighlight} onChange={(next) => set('headlineHighlight', next)} placeholder="digital experiences" />
        <TextInput label="Headline (after highlight)" value={value.headlinePost} onChange={(next) => set('headlinePost', next)} placeholder="that matter." />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextArea label="Short bio" value={value.bioShort} onChange={(next) => set('bioShort', next)} hint="Shown under the headline in the hero" />
        <TextArea label="Full bio" value={value.bio} onChange={(next) => set('bio', next)} hint="Shown in the About card" />
      </div>

      <div className="mt-4">
        <ImageInput
          label="Profile photo"
          value={value.photo}
          onChange={(next) => set('photo', next)}
          hint="A initials placeholder is shown when empty."
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextInput label="Location" value={value.location} onChange={(next) => set('location', next)} placeholder="Dubai, UAE" />
        <TextInput label="Email" value={value.email} onChange={(next) => set('email', next)} placeholder="hello@example.com" />
        <TextInput label="Phone" value={value.phone} onChange={(next) => set('phone', next)} placeholder="+1 000 000 0000" />
        <TextInput label="Availability" value={value.availability} onChange={(next) => set('availability', next)} placeholder="Available for freelance & full-time" />
        <TextInput label="CV URL" value={value.cvUrl} onChange={(next) => set('cvUrl', next)} hint="Upload a PDF and use its /uploads/… URL, or point to a public file." />
        <TextInput label="Projects URL" value={value.projectsUrl} onChange={(next) => set('projectsUrl', next)} hint="Used by the “View All Projects” button." />
      </div>

      <div className="mt-8 border-t border-edge pt-6">
        <h2 className="font-display text-base font-semibold text-ink">Floating hero statistics</h2>
        <p className="mb-4 mt-1 text-xs text-slate-500">
          Shown as floating badges around your photo and in a row on mobile. The first three are displayed — add up to six.
        </p>
        <div className="space-y-3">
          {value.heroStats.map((stat, index) => (
            <ItemCard
              key={`${index}-${stat.label}`}
              title={stat.value || stat.label || 'New stat'}
              subtitle={`${stat.label} · ${stat.icon}`}
              onRemove={() =>
                setValue((current) => ({ ...current, heroStats: current.heroStats.filter((_, i) => i !== index) }))
              }
              onMoveUp={index > 0 ? () => moveInArray(value.heroStats, index, -1) : undefined}
              onMoveDown={index < value.heroStats.length - 1 ? () => moveInArray(value.heroStats, index, 1) : undefined}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectInput label="Icon" value={stat.icon} onChange={(next) => updateStat(index, 'icon', next)} options={statIcons} />
                <TextInput label="Value" value={stat.value} onChange={(next) => updateStat(index, 'value', next)} placeholder="4+" />
                <TextInput label="Label" value={stat.label} onChange={(next) => updateStat(index, 'label', next)} placeholder="Years of Experience" />
              </div>
            </ItemCard>
          ))}
        </div>
        <div className="mt-3">
          <AddButton
            label="Add stat"
            onClick={() =>
              setValue((current) => ({ ...current, heroStats: [...current.heroStats, emptyStat()] }))
            }
          />
        </div>
      </div>

      <div className="mt-8 border-t border-edge pt-6">
        <h2 className="font-display text-base font-semibold text-ink">Social links</h2>
        <p className="mb-4 mt-1 text-xs text-slate-500">
          Shown in the header menu on mobile, the hero, the footer and used for the SEO “sameAs” metadata.
        </p>
        <div className="space-y-3">
          {value.socialLinks.map((link, index) => (
            <ItemCard
              key={`${index}-${link.label}`}
              title={link.label || 'New link'}
              subtitle={link.url}
              onRemove={() =>
                setValue((current) => ({
                  ...current,
                  socialLinks: current.socialLinks.filter((_, i) => i !== index),
                }))
              }
              onMoveUp={index > 0 ? () => moveInArray(value.socialLinks, index, -1) : undefined}
              onMoveDown={index < value.socialLinks.length - 1 ? () => moveInArray(value.socialLinks, index, 1) : undefined}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Label" value={link.label} onChange={(next) => updateSocial(index, 'label', next)} placeholder="GitHub" />
                <TextInput label="URL" value={link.url} onChange={(next) => updateSocial(index, 'url', next)} placeholder="https://github.com/you" />
              </div>
            </ItemCard>
          ))}
        </div>
        <div className="mt-3">
          <AddButton
            label="Add link"
            onClick={() =>
              setValue((current) => ({ ...current, socialLinks: [...current.socialLinks, emptySocial()] }))
            }
          />
        </div>
      </div>

      <SaveBar onSave={() => void save()} saving={saving} saved={saved} error={error} />
    </div>
  )
}

function moveInArray<T>(array: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction
  if (target < 0 || target >= array.length) return array
  const next = [...array]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function ProfileEditorShell() {
  return (
    <EditorShell
      eyebrow="Content"
      title="Profile"
      description="Everything about you — what appears in the header, hero, about card, footer and SEO metadata."
    >
      <ProfileEditor />
    </EditorShell>
  )
}