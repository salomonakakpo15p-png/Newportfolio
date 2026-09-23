export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new ApiError('Cannot reach the API server. Is it running?  (npm run server)', 0)
  }
  const data = (await response.json().catch(() => null)) as { message?: string } | null
  if (!response.ok) {
    if (response.status === 502 || response.status === 504) {
      throw new ApiError(
        'The backend server is unreachable. Start it with `npm run server` (or `npm run dev:all`).',
        response.status,
      )
    }
    throw new ApiError(data?.message ?? `Request failed (${response.status})`, response.status)
  }
  return data as T
}

export function login(username: string, password: string) {
  return request<{ message: string }>('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export async function checkAdmin() {
  const response = await fetch('/api/admin/me')
  return response.ok
}

export function logout() {
  return request<{ message: string }>('/api/admin/logout', { method: 'POST' })
}

export function getAdminContent() {
  return request<Record<string, unknown>>('/api/admin/content')
}

export function saveCollection(name: string, value: unknown) {
  return request<{ message: string }>(`/api/admin/content/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Request': '1' },
    body: JSON.stringify({ value }),
  })
}

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'X-Admin-Request': '1' },
    body: form,
  })
  const data = (await response.json().catch(() => null)) as { url?: string; message?: string } | null
  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Upload failed', response.status)
  }
  if (!data?.url) throw new ApiError('Upload returned no URL', 500)
  return data.url
}