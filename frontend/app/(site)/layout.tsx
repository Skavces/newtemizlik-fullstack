import type { ReactNode } from 'react'
import Script from 'next/script'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import JsonLd from '@/components/ui/JsonLd'
import { SITE_URL } from '@/lib/seo'

// GA4 ve kurumsal @graph JSON-LD burada (root layout'ta değil) yaşar ki
// admin paneli ((panel) route group, ayrı bir layout kullanır) bu takip
// script'ini ve ProfessionalService şemasını hiç taşımasın (bkz. Faz 4 planı).
const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#organization`,
      name: 'New Temizlik - GES Temizlik ve Bakım Çözümleri',
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      description: 'Soma merkezli, tüm Türkiye genelinde endüstriyel güneş paneli temizliği ve otonom yıkama robotu satışları.',
      areaServed: [
        { '@type': 'City', name: 'Soma' },
        { '@type': 'AdministrativeArea', name: 'Manisa' },
        { '@type': 'Country', name: 'Türkiye' },
      ],
      telephone: '+905304738793',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Soma',
        addressRegion: 'Manisa',
        addressCountry: 'TR',
      },
    },
    {
      '@type': 'Product',
      '@id': `${SITE_URL}/#robot`,
      name: 'Otonom GES Temizlik Robotu',
      image: `${SITE_URL}/soma-ges-otonom-temizlik-robotu.jpeg`,
      description: 'Büyük ölçekli güneş enerji santralleri için insansız, yapay zeka destekli profesyonel panel yıkama makinesi.',
      category: 'Industrial Equipment',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'TRY',
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#cleaning-service`,
      name: 'Saf Su ile Endüstriyel Panel Yıkama',
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'New Temizlik',
      description: 'Soma merkezli, tüm Türkiye genelinde endüstriyel güneş paneli temizliği ve otonom yıkama robotu satışları.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'tr-TR',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <JsonLd data={organizationSchema} />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-TZDD4EVYEF" strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-TZDD4EVYEF');`}
      </Script>
    </ThemeProvider>
  )
}
