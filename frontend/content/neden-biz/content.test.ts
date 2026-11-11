import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getService } from '../../lib/services'
import { SERVICE_CONTENT } from '../hizmetler'
import { getNedenBizContent, NEDEN_BIZ_TEMIZLIK } from '.'
import type { NedenBizContent } from './types'

const WORDS_MIN = 400
const WORDS_MAX = 600
const EXPECTED_SLUGS = [
  'soma-merkezli-temizlik',
  'temizlik-saha-deneyimi',
  'malzeme-ekipman-bizden',
  'kapsam-bastan-belli',
  'programiniza-uygun-temizlik',
  'ozel-temizlik-teklifi',
]
// GES "Neden Biz" sayfalarının phone_click anahtarları (app/(site)/neden-biz/*/page.tsx).
const GES_TRACK_KEYS = ['su', 'izleme', 'bakim', 'kadro', 'isg', 'roi']

function visibleBlocks(c: NedenBizContent): string[] {
  return [
    c.heading,
    ...c.paragraphs,
    c.callout.title,
    c.callout.text,
    ...c.bullets,
    c.servicesTitle,
    ...(c.servicesLead ? [c.servicesLead] : []),
    ...c.faqs.flatMap((f) => [f.question, f.answer]),
    c.cta.title,
  ]
}

const wordCount = (c: NedenBizContent) => visibleBlocks(c).join(' ').split(/\s+/).filter(Boolean).length
const allText = (c: NedenBizContent) => [c.title, c.description, c.h1, ...visibleBlocks(c)].join(' ')

