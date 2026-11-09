import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
// Next'in redirects() eşleştirmesinde kullandığı kütüphanenin aynısı.
import { pathToRegexp } from 'next/dist/compiled/path-to-regexp'
import fixture from './__fixtures__/legacy-urls.json'
import { LEGACY_SERVICE_IDS, MIGRATED_BLOG_SLUGS, legacyRedirects } from './redirects.mjs'
import { PUBLISHED_SERVICES, SERVICES, servicePath } from './services'

const SITE_ROUTES_DIR = path.resolve(__dirname, '..', 'app', '(site)')
const rules = legacyRedirects()
const matchers = rules.map((r) => ({ ...r, re: pathToRegexp(r.source, [], {}) }))

// Next ilk eşleşen kuralı uygular.
function resolve(p: string): string | null {
  return matchers.find((m) => m.re.test(p))?.destination ?? null
}

// Hedefin yeni sitede gerçekten bir sayfa olduğunu kontrol eder.
function targetExists(dest: string): boolean {
  if (dest === '/') return true
  if (PUBLISHED_SERVICES.some((s) => servicePath(s) === dest)) return true
  const blog = dest.match(/^\/blog\/(.+)$/)
  if (blog) return MIGRATED_BLOG_SLUGS.includes(blog[1])
  return existsSync(path.join(SITE_ROUTES_DIR, dest.slice(1), 'page.tsx'))
}

describe('eski .com.tr yönlendirmeleri', () => {
  it('her kural 301 ve hedefte parametre yok (tek, sabit adres)', () => {
    for (const r of rules) {
      expect(r.statusCode, r.source).toBe(301)
      expect(r).not.toHaveProperty('permanent')
      expect(r.destination, r.source).not.toContain(':')
    }
  })

  it.each(fixture.urls.map((u) => [u.path, u.to] as const))('%s → %s', (p, to) => {
    expect(resolve(p)).toBe(to)
  })

  it('her hedef yeni sitede var olan bir sayfa', () => {
    for (const r of rules) expect(targetExists(r.destination), r.destination).toBe(true)
  })

  it('zincir yok: hiçbir hedef başka bir kurala takılmıyor', () => {
    for (const r of rules) expect(resolve(r.destination), r.destination).toBeNull()
  })

  it('yeni sitenin yayındaki sayfaları yönlendirmeye takılmıyor', () => {
    for (const s of PUBLISHED_SERVICES) expect(resolve(servicePath(s)), s.slug).toBeNull()
    for (const p of ['/', '/kurumsal', '/iletisim', '/sss', '/blog', '/blog/ges-hotspot-nedir', '/referanslarimiz', '/kvkk']) {
      expect(resolve(p), p).toBeNull()
    }
  })

  it('LEGACY_SERVICE_IDS ile services.ts legacyIds birebir aynı', () => {
    const fromServices = Object.fromEntries(
      SERVICES.flatMap((s) => (s.legacyIds ?? []).map((id) => [String(id), s.slug])),
    )
    expect(Object.fromEntries(Object.entries(LEGACY_SERVICE_IDS).map(([k, v]) => [String(k), v]))).toEqual(fromServices)
  })
})
