import fintrack from '../assets/projects/fintrack.svg'
import shopvista from '../assets/projects/shopvista.svg'
import taskify from '../assets/projects/taskify.svg'

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  order: number
}

export const projects: Project[] = [
  {
    id: 'fintrack-dashboard',
    title: 'FinTrack Dashboard',
    slug: 'FinTrack Dashboard',
    category: 'SaaS · Finance',
    description:
      'A real-time finance dashboard with interactive charts, budget tracking and role-based access control for small teams.',
    image: fintrack,
    technologies: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/your-username/fintrack',
    featured: true,
    order: 1,
  },
  {
    id: 'shopvista-ecommerce',
    title: 'ShopVista E-commerce',
    slug: 'ShopVista E-commerce',
    category: 'E-commerce',
    description:
      'A headless e-commerce storefront with cart, checkout and Stripe payments — built for speed and conversion.',
    image: shopvista,
    technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/your-username/shopvista',
    featured: true,
    order: 2,
  },
  {
    id: 'taskify-ai',
    title: 'Taskify AI',
    slug: 'Taskify AI',
    category: 'AI · Productivity',
    description:
      'An AI-powered task manager that understands natural language input and auto-generates prioritized action plans.',
    image: taskify,
    technologies: ['React', 'OpenAI', 'Express', 'MongoDB'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/your-username/taskify',
    featured: true,
    order: 3,
  },
]