import Hero from '@/components/sections/Hero'
import KirProblemleri from '@/components/sections/KirProblemleri'
import WhyUs from '@/components/sections/WhyUs'
import Process from '@/components/sections/Process'
import Referanslar from '@/components/sections/Referanslar'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getReferences } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Soma GES Temizliği | Güneş Paneli ve Solar Panel Yıkama | New Temizlik',
  description:
    'Soma ve Türkiye genelinde endüstriyel GES ve güneş paneli temizliği. Solar panel yıkama, bakım izleme ve otonom temizlik robotu ile verim kaybını önlüyoruz.',
  keywords: 'soma ges temizliği, güneş paneli temizliği, panel temizliği, ges temizliği, solar panel yıkama, türkiye geneli ges temizliği, manisa ges temizliği',
  canonical: '/',
  imageAlt: 'New Temizlik - GES ve güneş paneli temizlik hizmetleri logosu',
})

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Soma GES Otonom Panel Yıkama Robotu Saha Testi',
  description: 'Soma güneş enerji santralinde otonom panel yıkama robotunun sahada performans testi ve çalışma görüntüleri. New Temizlik GES temizlik robotu uygulaması.',
  thumbnailUrl: `${SITE_URL}/hero-poster.webp`,
  uploadDate: '2026-01-01',
  contentUrl: `${SITE_URL}/otonom-panel-yikama-robotu.mp4`,
  publisher: {
    '@type': 'Organization',
    name: 'New Temizlik',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'New Temizlik',
  description: 'Soma ve Türkiye genelinde profesyonel GES panel temizliği, güneş paneli yıkama, solar panel bakım ve otonom temizlik robotu hizmetleri.',
  url: SITE_URL,
  telephone: '+905304738793',
  image: `${SITE_URL}/logo.png`,
  logo: `${SITE_URL}/logo.png`,
  address: { '@type': 'PostalAddress', addressLocality: 'Soma', addressRegion: 'Manisa', addressCountry: 'TR' },
  geo: { '@type': 'GeoCoordinates', latitude: 39.185, longitude: 27.607 },
  areaServed: [
    { '@type': 'City', name: 'Soma' },
    { '@type': 'City', name: 'Akhisar' },
    { '@type': 'City', name: 'Kırkağaç' },
    { '@type': 'AdministrativeArea', name: 'Manisa' },
    { '@type': 'AdministrativeArea', name: 'İzmir' },
    { '@type': 'AdministrativeArea', name: 'Balıkesir' },
    { '@type': 'AdministrativeArea', name: 'Kütahya' },
    { '@type': 'Country', name: 'Türkiye' },
  ],
  sameAs: [
    'https://www.facebook.com/people/New-Temizlik-Hizmetleri/61564445445368/',
    'https://www.instagram.com/new_temizlikhizmetleri/',
  ],
  knowsAbout: [
    'GES Temizliği',
    'Güneş Paneli Temizliği',
    'Solar Panel Yıkama',
    'Panel Temizliği',
    'GES Bakım',
    'Otonom Panel Temizlik Robotu',
    'Fotovoltaik Panel Temizliği',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'GES Temizlik ve Bakım Hizmetleri',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GES Panel Temizliği', url: `${SITE_URL}/hizmetlerimiz/panel-temizlik` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GES Panel Bakımı', url: `${SITE_URL}/hizmetlerimiz/panel-bakim` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Otonom Temizlik Robotu Satışı', url: `${SITE_URL}/hizmetlerimiz/robot-satisi` } },
    ],
  },
}

export default async function HomePage() {
  const references = await getReferences()

  return (
    <>
      <JsonLd data={videoSchema} />
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <KirProblemleri />
      <WhyUs />
      <Process />
      <Referanslar references={references} />
    </>
  )
}
