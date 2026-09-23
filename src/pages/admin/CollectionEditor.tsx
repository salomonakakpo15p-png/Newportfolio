import type { ReactNode } from 'react'
import type { SiteData } from '../../lib/site-data'
import type { CollectionConfig } from './collection-configs'
import { useAdminEditor } from './fields-hooks'
import {
  AddButton,
  ItemCard,
  NumberInput,
  SaveBar,
  SelectInput,
  TextArea,
  TextInput,
} from './fields'
import { ImageInput } from './fields'

export function CollectionEditor({ config }: { config: CollectionConfig }) {
  const { loading, value, setValue, save, saving, saved, error } = useAdminEditor<
    Record<string, unknown>[]
  >(config.collection, (values: SiteData) =>
    structuredClone(values[config.collection] as unknown as Record<string, unknown>[]),
  )

  const updateItem = (index: number, key: string, next: unknown) => {
    setValue((current) => current.map((item, i) => (i === index ? { ...item, [key]: next } : item)))
  }

  const add = () => {
    setValue((current) => [...current, config.makeEmpty()])
  }

  const remove = (index: number) => {
    setValue((current) => current.filter((_, i) => i !== index))
  }

  const move = (index: number, direction: -1 | 1) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === value.length - 1)) return
    setValue((current) => {
      const next = [...current]
      ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
      return next
    })
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div>
      <div className="space-y-4">
        {value.map((item, index) => (
          <ItemCard
            key={config.itemKey(item) || `item-${index}`}
            title={config.itemTitle(item)}
            subtitle={config.itemSubtitle(item)}
            onRemove={() => remove(index)}
            onMoveUp={index > 0 ? () => move(index, -1) : undefined}
            onMoveDown={index < value.length - 1 ? () => move(index, 1) : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {config.fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === 'textarea' || (field.type === 'text' && !field.hint)
                      ? 'sm:col-span-2'
                      : ''
                  }
                >
                  {renderField({
                    field,
                    value: item[field.key],
                    onChange: (next) => updateItem(index, field.key, next),
                  })}
                </div>
              ))}
            </div>
          </ItemCard>
        ))}
      </div>

      <div className="mt-4">
        <AddButton onClick={add} label={`Add ${config.itemName}`} />
      </div>
      <SaveBar onSave={() => void save()} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
      <span className="inline-block size-5 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      Loading…
    </div>
  )
}

export function EditorShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  )
}

interface FieldRenderProps {
  field: import('./collection-configs').FieldSpec
  value: unknown
  onChange: (next: string | number) => void
}

function renderField({ field, value, onChange }: FieldRenderProps) {
  const val = (Array.isArray(value) ? [] : (value ?? '')) as string | number
  switch (field.type) {
    case 'textarea':
      return (
        <TextArea
          label={field.label}
          value={String(val)}
          onChange={onChange}
          placeholder={field.placeholder}
          hint={field.hint}
        />
      )
    case 'number':
      return (
        <NumberInput
          label={field.label}
          value={typeof val === 'number' ? val : Number(val) || 0}
          onChange={onChange}
          min={field.key === 'rating' ? 1 : 0}
          max={field.key === 'rating' ? 5 : 100}
          hint={field.hint}
        />
      )
    case 'select':
      return (
        <SelectInput
          label={field.label}
          value={String(val)}
          onChange={onChange}
          options={field.options ?? []}
          hint={field.hint}
        />
      )
    case 'image':
      return <ImageInput label={field.label} value={String(val)} onChange={onChange} hint={field.hint} />
    default:
      return (
        <TextInput
          label={field.label}
          value={String(val)}
          onChange={onChange}
          placeholder={field.placeholder}
          hint={field.hint}
        />
      )
  }
}