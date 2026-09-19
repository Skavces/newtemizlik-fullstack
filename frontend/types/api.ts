// Backend API tipleri — bkz. backend/src/*/entities/*.entity.ts ve dto/*.dto.ts.
// JSON üzerinden gelen şekiller entity'lerin TypeORM tipleriyle birebir aynı
// DEĞİL: Date alanları ISO string olarak, pg `numeric` kolonlar da string
// olarak gelir (driver davranışı) — kullanım yerinde Number() ile çevrilir.

export type FaqScope = 'genel' | 'panel-temizlik' | 'panel-bakim' | 'robot-satisi'

export const FAQ_SCOPES: FaqScope[] = ['genel', 'panel-temizlik', 'panel-bakim', 'robot-satisi']

export type QuoteStatus = 'new' | 'contacted' | 'won' | 'lost'

export type LogLevel = 'error' | 'warn'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  metaDescription: string | null
  content: string
  coverImage: string | null
  published: boolean
  publishedAt: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// GET /api/blog (public liste) yalnızca bu alt kümeyi döner — bkz. blog.controller.ts
export type BlogPostSummary = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt' | 'createdAt'
>

export interface Faq {
  id: string
  scope: FaqScope
  question: string
  answer: string
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Reference {
  id: string
  name: string
  logo: string | null
  // pg numeric(3,2) JSON'da string döner (ör. "1.00")
  scale: string
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface QuoteRequest {
  id: string
  // KVKK retention cron'u (12 ay) tarafından null'lanır — bkz. quote-retention.service.ts
  adSoyad: string | null
  telefon: string | null
  ePosta: string | null
  panelAdeti: number
  // pg numeric(8,2) JSON'da string döner (ör. "12.50")
  sahaMegavati: string
  suUlasimi: boolean
  kvkkConsent: boolean
  consentAt: string
  status: QuoteStatus
  createdAt: string
  updatedAt: string
}

export interface QuoteStats {
  total: number
  new: number
  contacted: number
  won: number
  lost: number
}

export interface AppLog {
  id: string
  level: LogLevel
  context: string | null
  message: string
  createdAt: string
}

export interface LogStats {
  total: number
  errors24h: number
  warns24h: number
}

// GET /api/quote/admin/all ve GET /api/logs/admin/all ortak sayfalama şekli:
// sabit 50'lik sayfa, backend `total`/`filteredTotal` döndürmez, yalnızca
// pageCount (ceil(filteredTotal/50), min 1). `stats` her zaman filtresiz/
// global sayılardır — bkz. src/common/pagination.ts.
export interface PagedMeta {
  page: number
  pageCount: number
}

export interface QuoteAdminListResponse extends PagedMeta {
  stats: QuoteStats
  requests: QuoteRequest[]
}

export interface LogAdminListResponse extends PagedMeta {
  stats: LogStats
  logs: AppLog[]
}

// ── Auth ──────────────────────────────────────────────────────────────────

export interface AuthMe {
  ok: true
  username: string
}

export type LoginResponse = { success: true } | { requires2fa: true; preAuthToken: string }

export interface TwoFaStatus {
  enabled: boolean
}

export interface TwoFaSetup {
  secret: string
  // data:image/png;base64,... — doğrudan <img src> olarak kullanılır
  qrCodeUrl: string
}

// ── Panel yazma (DTO) tipleri ────────────────────────────────────────────
// Backend `forbidNonWhitelisted: true` çalıştırıyor — bu şekillerin DIŞINDA
// hiçbir alan (id, createdAt, updatedAt, publishedAt gibi) gönderilmemeli,
// yoksa 400 döner. Kaynak: backend/src/*/dto/*.dto.ts.

export interface LoginDto {
  username: string
  password: string
  rememberMe?: boolean
}

export interface Verify2faDto {
  preAuthToken: string
  code: string
}

export interface ChangeCredentialsDto {
  currentPassword: string
  newUsername?: string
  newPassword?: string
  totpCode?: string
}

export interface ConfirmSetupDto {
  secret: string
  code: string
  currentCode?: string
}

export interface Remove2faDto {
  code: string
  currentPassword: string
}

export interface CreateBlogPostDto {
  title: string
  slug?: string
  excerpt?: string
  metaDescription?: string
  content?: string
  coverImage?: string
  published?: boolean
  sortOrder?: number
}

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>

export interface CreateFaqDto {
  scope: FaqScope
  question: string
  answer: string
  published?: boolean
  sortOrder?: number
}

export type UpdateFaqDto = Partial<CreateFaqDto>

export interface CreateReferenceDto {
  name: string
  logo?: string
  scale?: number
  published?: boolean
  sortOrder?: number
}

export type UpdateReferenceDto = Partial<CreateReferenceDto>

export interface ReorderDto {
  orderedIds: string[]
}

export interface UpdateQuoteStatusDto {
  status: QuoteStatus
}
