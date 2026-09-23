import sarah from '../assets/avatars/sarah.svg'
import omar from '../assets/avatars/omar.svg'
import elena from '../assets/avatars/elena.svg'

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  rating: number
  avatar: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Mitchell',
    role: 'Product Manager',
    company: 'Nexa Labs',
    quote:
      'Working with Abdullah felt like adding a senior engineer to our team overnight. He delivered a complex dashboard ahead of schedule and our users immediately noticed the difference in quality.',
    rating: 5,
    avatar: sarah,
  },
  {
    id: 't2',
    name: 'Omar Al-Rashid',
    role: 'Founder',
    company: 'ShopVista',
    quote:
      'Abdullah rebuilt our storefront and conversion jumped 40% in the first month. His attention to performance and detail is unmatched — I recommend him without hesitation.',
    rating: 5,
    avatar: omar,
  },
  {
    id: 't3',
    name: 'Elena Petrova',
    role: 'CTO',
    company: 'FinTrack',
    quote:
      'Clean code, clear communication and a genuine interest in the product outcomes. Abdullah is the kind of developer you want on every project.',
    rating: 5,
    avatar: elena,
  },
]