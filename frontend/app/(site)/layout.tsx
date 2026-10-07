import type { ReactNode } from 'react'
import Script from 'next/script'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ChatWidget from '@/components/ui/ChatWidget'
import JsonLd from '@/components/ui/JsonLd'
import PageTransitionOverlay from '@/components/ui/PageTransitionOverlay'
import { ORGANIZATION_ID, SITE_NAME, SITE_URL } from '@/lib/seo'

// GA4 ve kurumsal @graph JSON-LD burada (root layout'ta değil) yaşar ki
// admin paneli ((panel) route group, ayrı bir layout kullanır) bu takip
// script'ini ve ProfessionalService şemasını hiç taşımasın (bkz. Faz 4 planı).
const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: 'New Temizlik - GES Temizlik ve Bakım Çözümleri',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      description: 'Soma merkezli, tüm Türkiye genelinde endüstriyel güneş paneli temizliği ve otonom yıkama robotu satışları.',
      telephone: '+905304738793',
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
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GES Sahası Ot Temizliği', url: `${SITE_URL}/hizmetlerimiz/ot-temizligi` } },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#cleaning-service`,
      name: 'Saf Su ile Endüstriyel Panel Yıkama',
      provider: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'New Temizlik',
      description: 'Soma merkezli, tüm Türkiye genelinde endüstriyel güneş paneli temizliği ve otonom yıkama robotu satışları.',
      publisher: { '@id': ORGANIZATION_ID },
      inLanguage: 'tr-TR',
    },
  ],
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageTransitionOverlay />
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
      <JsonLd data={organizationSchema} />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-TZDD4EVYEF" strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-TZDD4EVYEF');`}
      </Script>
      {/* Faz 5: Umami, GA4'ün yanında ikinci ve bağımsız bir analitik kaynağı —
          ikisi de kaldırılmadan bir süre paralel çalışacak. İki env değişkeni de
          yoksa script hiç yüklenmez (bkz. frontend/.env.example). */}
      {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
