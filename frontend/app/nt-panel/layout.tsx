import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Panelin tamamı için ortak metadata — arama motorları hiçbir /nt-panel
// sayfasını indekslemesin (bkz. app/robots.ts'teki disallow de ayrıca var,
// bu ikinci bir savunma katmanı: robots.txt görmeyen/uymayan tarayıcılar
// için). Auth kontrolü BURADA yok — proxy.ts (iyimser) ve
// (korumali)/layout.tsx (gerçek) yapıyor; /nt-panel/giris bu koruma
// dışında kalmalı.
export const metadata: Metadata = {
  title: 'New Temizlik Panel',
  robots: { index: false, follow: false },
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return children
}
