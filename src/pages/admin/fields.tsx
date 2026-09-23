import { CheckCircle2, ChevronDown, Download, Loader2, Trash2, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { uploadFile } from '../../lib/api'
import { cn } from '../../lib/utils'

export const inputCls =
  'w-full rounded-xl border border-edge bg-void/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-500 transition-colors duration-200 focus:border-cyan/50 focus:outline-none'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </Field>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, 'resize-y')}
      />
    </Field>
  )
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  hint,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputCls}
      />
    </Field>
  )
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputCls, 'appearance-none pr-9')}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-void">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </Field>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-cyan' : 'bg-slate-700',
        )}
      >
        <span
          className={cn(
            'inline-block size-4 transform rounded-full bg-void transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </label>
  )
}

export function ImageInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadFile(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3 rounded-xl border border-edge bg-void/60 p-3">
        {value ? (
          <img
            src={value}
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-lg border border-edge object-cover"
          />
        ) : (
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-edge text-slate-600">
            <X className="size-4" aria-hidden="true" />
          </span>
        )}
        <div className="grid min-w-0 flex-1 gap-1.5">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/uploads/… or any URL"
            className={cn(inputCls, 'px-3 py-1.5 text-xs')}
          />
          {value && (
            <span className="truncate text-[0.6875rem] text-slate-500">{value}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-edge bg-card px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-cyan/40 hover:text-cyan disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="size-3.5" aria-hidden="true" />
          )}
          Upload
        </button>
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          download
          aria-label="Download image"
          title="Download image"
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-edge bg-card px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-cyan/40 hover:text-cyan',
            !value && 'pointer-events-none opacity-40',
          )}
        >
          <Download className="size-3.5" aria-hidden="true" />
          Download
        </a>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </Field>
  )
}

export function SaveBar({
  onSave,
  saving,
  saved,
  error,
  onReset,
}: {
  onSave: () => void
  saving: boolean
  saved?: boolean
  error?: string
  onReset?: () => void
}) {
  return (
    <div className="sticky bottom-4 z-10 mt-8">
      <div className="glass-strong flex flex-wrap items-center gap-4 rounded-2xl border-edge px-4 py-3 shadow-card">
        <div className="min-w-0 flex-1">
          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-cyan">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Saved
            </p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!saved && !error && (
            <p className="text-sm text-slate-400">Changes are applied to the live site after saving.</p>
          )}
        </div>
        {onReset && !saved && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-ink"
          >
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-cyan-bright px-5 py-2.5 text-sm font-semibold text-void shadow-glow-sm transition-transform duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </div>
  )
}

export interface ItemCardProps {
  title: string
  subtitle?: string
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  children: ReactNode
}

export function ItemCard({ title, subtitle, onRemove, onMoveUp, onMoveDown, children }: ItemCardProps) {
  return (
    <div className="rounded-2xl border border-edge bg-card/50 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-semibold text-ink">{title}</h3>
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Move up"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-edge text-slate-400 transition-colors hover:border-cyan/40 hover:text-cyan disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Move down"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-edge text-slate-400 transition-colors hover:border-cyan/40 hover:text-cyan disabled:opacity-40"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete ${title}`}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-red-400/30 text-red-400 transition-colors hover:bg-red-400/10"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-edge px-4 py-3.5 text-sm font-medium text-slate-400 transition-colors hover:border-cyan/40 hover:text-cyan"
    >
      <span className="text-lg leading-none">+</span> {label}
    </button>
  )
}