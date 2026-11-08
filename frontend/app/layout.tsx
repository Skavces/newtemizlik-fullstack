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
  title: 'Soma Temizlik Hizmetleri ve GES Panel Bakımı | New Temizlik',
  description:
    'Soma ve Manisa çevresinde ev, iş yeri ve kurum temizliği; Türkiye genelinde güneş enerji santrali (GES) temizliği, bakımı ve otonom robot satışı.',
  icons: {
    // Yaprak + damla ikonu (2026-11-08). SVG ikon bilerek yok: SVG destekleyen
    // tarayıcılar onu öncelikli seçer.
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
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
