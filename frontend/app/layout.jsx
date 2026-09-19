import { Inter, Rajdhani, Poppins } from 'next/font/google'
import Script from 'next/script'
import JsonLd from '@/components/ui/JsonLd'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' })
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-poppins' })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Soma Güneş Enerji Santrali Temizliği ve Çözümleri | New Temizlik',
  description:
    'Soma ve çevresinde endüstriyel güneş enerji santrali (GES) temizliği, verimlilik analizi, otonom panel yıkama robotu ve makine satışı.',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.png',
  },
}

// index.html'deki site geneli @graph JSON-LD — birebir taşındı (bkz. plan Faz 2)
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      translate="no"
      className={`notranslate ${inter.variable} ${rajdhani.variable} ${poppins.variable}`}
      data-theme="light"
    >
      <body>
        {children}
        <JsonLd data={organizationSchema} />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-TZDD4EVYEF" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TZDD4EVYEF');`}
        </Script>
      </body>
    </html>
  )
}
