'use client'

// Admin panelinin tek merkezî fetch sarmalayıcısı. lib/api.ts'ten (public
// site, sunucu tarafı, 3600sn cache) kasıtlı olarak ayrı: panel verisi
// client-side, cache'siz (`cache: 'no-store'` gereksiz — tarayıcı fetch'i
// zaten önbelleklemez) ve kimlik doğrulamalı (`credentials: 'include'`)
// çekilir. 401'i TEK yerde yakalayıp girişe yönlendirir — renel-enerji'de
// bu 8 sayfada elle tekrarlanıyordu (bkz. Faz 4 planı, keşif bulguları).
import { API_URL } from './apiClient'
import { ApiError } from './errors'
import type {
  AppLog,
  AuthMe,
  BlogPost,
  ChangeCredentialsDto,
  ConfirmSetupDto,
  CreateBlogPostDto,
  CreateFaqDto,
  CreateReferenceDto,
  DashMetricType,
  DashUnit,
  Faq,
  LogAdminListResponse,
  LoginDto,
  LoginResponse,
  LogLevel,
  QuoteAdminListResponse,
  QuoteStatus,
  Reference,
  Remove2faDto,
  TwoFaSetup,
  TwoFaStatus,
  UmamiMetric,
  UmamiPageviews,
  UmamiStats,
  UpdateBlogPostDto,
  UpdateFaqDto,
  UpdateReferenceDto,
  Verify2faDto,
} from '@/types/api'

const LOGIN_PATH = '/nt-panel/giris'

function toQuery(params: object): string {
  const entries = Object.entries(params as Record<string, string | number | undefined>).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== '',
  )
  if (entries.length === 0) return ''
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))
  return `?${qs.toString()}`
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object' && 'message' in body) {
    const m = (body as { message: unknown }).message
    if (typeof m === 'string') return m
    if (Array.isArray(m)) return m.join(', ')
  }
  return undefined
}

// DELETE'ler ve reorder 204/boş gövdeyle döner — res.json() bunlarda patlar.
async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

interface PanelFetchInit extends RequestInit {
  // Bazı guard'lı uçlarda 401, oturumun geçersizliğini değil bir iş kuralı
  // ihlalini (yanlış şifre, yanlış/süresi dolmuş TOTP kodu) taşır — bkz.
  // auth.service.ts: changeCredentials/confirm2faSetup/remove2fa kimlik
  // doğrulanmış bir istekte de 401 fırlatabiliyor. Bu uçlar merkezi
  // "401 → girişe at" davranışını atlar; hatayı forma bırakır.
  //
  // DİKKAT: skipAuthRedirect uç-bazlı, yanıt-bazlı DEĞİL — changeCredentials
  // gibi bir uçta oturum bu istek sırasında gerçekten düşmüşse (JwtAuthGuard
  // reddeder) bu bayrak o durumu da yanlışlıkla bastırırdı. Bu yüzden guard'ın
  // fırlattığı 401'ler backend'de ayrıca `code: 'SESSION_EXPIRED'` taşır (bkz.
  // jwt-auth.guard.ts) — aşağıda skipAuthRedirect'ten BAĞIMSIZ olarak bu koda
  // her zaman öncelik verilir, servis katmanının düz "yanlış şifre/TOTP"
  // 401'lerinde bu kod hiç olmaz.
  skipAuthRedirect?: boolean
}

function isSessionExpired(body: unknown): boolean {
  return typeof body === 'object' && body !== null && (body as { code?: unknown }).code === 'SESSION_EXPIRED'
}

async function panelFetch<T>(path: string, init: PanelFetchInit = {}): Promise<T> {
  const { skipAuthRedirect, ...fetchInit } = init
  const isFormData = fetchInit.body instanceof FormData
  const res = await fetch(`${API_URL}${path}`, {
    ...fetchInit,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...fetchInit.headers,
    },
  })

  if (!res.ok) {
    const body = await parseBody(res)
    const message = extractMessage(body) ?? `İstek başarısız (${res.status})`
    // Oturum düşmüşse (süre doldu, tokenVersion arttı, jti kara listede) tek
    // merkezden girişe at — çağıran sayfa 401'i ayrıca ele almak zorunda kalmaz.
    const shouldRedirect = res.status === 401 && (isSessionExpired(body) || !skipAuthRedirect)
    if (shouldRedirect && typeof window !== 'undefined' && !window.location.pathname.startsWith(LOGIN_PATH)) {
      window.location.href = LOGIN_PATH
    }
    throw new ApiError(message, res.status)
  }

  return (await parseBody(res)) as T
}

// ── Auth ──────────────────────────────────────────────────────────────────

export const login = (dto: LoginDto) => panelFetch<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(dto), skipAuthRedirect: true })
export const verify2fa = (dto: Verify2faDto) => panelFetch<{ success: true }>('/auth/2fa/verify', { method: 'POST', body: JSON.stringify(dto), skipAuthRedirect: true })
export const logout = () => panelFetch<{ ok: true }>('/auth/logout', { method: 'POST' })
export const getMe = () => panelFetch<AuthMe>('/auth/me')
export const changeCredentials = (dto: ChangeCredentialsDto) => panelFetch<{ ok: true }>('/auth/credentials', { method: 'PATCH', body: JSON.stringify(dto), skipAuthRedirect: true })
export const get2faStatus = () => panelFetch<TwoFaStatus>('/auth/2fa/status')
export const get2faSetup = () => panelFetch<TwoFaSetup>('/auth/2fa/setup')
export const confirm2faSetup = (dto: ConfirmSetupDto) => panelFetch<{ ok: true }>('/auth/2fa/setup/confirm', { method: 'POST', body: JSON.stringify(dto), skipAuthRedirect: true })
export const remove2fa = (dto: Remove2faDto) => panelFetch<{ ok: true }>('/auth/2fa/setup', { method: 'DELETE', body: JSON.stringify(dto), skipAuthRedirect: true })

