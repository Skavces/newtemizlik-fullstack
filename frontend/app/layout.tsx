import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Rajdhani, Poppins } from 'next/font/google'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

// latin-ext: Türkçe ğ/ş/ı/İ karakterleri latin subset'inde yok, olmadan
// bu harfler fallback fonta düşüp layout shift'e (CLS) yol açıyordu.
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })
const rajdhani = Rajdhani({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--font-rajdhani' })
const poppins = Poppins({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500', '600'], variable: '--font-poppins' })

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
      className={`${inter.variable} ${rajdhani.variable} ${poppins.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
