import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Panelin tamamı için ortak metadata — arama motorları hiçbir /nt-panel
// sayfasını indekslemesin. Bilerek burası /nt-panel'in indekslenmemesini
// sağlayan TEK katman — app/robots.ts'e bilerek eklenmedi (bkz. oradaki
// yorum): robots.txt herkese açık olduğundan gerçek panel yolunu /admin
// tuzağının yanında ifşa etmiş olurdu. Auth kontrolü BURADA yok — proxy.ts
// (iyimser) ve (korumali)/layout.tsx (gerçek) yapıyor; /nt-panel/giris bu
// koruma dışında kalmalı.
export const metadata: Metadata = {
  title: 'New Temizlik Panel',
  robots: { index: false, follow: false },
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return children
}
