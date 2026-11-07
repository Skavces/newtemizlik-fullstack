import { describe, expect, it } from 'vitest'
import { AREA_SERVED_GES, buildBreadcrumbSchema, buildServiceBreadcrumb, buildServiceSchema } from './schema'
import { ORGANIZATION_ID, SITE_URL } from './seo'

describe('buildBreadcrumbSchema', () => {
  it('sıralı ListItem\'lar ve SITE_URL ile mutlak URL üretir', () => {
    expect(buildBreadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
    ])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      ],
    })
  })

  it('buildServiceBreadcrumb standart 3 adımı üretir', () => {
    const crumb = buildServiceBreadcrumb('Ev Temizliği', '/hizmetlerimiz/ev-temizligi')
    expect(crumb.itemListElement.map((i) => i.name)).toEqual(['Ana Sayfa', 'Hizmetlerimiz', 'Ev Temizliği'])
    expect(crumb.itemListElement[2].item).toBe(`${SITE_URL}/hizmetlerimiz/ev-temizligi`)
  })
})

describe('buildServiceSchema', () => {
  it('provider\'ı organizasyona bağlar, serviceType varsayılan olarak name olur, katalog Offer\'lara dönüşür', () => {
    const schema = buildServiceSchema({
      name: 'GES Panel Temizliği',
      alternateName: ['Solar Panel Yıkama'],
      description: 'Açıklama',
      path: '/hizmetlerimiz/panel-temizlik',
      areaServed: AREA_SERVED_GES,
      offerCatalog: { name: 'Katalog', offers: ['A', 'B'] },
    })
    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'GES Panel Temizliği',
      alternateName: ['Solar Panel Yıkama'],
      description: 'Açıklama',
      serviceType: 'GES Panel Temizliği',
      url: `${SITE_URL}/hizmetlerimiz/panel-temizlik`,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: AREA_SERVED_GES,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Katalog',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'B' } },
        ],
      },
    })
  })

  it('alternateName ve katalog verilmezse alanları hiç basmaz', () => {
    const schema = buildServiceSchema({ name: 'X', description: 'Y', path: '/x', areaServed: [] })
    expect(schema).not.toHaveProperty('alternateName')
    expect(schema).not.toHaveProperty('hasOfferCatalog')
  })
})
