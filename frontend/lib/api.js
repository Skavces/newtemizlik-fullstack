// Sunucu-taraflı fetch wrapper — NestJS backend'ine (bkz. ../backend) konuşur.
// Docker'da API_URL=http://backend:3001/api, lokal geliştirmede backend'i
// npm run start:dev ile ayrı çalıştırıp API_URL'i .env.local'de override et.
const API_URL = process.env.API_URL || 'http://localhost:3001/api'

async function apiFetch(path, { revalidate = 3600, tags } = {}) {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate, tags } })
  if (!res.ok) {
    const err = new Error(`API ${path} -> ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

// `next build` sırasında backend ayakta olmayabilir (bkz. Faz 3 planı): liste
// çağrıları build fazında hatayı yutup boş dizi döner ki build kırılmasın —
// deploy sonrası sweep (/revalidate, tags: ['all']) gerçek içeriği bastırır.
// Runtime'da yutulmaz: ISR arka plan tazelemesi başarısız olursa Next zaten
// eski cache'i servis etmeye devam eder.
async function withBuildFallback(fn) {
  try {
    return await fn()
  } catch (err) {
    if (process.env.NEXT_PHASE === 'phase-production-build') return []
    throw err
  }
}

export const getBlogPosts = () => withBuildFallback(() => apiFetch('/blog', { tags: ['blog'] }))
export const getBlogPost = (slug) => apiFetch(`/blog/${encodeURIComponent(slug)}`, { tags: ['blog'] })
export const getFaqs = (scope) => withBuildFallback(() => apiFetch(`/faq${scope ? `?scope=${encodeURIComponent(scope)}` : ''}`, { tags: ['faq'] }))
export const getReferences = () => withBuildFallback(() => apiFetch('/references', { tags: ['references'] }))
