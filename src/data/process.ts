export interface ProcessStep {
  number: string
  icon: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    icon: 'search',
    title: 'Discover',
    description: 'Understanding goals, requirements and project scope.',
  },
  {
    number: '02',
    icon: 'map',
    title: 'Plan',
    description: 'Planning architecture, tech stack and roadmap.',
  },
  {
    number: '03',
    icon: 'pen',
    title: 'Design',
    description: 'Creating wireframes and beautiful UI/UX designs.',
  },
  {
    number: '04',
    icon: 'code',
    title: 'Develop',
    description: 'Writing clean, scalable and efficient code.',
  },
  {
    number: '05',
    icon: 'shield',
    title: 'Test',
    description: 'Testing bugs, performance and cross-browser compatibility.',
  },
  {
    number: '06',
    icon: 'rocket',
    title: 'Deploy',
    description: 'Deploying to production and ensuring a smooth launch.',
  },
]