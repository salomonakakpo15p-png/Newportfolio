import { EditorShell, LoadingState } from './CollectionEditor'
import { ImageInput, SaveBar, TextArea, TextInput } from './fields'
import { useAdminEditor } from './fields-hooks'
import type { SiteData } from '../../lib/site-data'

export function SiteEditor() {
  const { loading, value, setValue, save, saving, saved, error } = useAdminEditor<SiteData['site']>(
    'site',
    (values) => structuredClone(values.site),
  )

  const set = (key: keyof SiteData['site'], next: string) => {
    setValue((current) => ({ ...current, [key]: next }))
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Site title" value={value.title} onChange={(next) => set('title', next)} hint="Browser tab title" />
        <TextInput label="Author" value={value.author} onChange={(next) => set('author', next)} />
        <TextInput label="Canonical URL" value={value.url} onChange={(next) => set('url', next)} hint="The production domain, without trailing slash" />
        <TextInput label="Locale" value={value.locale} onChange={(next) => set('locale', next)} placeholder="en_US" />
      </div>
      <div className="mt-4">
        <TextArea label="Description" value={value.description} onChange={(next) => set('description', next)} hint="Used for meta description and social sharing" />
      </div>
      <div className="mt-4">
        <ImageInput
          label="Social share image (OG)"
          value={value.ogImage}
          onChange={(next) => set('ogImage', next)}
          hint="Square image (1200×1200). A default og-image.png is committed in public/."
        />
      </div>

      <SaveBar onSave={() => void save()} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export function SiteEditorShell() {
  return (
    <EditorShell
      eyebrow="SEO"
      title="Site"
      description="Meta description, canonical URL and social sharing image used by search engines and link previews."
    >
      <SiteEditor />
    </EditorShell>
  )
}