import { describe, expect, it } from 'vitest'
import { brandedTitle, buildMetadata, clampDescription, SITE_NAME } from './seo'

describe('buildMetadata', () => {
  it('varsayılan og görseli ve boyutlarını kullanır', () => {
    const meta = buildMetadata({ title: 'Başlık', description: 'Açıklama', canonical: '/test' })
    expect(meta.alternates).toEqual({ canonical: '/test' })
    expect(meta.openGraph?.images).toEqual([{ url: '/og.jpg', width: 1200, height: 630, alt: 'Başlık' }])
    expect(meta.openGraph?.siteName).toBe(SITE_NAME)
  })

  it('ogTitle verildiğinde openGraph/twitter başlığını override eder, <title> aynı kalır', () => {
    const meta = buildMetadata({ title: 'Sayfa Başlığı', description: 'Açıklama', canonical: '/test', ogTitle: 'Paylaşım Başlığı' })
    expect(meta.title).toBe('Sayfa Başlığı')
    expect(meta.openGraph?.title).toBe('Paylaşım Başlığı')
    expect(meta.twitter?.title).toBe('Paylaşım Başlığı')
  })

  it('imageAlt verilmezse title alt metni olarak kullanılır', () => {
    const meta = buildMetadata({ title: 'Başlık', description: 'Açıklama', canonical: '/test', image: '/custom.png' })
    expect(meta.openGraph?.images).toEqual([{ url: '/custom.png', width: 1200, height: 630, alt: 'Başlık' }])
  })

  it('type ve keywords verildiğinde openGraph.type ve keywords alanına yansır', () => {
    const meta = buildMetadata({
      title: 'Başlık',
      description: 'Açıklama',
      canonical: '/blog/yazi',
      type: 'article',
      keywords: 'ges, panel temizliği',
    })
    // openGraph/twitter alanları Next'in Metadata tipinde OG alt-türlerinin
    // (website/article/...) birleşimi olarak tanımlı; 'type'/'card' yalnızca
    // belirli alt-türlerde var olduğundan TS bunu union genelinde görmüyor —
    // buildMetadata'nın ürettiği gerçek nesnede ikisi de her zaman mevcut.
    expect((meta.openGraph as { type?: string } | null)?.type).toBe('article')
    expect(meta.keywords).toBe('ges, panel temizliği')
  })

  it('twitter kartı summary_large_image olarak sabitlenir ve görseli paylaşır', () => {
    const meta = buildMetadata({ title: 'Başlık', description: 'Açıklama', canonical: '/test', image: '/custom.png' })
    expect((meta.twitter as { card?: string } | null)?.card).toBe('summary_large_image')
    expect(meta.twitter?.images).toEqual(['/custom.png'])
  })
})

describe('brandedTitle', () => {
  it('sığıyorsa marka ekini ekler', () => {
    expect(brandedTitle('Kısa Başlık')).toBe('Kısa Başlık | New Temizlik')
  })

  it('60 karakteri aşacaksa ek olmadan döner', () => {
    const long = 'Güneş Paneli Temizliği Ne Zaman Yapılmalı? Mevsimlik Rehber'
    expect(brandedTitle(long)).toBe(long)
  })
})

describe('clampDescription', () => {
  it('155 karakter ve altını olduğu gibi bırakır', () => {
    const text = 'a'.repeat(155)
    expect(clampDescription(text)).toBe(text)
  })

  it('uzun metni son tam kelimede keser ve 155 karakteri aşmaz', () => {
    const text = 'GES panel temizliğinde otonom robot ile manuel temizlik arasındaki farklar, maliyet analizi ve hangi saha büyüklüğü için hangisinin doğru seçim olduğu anlatılıyor.'
    const out = clampDescription(text)
    expect(out.length).toBeLessThanOrEqual(155)
    expect(out.endsWith('…')).toBe(true)
    expect(text.startsWith(out.slice(0, -1))).toBe(true)
  })
})
