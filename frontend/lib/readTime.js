// Blog şemasında readTime kolonu yok (eski sitede sabit, elle girilen bir
// değerdi) — backend'in döndürdüğü content/excerpt'ten kelime sayısına göre
// tahmini okuma süresi üretilir (~200 kelime/dk).
export function estimateReadTime(html) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
