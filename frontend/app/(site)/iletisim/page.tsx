import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'İletişim | Ücretsiz GES Temizlik Keşfi | New Temizlik',
  description: 'New Temizlik ile iletişime geçin. Soma ve çevresindeki GES santralleriniz için ücretsiz keşif ve teklif almak üzere bizi arayın veya formu doldurun.',
  canonical: '/iletisim',
  imageAlt: 'New Temizlik - GES temizlik hizmetleri iletişim logosu',
})

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'İletişim', item: `${SITE_URL}/iletisim` },
  ],
}

// Not: eski sitede bu şema Pzt-Cum 08:00-18:00 diyordu ama görünen metin
// Pzt-Cmt 09:00-18:00 idi — ikisi çelişiyordu. Doğrusu görünen metin olarak
// onaylandı (bkz. plan), şema buna göre düzeltildi.
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'New Temizlik İletişim',
  url: `${SITE_URL}/iletisim`,
  description: 'New Temizlik GES temizlik ve bakım hizmetleri için iletişim sayfası. Ücretsiz saha keşfi ve teklif.',
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'New Temizlik',
    telephone: '+905304738793',
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Soma',
      addressRegion: 'Manisa',
      postalCode: '45500',
      addressCountry: 'TR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.185, longitude: 27.607 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  },
}

export default function IletisimPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={contactPageSchema} />

      <PageHero
        title="İletişim"
        image="solar-panel.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'İletişim' },
        ]}
      />

      <Contact />
    </>
  )
}
