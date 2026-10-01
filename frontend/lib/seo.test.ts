import { describe, expect, it } from 'vitest'
import { buildMetadata, SITE_NAME } from './seo'

describe('buildMetadata', () => {
  it('varsayılan og görseli ve boyutlarını kullanır', () => {
    const meta = buildMetadata({ title: 'Başlık', description: 'Açıklama', canonical: '/test' })
    expect(meta.alternates).toEqual({ canonical: '/test' })
    expect(meta.openGraph?.images).toEqual([{ url: '/og.png', width: 1200, height: 630, alt: 'Başlık' }])
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
    expect(meta.openGraph?.type).toBe('article')
    expect(meta.keywords).toBe('ges, panel temizliği')
  })

  it('twitter kartı summary_large_image olarak sabitlenir ve görseli paylaşır', () => {
    const meta = buildMetadata({ title: 'Başlık', description: 'Açıklama', canonical: '/test', image: '/custom.png' })
    expect(meta.twitter?.card).toBe('summary_large_image')
    expect(meta.twitter?.images).toEqual(['/custom.png'])
  })
})