// ── Blog ──────────────────────────────────────────────────────────────────

export const getAllBlogPostsAdmin = () => panelFetch<BlogPost[]>('/blog/admin/all')
export const createBlogPost = (dto: CreateBlogPostDto) => panelFetch<BlogPost>('/blog', { method: 'POST', body: JSON.stringify(dto) })
export const updateBlogPost = (id: string, dto: UpdateBlogPostDto) => panelFetch<BlogPost>(`/blog/${id}`, { method: 'PATCH', body: JSON.stringify(dto) })
export const deleteBlogPost = (id: string) => panelFetch<void>(`/blog/${id}`, { method: 'DELETE' })
export const reorderBlogPosts = (orderedIds: string[]) => panelFetch<void>('/blog/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) })

// ── FAQ ───────────────────────────────────────────────────────────────────

export const getAllFaqsAdmin = () => panelFetch<Faq[]>('/faq/admin/all')
export const createFaq = (dto: CreateFaqDto) => panelFetch<Faq>('/faq', { method: 'POST', body: JSON.stringify(dto) })
export const updateFaq = (id: string, dto: UpdateFaqDto) => panelFetch<Faq>(`/faq/${id}`, { method: 'PATCH', body: JSON.stringify(dto) })
export const deleteFaq = (id: string) => panelFetch<void>(`/faq/${id}`, { method: 'DELETE' })
export const reorderFaqs = (orderedIds: string[]) => panelFetch<void>('/faq/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) })

// ── Referanslar ───────────────────────────────────────────────────────────

export const getAllReferencesAdmin = () => panelFetch<Reference[]>('/references/admin/all')
export const createReference = (dto: CreateReferenceDto) => panelFetch<Reference>('/references', { method: 'POST', body: JSON.stringify(dto) })
export const updateReference = (id: string, dto: UpdateReferenceDto) => panelFetch<Reference>(`/references/${id}`, { method: 'PATCH', body: JSON.stringify(dto) })
export const deleteReference = (id: string) => panelFetch<void>(`/references/${id}`, { method: 'DELETE' })
export const reorderReferences = (orderedIds: string[]) => panelFetch<void>('/references/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) })

// ── Teklif talepleri ──────────────────────────────────────────────────────

export interface QuoteAdminListParams {
  page?: number
  status?: QuoteStatus
  from?: string
  to?: string
}

export const getQuoteAdminList = (params: QuoteAdminListParams = {}) =>
  panelFetch<QuoteAdminListResponse>(`/quote/admin/all${toQuery(params)}`)
export const updateQuoteStatus = (id: string, status: QuoteStatus) =>
  panelFetch<import('@/types/api').QuoteRequest>(`/quote/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const deleteQuoteRequest = (id: string) => panelFetch<void>(`/quote/admin/${id}`, { method: 'DELETE' })

// ── Loglar ────────────────────────────────────────────────────────────────

export interface LogAdminListParams {
  level?: LogLevel
  page?: number
  from?: string
  to?: string
}

export const getLogAdminList = (params: LogAdminListParams = {}) =>
  panelFetch<LogAdminListResponse>(`/logs/admin/all${toQuery(params)}`)

// ── Analitik ──────────────────────────────────────────────────────────────
// bkz. backend/src/analytics/analytics.controller.ts (/api/dash/*). Umami
// henüz bağlanmadıysa (UMAMI_WEBSITE_ID boş) uçlar 200 + boş gövde döner —
// bu bir hata değil, Analitik sayfası bunu ayrı bir boş durum olarak gösterir.

export interface DashRangeParams {
  startAt: number
  endAt: number
}

export const getDashStats = (params: DashRangeParams) =>
  panelFetch<UmamiStats>(`/dash/stats${toQuery(params)}`)

export const getDashPageviews = (params: DashRangeParams & { unit?: DashUnit }) =>
  panelFetch<UmamiPageviews>(`/dash/pageviews${toQuery(params)}`)

export const getDashPages = (params: DashRangeParams) =>
  panelFetch<UmamiMetric[]>(`/dash/pages${toQuery(params)}`)

export const getDashMetrics = (params: DashRangeParams & { type: DashMetricType }) =>
  panelFetch<UmamiMetric[]>(`/dash/metrics${toQuery(params)}`)

// ── Upload ────────────────────────────────────────────────────────────────
// Content-Type elle set edilmez — multipart boundary'yi tarayıcı yazar.

export const uploadBlogCover = (postId: string, file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return panelFetch<BlogPost>(`/upload/blog/${postId}/cover`, { method: 'POST', body: fd })
}

export const uploadBlogContentImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return panelFetch<{ url: string }>('/upload/blog/content-image', { method: 'POST', body: fd })
}

export const uploadReferenceLogo = (referenceId: string, file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return panelFetch<Reference>(`/upload/references/${referenceId}/logo`, { method: 'POST', body: fd })
}
