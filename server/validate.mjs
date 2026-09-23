const str = (value, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const num = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const bool = (value) => Boolean(value)

function sanitizeObject(obj, spec) {
  const out = {}
  for (const [key, fn] of Object.entries(spec)) {
    out[key] = fn(obj?.[key])
  }
  return out
}

function asArray(value, itemFn) {
  if (!Array.isArray(value)) throw new Error(`Expected an array, got ${typeof value}`)
  return value.map(itemFn)
}

export const validators = {
  profile(value) {
    return sanitizeObject(value, {
      name: (v) => str(v, 120) || 'SamDev',
      initials: (v) => str(v, 4) || 'AT',
      role: (v) => str(v, 120),
      badge: (v) => str(v, 80),
      headlinePre: (v) => str(v, 200),
      headlineHighlight: (v) => str(v, 200),
      headlinePost: (v) => str(v, 200),
      bioShort: (v) => str(v, 1000),
      bio: (v) => str(v, 4000),
      photo: (v) => str(v, 500),
      location: (v) => str(v, 160),
      email: (v) => str(v, 254),
      phone: (v) => str(v, 60),
      availability: (v) => str(v, 160),
      cvUrl: (v) => str(v, 500),
      projectsUrl: (v) => str(v, 500),
      heroStats: (v) =>
        asArray(v, (item) =>
          sanitizeObject(item, {
            icon: (x) => str(x, 40) || 'briefcase',
            value: (x) => str(x, 40),
            label: (x) => str(x, 120),
          }),
        ).slice(0, 6),
      socialLinks: (v) =>
        asArray(v, (item) =>
          sanitizeObject(item, {
            label: (x) => str(x, 60),
            url: (x) => str(x, 500),
          }),
        ).slice(0, 8),
    })
  },

  skills(value) {
    return asArray(value, (item) =>
      sanitizeObject(item, {
        name: (x) => str(x, 120),
        level: (x) => Math.min(100, Math.max(0, num(x))),
      }),
    ).slice(0, 30)
  },

  projects(value) {
    return asArray(value, (item) =>
      sanitizeObject(item, {
        id: (x) => str(x, 80) || `project-${Date.now()}`,
        title: (x) => str(x, 160),
        slug: (x) => str(x, 200),
        category: (x) => str(x, 120),
        description: (x) => str(x, 1000),
        image: (x) => str(x, 500),
        technologies: (x) =>
          Array.isArray(x) ? x.map((t) => str(t, 60)).filter(Boolean).slice(0, 12) : [],
        liveUrl: (x) => str(x, 500),
        githubUrl: (x) => str(x, 500),
        featured: (x) => bool(x),
        order: (x) => num(x),
      }),
    ).slice(0, 60)
  },

  testimonials(value) {
    return asArray(value, (item) =>
      sanitizeObject(item, {
        id: (x) => str(x, 80) || `t-${Date.now()}`,
        name: (x) => str(x, 120),
        role: (x) => str(x, 120),
        company: (x) => str(x, 120),
        quote: (x) => str(x, 2000),
        rating: (x) => Math.min(5, Math.max(1, Math.round(num(x)))),
        avatar: (x) => str(x, 500),
      }),
    ).slice(0, 30)
  },

  stats(value) {
    return asArray(value, (item) =>
      sanitizeObject(item, {
        value: (x) => num(x),
        suffix: (x) => str(x, 10),
        label: (x) => str(x, 120),
      }),
    ).slice(0, 12)
  },

  process(value) {
    return asArray(value, (item) =>
      sanitizeObject(item, {
        number: (x) => str(x, 10),
        icon: (x) => str(x, 40),
        title: (x) => str(x, 120),
        description: (x) => str(x, 1000),
      }),
    ).slice(0, 12)
  },

  site(value) {
    return sanitizeObject(value, {
      title: (v) => str(v, 200),
      description: (v) => str(v, 500),
      url: (v) => str(v, 300),
      ogImage: (v) => str(v, 300),
      author: (v) => str(v, 120),
      locale: (v) => str(v, 20),
    })
  },
}

export function validateCollection(name, value) {
  const validator = validators[name]
  if (!validator) throw new Error(`Unknown collection "${name}"`)
  return validator(value)
}