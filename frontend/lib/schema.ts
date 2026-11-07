import { ORGANIZATION_ID, SITE_URL } from './seo'

// JSON-LD yardımcıları — daha önce her hizmet sayfasında elle kopyalanan
// BreadcrumbList / Service blokları ve areaServed listeleri.
// (FAQPage için bkz. lib/seo.ts buildFaqSchema.)

type Place = { '@type': 'City' | 'AdministrativeArea' | 'Country'; name: string }

// GES hizmetleri: Soma merkezli, Türkiye geneli.
export const AREA_SERVED_GES: Place[] = [
  { '@type': 'City', name: 'Soma' },
  { '@type': 'City', name: 'Akhisar' },
  { '@type': 'City', name: 'Kırkağaç' },
  { '@type': 'AdministrativeArea', name: 'Manisa' },
  { '@type': 'AdministrativeArea', name: 'İzmir' },
  { '@type': 'AdministrativeArea', name: 'Balıkesir' },
  { '@type': 'AdministrativeArea', name: 'Kütahya' },
  { '@type': 'Country', name: 'Türkiye' },
]

// Temizlik hizmetleri: Soma ve Manisa çevresi (karar 2026-11-08).
export const AREA_SERVED_TEMIZLIK: Place[] = [
  { '@type': 'City', name: 'Soma' },
  { '@type': 'City', name: 'Kırkağaç' },
  { '@type': 'City', name: 'Akhisar' },
  { '@type': 'AdministrativeArea', name: 'Manisa' },
]

export interface BreadcrumbItem {
  name: string
  // Site-göreli yol ('/' ile başlar).
  path: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

// Hizmet sayfaları için standart 3 adımlı breadcrumb.
export function buildServiceBreadcrumb(name: string, path: string) {
  return buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
    { name, path },
  ])
}

export interface ServiceSchemaInput {
  name: string
  alternateName?: string[]
  description: string
  serviceType?: string
  path: string
  areaServed: Place[]
  offerCatalog?: { name: string; offers: string[] }
}

export function buildServiceSchema({ name, alternateName, description, serviceType, path, areaServed, offerCatalog }: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(alternateName?.length ? { alternateName } : {}),
    description,
    serviceType: serviceType ?? name,
    url: `${SITE_URL}${path}`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed,
    ...(offerCatalog
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: offerCatalog.name,
            itemListElement: offerCatalog.offers.map((offer) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: offer },
            })),
          },
        }
      : {}),
  }
}
