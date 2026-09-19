import { Repository } from 'typeorm'
import { RESERVED_SLUGS } from './reserved-slugs'

// Kaynak: renel-enerji backend/src/projects/projects.service.ts toSlug()/uniqueSlug()
// — projects modülüyle birlikte atılmadan önce common/'a taşındı ki blog da
// admin başlık girince otomatik slug üretsin (blog'da bugüne kadar slug elle
// yazılıyordu).
export function toSlug(text: string, fallback = 'icerik'): string {
  if (!text) return fallback
  return (
    text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || fallback
  )
}

export async function uniqueSlug<T extends { slug: string }>(
  repo: Repository<T>,
  base: string,
): Promise<string> {
  const existing = await repo
    .createQueryBuilder('e')
    .select('e.slug')
    .where('e.slug = :base OR e.slug LIKE :pattern', { base, pattern: `${base}-%` })
    .getMany()

  // Rezerve slug'lar (örn. "admin") doluymuş gibi davranır; base doğal olarak
  // base-1'e kayar
  const slugs = new Set([...RESERVED_SLUGS, ...existing.map(e => e.slug)])
  if (!slugs.has(base)) return base
  let n = 1
  while (slugs.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}
