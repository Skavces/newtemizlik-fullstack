import Link from 'next/link'
import type { Metadata } from 'next'
import { Shield, Home } from 'lucide-react'

// Yönetim paneli /nt-panel'de — bu, renel-enerji'nin AdminGateway.jsx'inden
// portlanmış bir tuzak sayfa. app/robots.ts zaten /admin'i disallow ediyor;
// bu noindex meta ikinci bir savunma katmanı.
export const metadata: Metadata = {
  title: 'Yönetici Girişi',
  robots: { index: false, follow: false },
}

export default function AdminGatewayPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: 'var(--bg-body)' }}>
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Shield size={80} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
        </div>

        <h1 className="mb-3 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Ne yapmaya çalıştığını biliyoruz :D
        </h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Aradığınız sayfa burada değil.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <Home size={18} />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
