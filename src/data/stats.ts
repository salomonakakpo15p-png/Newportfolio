export interface Stat {
  value: number
  suffix: string
  label: string
}

export const stats: Stat[] = [
  { value: 20, suffix: '+', label: 'Happy Clients' },
  { value: 20, suffix: '+', label: 'Projects Completed' },
  { value: 2, suffix: '+', label: 'Years Experience' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
]