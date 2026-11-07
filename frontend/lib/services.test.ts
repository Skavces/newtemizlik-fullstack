import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getService, getServicesByCategory, getTemplateServices, PUBLISHED_SERVICES, SERVICE_CATEGORIES, SERVICES, servicePath } from './services'

const FRONTEND_ROOT = path.resolve(__dirname, '..')
const SERVICES_ROUTE_DIR = path.join(FRONTEND_ROOT, 'app', '(site)', 'hizmetlerimiz')

// hizmetlerimiz/ altındaki elle yazılmış (statik) route klasörleri — [slug] gibi
// dinamik segmentler hariç.
const staticRouteDirs = readdirSync(SERVICES_ROUTE_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('['))
  .map((d) => d.name)

describe('SERVICES kayıtları', () => {
  it('slug\'lar benzersiz, URL güvenli ve ≤30 karakter', () => {
    const slugs = SERVICES.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug, slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(slug.length, slug).toBeLessThanOrEqual(30)
    }
  })

  it('her kaydın tanımlı bir kategorisi ve adı var', () => {
    for (const s of SERVICES) {
      expect(Object.keys(SERVICE_CATEGORIES), s.slug).toContain(s.category)
      expect(s.name.trim(), s.slug).not.toBe('')
    }
  })

  it('yayındaki her hizmetin özeti, alt metni ve public/ altında gerçekten var olan görseli var', () => {
    for (const s of PUBLISHED_SERVICES) {
      expect(s.summary.trim(), `${s.slug} summary`).not.toBe('')
      expect(s.imageAlt.trim(), `${s.slug} imageAlt`).not.toBe('')
      expect(s.image.startsWith('/'), `${s.slug} image '/' ile başlamalı`).toBe(true)
      expect(existsSync(path.join(FRONTEND_ROOT, 'public', s.image)), `${s.slug} görseli yok: ${s.image}`).toBe(true)
    }
  })

  it('eski site ID\'leri (legacyIds) iki hizmete birden atanmamış', () => {
    const ids = SERVICES.flatMap((s) => s.legacyIds ?? [])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('customPage=true olan her hizmetin kendi route klasörü var, olmayanların yok', () => {
    for (const s of SERVICES) {
      if (s.customPage) expect(staticRouteDirs, `${s.slug} için app/(site)/hizmetlerimiz/${s.slug}/ yok`).toContain(s.slug)
      else expect(staticRouteDirs, `${s.slug} şablondan üretilmeli, statik klasörü olmamalı`).not.toContain(s.slug)
    }
  })

  it('hizmetlerimiz/ altındaki her statik klasör services.ts\'te kayıtlı (listelerden kaçan sayfa yok)', () => {
    const slugs = SERVICES.map((s) => s.slug)
    for (const dir of staticRouteDirs) expect(slugs, `${dir} services.ts'te yok`).toContain(dir)
  })
})

describe('yardımcılar', () => {
  it('getService yalnızca yayındaki hizmeti döndürür', () => {
    expect(getService('panel-temizlik')?.name).toBe('Panel Temizlik Hizmeti')
    const unpublished = SERVICES.find((s) => !s.published)
    if (unpublished) expect(getService(unpublished.slug)).toBeUndefined()
    expect(getService('yok-boyle-bir-hizmet')).toBeUndefined()
  })

  it('getServicesByCategory yalnızca o kategorinin yayındaki hizmetlerini, kayıt sırasıyla döndürür', () => {
    const ges = getServicesByCategory('ges')
    expect(ges.map((s) => s.slug)).toEqual(['panel-temizlik', 'panel-bakim', 'robot-satisi', 'ot-temizligi'])
    expect(ges.every((s) => s.published && s.category === 'ges')).toBe(true)
  })

  it('getTemplateServices özel sayfası olan hizmetleri içermez', () => {
    expect(getTemplateServices().every((s) => !s.customPage && s.published)).toBe(true)
  })

  it('servicePath /hizmetlerimiz/<slug> üretir', () => {
    expect(servicePath({ slug: 'ev-temizligi' })).toBe('/hizmetlerimiz/ev-temizligi')
  })
})
