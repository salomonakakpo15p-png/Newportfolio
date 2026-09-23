import type { ProcessStep } from '../data/process'
import type { Profile } from '../data/profile'
import type { Project } from '../data/projects'
import type { Skill } from '../data/skills'
import type { Stat } from '../data/stats'
import type { Testimonial } from '../data/testimonials'
import { profile as defaultProfile } from '../data/profile'
import { skills as defaultSkills } from '../data/skills'
import { projects as defaultProjects } from '../data/projects'
import { testimonials as defaultTestimonials } from '../data/testimonials'
import { stats as defaultStats } from '../data/stats'
import { processSteps as defaultProcess } from '../data/process'
import { site as defaultSite } from '../data/site'

export interface SiteConfig {
  title: string
  description: string
  url: string
  author: string
  ogImage: string
  locale: string
}

export interface SiteData {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  testimonials: Testimonial[]
  stats: Stat[]
  process: ProcessStep[]
  site: SiteConfig
}

export const defaultSiteData: SiteData = {
  profile: defaultProfile,
  skills: defaultSkills,
  projects: defaultProjects,
  testimonials: defaultTestimonials,
  stats: defaultStats,
  process: defaultProcess,
  site: defaultSite,
}

export function mergeContent(
  defaults: SiteData,
  server: Partial<SiteData> | null | undefined,
): SiteData {
  if (!server || typeof server !== 'object') return defaults
  return {
    profile:
      server.profile && typeof server.profile === 'object' && Object.keys(server.profile).length > 0
        ? { ...defaults.profile, ...server.profile }
        : defaults.profile,
    skills: Array.isArray(server.skills) ? server.skills : defaults.skills,
    projects: Array.isArray(server.projects) ? server.projects : defaults.projects,
    testimonials: Array.isArray(server.testimonials) ? server.testimonials : defaults.testimonials,
    stats: Array.isArray(server.stats) ? server.stats : defaults.stats,
    process: Array.isArray(server.process) ? server.process : defaults.process,
    site:
      server.site && typeof server.site === 'object' && Object.keys(server.site).length > 0
        ? { ...defaults.site, ...server.site }
        : defaults.site,
  }
}