import { Suspense, lazy, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router'
import {
  ArrowLeft,
  Feather,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Settings2,
  Star,
  User,
  Wrench,
} from 'lucide-react'
import { checkAdmin, login, logout } from '../../lib/api'
import { cn } from '../../lib/utils'
import { useAdminStore } from './content-store'
import { inputCls } from './fields'

const adminSections = import('./lazy-sections')

const ProfileEditorPage = lazy(() => adminSections.then((m) => ({ default: m.ProfilePage })))
const ProjectsEditorPage = lazy(() => adminSections.then((m) => ({ default: m.ProjectsPage })))
const SiteEditorPage = lazy(() => adminSections.then((m) => ({ default: m.SitePage })))
const SkillsEditorPage = lazy(() => adminSections.then((m) => ({ default: m.collectionPage('skills') })))
const StatsEditorPage = lazy(() => adminSections.then((m) => ({ default: m.collectionPage('stats') })))
const ProcessEditorPage = lazy(() => adminSections.then((m) => ({ default: m.collectionPage('process') })))
const TestimonialsEditorPage = lazy(() =>
  adminSections.then((m) => ({ default: m.collectionPage('testimonials') })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-500">
      <span className="inline-block size-6 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
    </div>
  )
}

function RequireAdmin() {
  const [checking, setChecking] = useState(true)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let active = true
    checkAdmin()
      .then((allowed) => {
        if (!active) return
        setOk(allowed)
        setChecking(false)
      })
      .catch(() => {
        if (!active) return
        setOk(false)
        setChecking(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void text-slate-500">
        <span className="inline-block size-6 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      </div>
    )
  }

  if (!ok) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

const sections = [
  { to: '', key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'profile', key: 'profile', label: 'Profile', icon: User },
  { to: 'projects', key: 'projects', label: 'Projects', icon: Feather },
  { to: 'skills', key: 'skills', label: 'Skills', icon: Gauge },
  { to: 'stats', key: 'stats', label: 'Statistics', icon: FileText },
  { to: 'process', key: 'process', label: 'Process', icon: Wrench },
  { to: 'testimonials', key: 'testimonials', label: 'Testimonials', icon: Star },
  { to: 'site', key: 'site', label: 'Site & SEO', icon: Settings2 },
]

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-void">
      <header className="glass-strong sticky top-0 z-40 border-b border-edge">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-cyan-bright font-display text-xs font-bold text-void">
              AT
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-ink">Portfolio Admin</p>
              <p className="text-[0.6875rem] text-slate-500">Content management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-card/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              View site
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-400/10"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
        <nav className="overflow-x-auto border-t border-edge" aria-label="Admin sections">
          <ul className="mx-auto flex max-w-6xl gap-1 px-4 py-2 sm:px-6">
            {sections.map((section) => (
              <li key={section.key}>
                <NavLink
                  to={`/admin/${section.to}`}
                  end={section.to === ''}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-cyan/10 text-cyan' : 'text-slate-400 hover:text-ink',
                    )
                  }
                >
                  <section.icon className="size-4" aria-hidden="true" />
                  {section.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

function DashboardPage() {
  const { content, loading } = useAdminStore()
  const profile = content.profile

  const counts: { label: string; value: number; to: string }[] = [
    { label: 'Skills', value: content.skills.length, to: '/admin/skills' },
    { label: 'Projects', value: content.projects.length, to: '/admin/projects' },
    { label: 'Testimonials', value: content.testimonials.length, to: '/admin/testimonials' },
    { label: 'Statistics', value: content.stats.length, to: '/admin/stats' },
    { label: 'Process steps', value: content.process.length, to: '/admin/process' },
    { label: 'Social links', value: profile.socialLinks.length, to: '/admin/profile' },
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Overview</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          {profile.name || 'Portfolio'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Manage everything that appears on the public site. Changes are published as soon as you save —
          no rebuild required if the server is running in production mode.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
          <span className="inline-block size-5 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
          Loading…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group rounded-2xl border border-edge bg-card/50 p-5 transition-colors duration-300 hover:border-cyan/40"
              >
                <p className="font-display text-3xl font-bold text-ink transition-colors group-hover:text-cyan">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-edge bg-card/50 p-5">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Info label="Email" value={profile.email} />
              <Info label="Location" value={profile.location} />
              <Info label="Role" value={profile.role} />
              <Info label="Availability" value={profile.availability} />
            </div>
            <div className="mt-4 border-t border-edge pt-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">SEO</p>
              <p className="mt-1 text-sm text-slate-300">{content.site.title}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-ink">{value || '—'}</p>
    </div>
  )
}

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Admin Login — Portfolio'
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      await login(username, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="relative w-full max-w-sm">
        <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-cyan/10 blur-[100px]" />
        <div className="relative glass-strong rounded-2xl border-edge p-8 shadow-card">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-cyan-bright font-display text-sm font-bold text-void">
            AT
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">Admin login</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your portfolio content.</p>

          <form onSubmit={(event) => void submit(event)} className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Username
              </span>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputCls}
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-cyan-bright px-5 py-2.5 text-sm font-semibold text-void shadow-glow-sm transition-transform duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Credentials are configured via <code>ADMIN_USER</code> / <code>ADMIN_PASSWORD</code> in the
            server <code>.env</code>.
          </p>
        </div>
      </div>
    </div>
  )
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfileEditorPage />} />
          <Route path="projects" element={<ProjectsEditorPage />} />
          <Route path="skills" element={<SkillsEditorPage />} />
          <Route path="stats" element={<StatsEditorPage />} />
          <Route path="process" element={<ProcessEditorPage />} />
          <Route path="testimonials" element={<TestimonialsEditorPage />} />
          <Route path="site" element={<SiteEditorPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}