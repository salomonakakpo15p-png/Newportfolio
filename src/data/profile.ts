import photo from '../assets/hero.png'

export interface SocialLink {
  label: string
  url: string
}

export interface FloatingStat {
  icon: string
  value: string
  label: string
}

export interface Profile {
  name: string
  initials: string
  role: string
  headlinePre: string
  headlineHighlight: string
  headlinePost: string
  badge: string
  bio: string
  bioShort: string
  photo: string
  location: string
  email: string
  phone: string
  availability: string
  cvUrl: string
  projectsUrl: string
  heroStats: FloatingStat[]
  socialLinks: SocialLink[]
}

export const profile: Profile = {
  name: 'SamDev',
  initials: 'SD',
  role: 'Full-Stack Developer',
  badge: 'Software Developer',
  headlinePre: 'Je crée',
  headlineHighlight: 'des expériences numériques',
  headlinePost: 'qui comptent.',
  bioShort:
    "I'm a full-stack developer focused on building modern, responsive and user-focused digital experiences. I turn complex problems into clean, scalable products.",
  bio: "I'm a full-stack developer focused on building modern, responsive and user-focused digital experiences. For over 4 years I've helped startups, agencies and product teams ship reliable web applications — from first wireframe to a smooth production launch. I care deeply about performance, accessibility and the details that make software feel effortless.",
  photo,
  location: 'Dubai, UAE',
  email: 'hello@abdullahtariq.dev',
  phone: '+971 50 000 0000',
  availability: 'Available for freelance & full-time',
  cvUrl: '/cv/SamDev-CV.pdf',
  projectsUrl: 'https://github.com/your-username?tab=repositories',
  heroStats: [
    { icon: 'briefcase', value: '2+', label: 'Years of Experience' },
    { icon: 'rocket', value: '20+', label: 'Projects Completed' },
    { icon: 'heart', value: '99%', label: 'Client Satisfaction' },
  ],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/your-username' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-username' },
    { label: 'Twitter / X', url: 'https://x.com/your-username' },
    { label: 'Email', url: 'mailto:hello@abdullahtariq.dev' },
  ],
}