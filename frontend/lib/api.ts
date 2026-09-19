// Sunucu-taraflı fetch wrapper — NestJS backend'ine (bkz. ../backend) konuşur.
// Docker'da API_URL=http://backend:3001/api, lokal geliştirmede backend'i
// npm run start:dev ile ayrı çalıştırıp API_URL'i .env.local'de override et.
import { ApiError } from './errors'
import type { BlogPost, BlogPostSummary, Faq, FaqScope, Reference } from '@/types/api'

// export: app/nt-panel/(korumali)/layout.tsx'in sunucu tarafı oturum
// kontrolü (GET /auth/me) de aynı iç adresi kullanır.
export const API_URL = process.env.API_URL || 'http://localhost:3001/api'

interface ApiFetchOptions {
  revalidate?: number
  tags?: string[]
}

async function apiFetch<T>(path: string, { revalidate = 3600, tags }: ApiFetchOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate, tags } })
  if (!res.ok) {
    throw new ApiError(`API ${path} -> ${res.status}`, res.status)
  }
  return res.json() as Promise<T>
}

// `next build` sırasında backend ayakta olmayabilir (bkz. Faz 3 planı): liste
// çağrıları build fazında hatayı yutup boş dizi döner ki build kırılmasın —
// deploy sonrası sweep (/revalidate, tags: ['all']) gerçek içeriği bastırır.
// Runtime'da yutulmaz: ISR arka plan tazelemesi başarısız olursa Next zaten
// eski cache'i servis etmeye devam eder.
async function withBuildFallback<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn()
  } catch (err) {
    if (process.env.NEXT_PHASE === 'phase-production-build') return []
    throw err
  }
}

export const getBlogPosts = (): Promise<BlogPostSummary[]> =>
  withBuildFallback(() => apiFetch<BlogPostSummary[]>('/blog', { tags: ['blog'] }))

export const getBlogPost = (slug: string): Promise<BlogPost> =>
  apiFetch<BlogPost>(`/blog/${encodeURIComponent(slug)}`, { tags: ['blog'] })

export const getFaqs = (scope?: FaqScope): Promise<Faq[]> =>
  withBuildFallback(() =>
    apiFetch<Faq[]>(`/faq${scope ? `?scope=${encodeURIComponent(scope)}` : ''}`, { tags: ['faq'] }),
  )

export const getReferences = (): Promise<Reference[]> =>
  withBuildFallback(() => apiFetch<Reference[]>('/references', { tags: ['references'] }))
