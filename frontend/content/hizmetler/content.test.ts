import { describe, expect, it } from 'vitest'
import { getService, getTemplateServices, SERVICES } from '../../lib/services'
import { getServiceContent, SERVICE_CONTENT } from '.'
import type { ServiceContent } from './types'

const WORDS_MIN = 900
const WORDS_MAX = 1200

function visibleBlocks(c: ServiceContent): string[] {
  const titled = [...c.process, ...c.notes, ...c.guide, ...c.forWhom, ...c.whyUs]
  return [
    c.heading,
    ...c.intro,
    c.includesTitle,
    ...c.includes,
    c.includesNote,
    c.processTitle,
    c.notesTitle,
    c.guideTitle,
    c.forWhomTitle,
    c.whyUsTitle,
    ...titled.flatMap((t) => [t.title, t.text]),
    c.areaText,
    ...c.faqs.flatMap((f) => [f.question, f.answer]),
  ]
}

const wordCount = (c: ServiceContent) => visibleBlocks(c).join(' ').split(/\s+/).filter(Boolean).length
const allText = (c: ServiceContent) => [c.title, c.description, c.h1, ...visibleBlocks(c), ...c.related.map((r) => r.desc)].join(' ')

describe('temizlik hizmet içerikleri', () => {
  it('yayındaki her şablon hizmetinin içeriği var', () => {
    for (const s of getTemplateServices()) expect(getServiceContent(s.slug), s.slug).toBeDefined()
  })

  it.each(SERVICE_CONTENT.map((c) => [c.slug, c] as const))('%s kurallara uyar', (slug, c) => {
    const service = SERVICES.find((s) => s.slug === slug)
    expect(service, 'services.ts kaydı').toBeDefined()
    expect(c.title.length, 'title').toBeLessThanOrEqual(60)
    expect(c.description.length, 'description').toBeLessThanOrEqual(155)
    // Şehir adı H1 ve title'da, eski anahtar kelime H1'de aynen.
    expect(c.h1, 'h1').toContain('Soma')
    expect(c.title.startsWith(c.h1), 'title h1 ile başlar').toBe(true)

    const words = wordCount(c)
    expect(words, `kelime sayısı ${words}`).toBeGreaterThanOrEqual(WORDS_MIN)
    expect(words, `kelime sayısı ${words}`).toBeLessThanOrEqual(WORDS_MAX)
  })

  it.each(SERVICE_CONTENT.map((c) => [c.slug, c] as const))('%s yasak ifade içermez', (_slug, c) => {
    const text = allText(c)
    // Ücretsiz keşif yalnızca GES için; halı yıkama hizmeti yok.
    expect(text).not.toMatch(/ücretsiz\s+keşif/iu)
    expect(text).not.toMatch(/(^|[^\p{L}])halı/iu)
    expect(text).not.toMatch(/garanti/iu)
  })

  it.each(SERVICE_CONTENT.map((c) => [c.slug, c] as const))('%s yalnızca yayındaki hizmetlere bağlanır (3 aynı kategori + 1 çapraz)', (_slug, c) => {
    const related = c.related.map((r) => getService(r.slug))
    expect(related.every(Boolean), 'yayında olmayan bağlantı').toBe(true)
    expect(related.filter((s) => s?.category === 'temizlik')).toHaveLength(3)
    expect(related.filter((s) => s?.category === 'ges')).toHaveLength(1)
  })

  it('sayfalar arasında kopya paragraf yok', () => {
    const seen = new Map<string, string>()
    for (const c of SERVICE_CONTENT) {
      const blocks = [...c.intro, ...c.includes, c.includesNote, ...c.process, ...c.notes, ...c.guide, ...c.forWhom, ...c.faqs].map((b) =>
        typeof b === 'string' ? b : 'text' in b ? b.text : b.answer,
      )
      for (const block of blocks) {
        expect(seen.get(block), `"${block}" hem ${seen.get(block)} hem ${c.slug} sayfasında`).toBeUndefined()
        seen.set(block, c.slug)
      }
    }
  })

  // Kullanıcı kuralı: onaysız iddia canlıya çıkmaz. Onay gelince liste boşaltılır.
  it.each(getTemplateServices().map((s) => [s.slug] as const))('%s için onay bekleyen iddia kalmadı', (slug) => {
    expect(getServiceContent(slug)?.pendingClaims).toEqual([])
  })
})