// Statik GES klasörleri (`[slug]` dinamik klasörü hariç): dinamik rota bunlarla çakışmamalı.
const gesFolders = readdirSync(join(__dirname, '../../app/(site)/neden-biz'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('['))
  .map((d) => d.name)

describe('temizlik neden-biz içerikleri', () => {
  it('6 kayıt var ve sıra WhyUs kartlarıyla aynı', () => {
    expect(NEDEN_BIZ_TEMIZLIK.map((c) => c.slug)).toEqual(EXPECTED_SLUGS)
  })

  it('slug\'lar benzersiz ve GES klasörleriyle çakışmıyor', () => {
    const slugs = NEDEN_BIZ_TEMIZLIK.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(gesFolders.length, 'GES klasörleri okunamadı').toBeGreaterThan(0)
    for (const slug of slugs) expect(gesFolders, slug).not.toContain(slug)
  })

  it('getNedenBizContent slug ile bulur, bilinmeyen slug için undefined döner', () => {
    for (const c of NEDEN_BIZ_TEMIZLIK) expect(getNedenBizContent(c.slug)).toBe(c)
    expect(getNedenBizContent('yok')).toBeUndefined()
  })

  it('trackKey benzersiz ve GES anahtarlarıyla çakışmıyor', () => {
    const keys = NEDEN_BIZ_TEMIZLIK.map((c) => c.trackKey)
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys) {
      expect(key, 'boş trackKey').toMatch(/^[a-z]+$/)
      expect(GES_TRACK_KEYS, key).not.toContain(key)
    }
  })

  it.each(NEDEN_BIZ_TEMIZLIK.map((c) => [c.slug, c] as const))('%s kurallara uyar', (_slug, c) => {
    expect(c.title.length, 'title').toBeLessThanOrEqual(60)
    expect(c.description.length, 'description').toBeLessThanOrEqual(155)
    expect(c.h1, 'h1').toContain('Soma')
    expect(c.crumb.trim().length, 'crumb boş').toBeGreaterThan(0)
    expect(c.crumb.length, 'crumb uzunluğu').toBeLessThanOrEqual(22)
    expect(c.faqs, 'SSS sayısı').toHaveLength(4)
    expect(c.bullets.length, 'madde sayısı').toBeGreaterThanOrEqual(4)
    expect(c.bullets.length, 'madde sayısı').toBeLessThanOrEqual(6)

    const words = wordCount(c)
    expect(words, `kelime sayısı ${words}`).toBeGreaterThanOrEqual(WORDS_MIN)
    expect(words, `kelime sayısı ${words}`).toBeLessThanOrEqual(WORDS_MAX)
  })

  it.each(NEDEN_BIZ_TEMIZLIK.map((c) => [c.slug, c] as const))('%s yasak ifade içermez', (_slug, c) => {
    const text = allText(c)
    // Ücretsiz keşif yalnızca GES için; halı yıkama hizmeti yok (halıfleks yalnızca vakumlanır).
    expect(text).not.toMatch(/ücretsiz\s+keşif/iu)
    expect(text).not.toMatch(/(^|[^\p{L}])halı(?!fleks)/iu)
    expect(text).not.toMatch(/garanti/iu)
    // Yalnızca GES için geçerli iddialar temizlik sayfalarına taşınmaz.
    expect(text).not.toMatch(/81\s*il/iu)
    expect(text).not.toMatch(/17\+/)
    expect(text).not.toMatch(/sigorta/iu)
    expect(text).not.toMatch(/sertifika/iu)
  })

  it.each(NEDEN_BIZ_TEMIZLIK.map((c) => [c.slug, c] as const))('%s yalnızca yayındaki temizlik hizmetlerine bağlanır', (_slug, c) => {
    expect(c.services.length, 'hizmet sayısı').toBeGreaterThanOrEqual(3)
    expect(c.services.length, 'hizmet sayısı').toBeLessThanOrEqual(4)
    expect(new Set(c.services).size, 'tekrarlı hizmet').toBe(c.services.length)
    for (const slug of c.services) {
      const service = getService(slug)
      expect(service, `${slug} yayında değil`).toBeDefined()
      expect(service?.category, slug).toBe('temizlik')
    }
  })

  it.each(NEDEN_BIZ_TEMIZLIK.map((c) => [c.slug, c] as const))('%s özel görseli geçerli ve hizmet kartlarında tekrarlanmaz', (_slug, c) => {
    if (!c.image) return
    expect(c.image.src, 'src').toMatch(/^\//)
    expect(c.image.alt.trim().length, 'alt boş').toBeGreaterThan(0)
    expect(existsSync(join(__dirname, '../../public', c.image.src)), `${c.image.src} public/ altında yok`).toBe(true)
    const serviceImages = c.services.map((s) => getService(s)?.image)
    expect(serviceImages, 'görsel hizmet kartlarından biriyle aynı').not.toContain(c.image.src)
    // Yüzü bulanık, hero'dan kaldırılmış eski görsel (hero-temizlik-v3.webp farklı dosya).
    expect(c.image.src, 'reddedilmiş eski hero görseli').not.toMatch(/hero-temizlik\.webp$/)
  })

  it('sayfalar arasında kopya paragraf yok', () => {
    const seen = new Map<string, string>()
    for (const c of NEDEN_BIZ_TEMIZLIK) {
      const blocks = [...c.paragraphs, c.callout.text, ...c.bullets, ...c.faqs.map((f) => f.answer)]
      for (const block of blocks) {
        expect(seen.get(block), `"${block}" hem ${seen.get(block)} hem ${c.slug} sayfasında`).toBeUndefined()
        seen.set(block, c.slug)
      }
    }
  })

  it('hizmet sayfalarından birebir kopyalanmış metin yok', () => {
    const hizmetBlocks = new Set<string>()
    for (const s of SERVICE_CONTENT) {
      const titled = [...s.process, ...s.notes, ...s.guide, ...s.forWhom, ...s.whyUs]
      for (const b of [
        ...s.intro,
        ...s.includes,
        s.includesNote,
        s.areaText,
        ...titled.map((t) => t.text),
        ...s.faqs.map((f) => f.answer),
        ...s.related.map((r) => r.desc),
      ]) {
        hizmetBlocks.add(b)
      }
    }
    for (const c of NEDEN_BIZ_TEMIZLIK) {
      const blocks = [...c.paragraphs, c.callout.text, ...c.bullets, ...c.faqs.map((f) => f.answer)]
      for (const block of blocks) expect(hizmetBlocks.has(block), `${c.slug}: "${block}" hizmet sayfasından kopya`).toBe(false)
    }
  })
})
