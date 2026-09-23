import { useEffect } from 'react'
import { useSiteData } from '../lib/content-store'

export function Seo() {
  const data = useSiteData()
  const { profile, site } = data

  useEffect(() => {
    if (!profile || !site) return
    const socials: Record<string, string> = {}
    for (const link of profile.socialLinks) {
      const key = link.label.toLowerCase()
      if (key.includes('github')) socials.sameAs = link.url
      if (key.includes('linkedin')) socials.linkedIn = link.url
      if (key.includes('twitter') || key.includes('x')) socials.x = link.url
    }

    document.title = `${profile.name} — ${profile.role}`

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.bioShort,
      email: profile.email,
      url: site.url,
      image: `${site.url}${profile.photo}`,
      address: { '@type': 'PostalAddress', addressLocality: profile.location },
      knowsAbout: [],
      ...(socials.sameAs
        ? {
            sameAs: [socials.sameAs, socials.linkedIn, socials.x].filter(
              (value): value is string => Boolean(value),
            ),
          }
        : {}),
    }

    let script = document.head.querySelector<HTMLScriptElement>('#person-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'person-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)

    setMeta('name', 'description', site.description)
    setMeta('property', 'og:title', `${profile.name} — ${profile.role}`)
    setMeta('property', 'og:description', site.description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', site.url)
    setMeta('property', 'og:image', `${site.url}${site.ogImage}`)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', `${profile.name} — ${profile.role}`)
    setMeta('name', 'twitter:description', site.description)
    setMeta('name', 'twitter:image', `${site.url}${site.ogImage}`)

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', site.url)
  }, [profile, site])

  return null
}