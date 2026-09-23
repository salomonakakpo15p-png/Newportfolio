export interface FieldSpec {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'image'
  options?: string[]
  placeholder?: string
  hint?: string
}

export interface CollectionConfig {
  collection: 'skills' | 'stats' | 'process' | 'testimonials'
  title: string
  description: string
  itemName: string
  makeEmpty: () => Record<string, unknown>
  itemKey: (item: Record<string, unknown>) => string
  itemTitle: (item: Record<string, unknown>) => string
  itemSubtitle: (item: Record<string, unknown>) => string
  fields: FieldSpec[]
}

const processIconOptions = ['search', 'map', 'pen', 'code', 'shield', 'rocket']

export const skillConfig: CollectionConfig = {
  collection: 'skills',
  title: 'Skills',
  description: 'The skills shown in the "My Expertise" section. Level is a visual confidence indicator (0–100).',
  itemName: 'skill',
  makeEmpty: () => ({ name: '', level: 80 }),
  itemKey: (item) => String(item.name),
  itemTitle: (item) => String(item.name || 'New skill'),
  itemSubtitle: (item) => `Level ${item.level}%`,
  fields: [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'React / Next.js' },
    { key: 'level', label: 'Level', type: 'number', hint: '0–100' },
  ],
}

export const statsConfig: CollectionConfig = {
  collection: 'stats',
  title: 'Statistics',
  description: 'The counters in the "By The Numbers" section. The value is the number that counts up.',
  itemName: 'stat',
  makeEmpty: () => ({ value: 0, suffix: '+', label: '' }),
  itemKey: (item) => String(item.label),
  itemTitle: (item) => `${item.value}${item.suffix}`,
  itemSubtitle: (item) => String(item.label || 'New stat'),
  fields: [
    { key: 'value', label: 'Value', type: 'number' },
    { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+ · % · k' },
    { key: 'label', label: 'Label', type: 'text', placeholder: 'Happy Clients' },
  ],
}

export const processConfig: CollectionConfig = {
  collection: 'process',
  title: 'Work Process',
  description: 'The steps in the "My Work Process" timeline. Keep 4–6 steps for the best layout.',
  itemName: 'step',
  makeEmpty: () => ({ number: '07', icon: 'code', title: '', description: '' }),
  itemKey: (item) => String(item.number),
  itemTitle: (item) => `${item.number} · ${item.title || 'New step'}`,
  itemSubtitle: (item) => String(item.title || ''),
  fields: [
    { key: 'number', label: 'Number', type: 'text', placeholder: '01' },
    {
      key: 'icon',
      label: 'Icon',
      type: 'select',
      options: processIconOptions,
      hint: 'search · map · pen · code · shield · rocket',
    },
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Discover' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What happens in this step…' },
  ],
}

export const testimonialsConfig: CollectionConfig = {
  collection: 'testimonials',
  title: 'Testimonials',
  description: 'Quotes shown in the "What Clients Say" carousel.',
  itemName: 'testimonial',
  makeEmpty: () => ({
    id: `t-${Date.now()}`,
    name: '',
    role: '',
    company: '',
    quote: '',
    rating: 5,
    avatar: '',
  }),
  itemKey: (item) => String(item.id),
  itemTitle: (item) => String(item.name || 'New testimonial'),
  itemSubtitle: (item) => `${item.role}${item.company ? ` · ${item.company}` : ''}`,
  fields: [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Jane Cooper' },
    { key: 'role', label: 'Role', type: 'text', placeholder: 'Product Manager' },
    { key: 'company', label: 'Company', type: 'text', placeholder: 'ACME Inc.' },
    { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Working with…' },
    { key: 'rating', label: 'Rating', type: 'number', hint: '1–5' },
    { key: 'avatar', label: 'Avatar image', type: 'image', hint: 'Optional — a monogram is shown when empty' },
  ],
}

export const collectionConfigs: Record<string, CollectionConfig> = {
  skills: skillConfig,
  stats: statsConfig,
  process: processConfig,
  testimonials: testimonialsConfig,
}