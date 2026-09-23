import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { cn } from '../lib/utils'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormValues {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const initialValues: FormValues = { name: '', email: '', subject: '', message: '', website: '' }

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.'
  if (!values.subject.trim()) errors.subject = 'Please enter a subject.'
  if (!values.message.trim()) errors.message = 'Please enter your message.'
  else if (values.message.trim().length < 10) errors.message = 'Your message should be at least 10 characters.'
  return errors
}

const inputClasses =
  'w-full rounded-xl border border-edge bg-void/60 px-4 py-3 text-sm text-ink placeholder:text-slate-500 transition-colors duration-200 focus:border-cyan/50 focus:outline-none aria-[invalid=true]:border-red-400/70'

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const submittedAt = useRef(0)

  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact'

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (values.website.trim() !== '') return
    if (Date.now() - submittedAt.current < 5000) return
    submittedAt.current = Date.now()

    setStatus('submitting')
    setErrorMessage('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(data?.message ?? 'Something went wrong. Please try again later.')
      }
      setStatus('success')
      setValues(initialValues)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-edge bg-card/50 p-8 text-center"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-cyan/10 text-cyan">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">Message sent!</h3>
        <p className="max-w-xs text-sm text-slate-400">
          Thanks for reaching out — I'll get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-medium text-cyan underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink">
            Name <span className="text-cyan">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={handleChange('name')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder="Jane Cooper"
            className={inputClasses}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-xs text-red-400">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email <span className="text-cyan">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange('email')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder="jane@company.com"
            className={inputClasses}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-ink">
          Subject <span className="text-cyan">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          value={values.subject}
          onChange={handleChange('subject')}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          placeholder="Project enquiry"
          className={inputClasses}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-1.5 text-xs text-red-400">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">
          Message <span className="text-cyan">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={handleChange('message')}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="Tell me about your project..."
          className={cn(inputClasses, 'resize-y')}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={handleChange('website')}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-cyan-bright px-6 py-3 text-sm font-semibold text-void shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}