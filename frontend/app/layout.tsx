import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Rajdhani, Poppins } from 'next/font/google'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' })
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-poppins' })

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="tr"
      translate="no"
      className={`notranslate ${inter.variable} ${rajdhani.variable} ${poppins.variable}`}
      data-theme="light"
    >
      <body>{children}</body>
    </html>
  )
}
