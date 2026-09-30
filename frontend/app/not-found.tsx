import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Kök seviyede yaşar (app/(site)/ değil) ki tamamen eşleşmeyen her URL için
// (nt-panel altındaki yanlış yazımlar dahil) Next.js bunu global fallback
// olarak kullansın — (site) route group'u içindeki bir not-found.tsx yalnızca
// o segment ağacından notFound() çağrıldığında devreye girer, rastgele
// üst-seviye path'leri yakalamaz.
export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-body)' }}
    >
      <Image src="/logo.png" alt="New Temizlik" width={72} height={68} style={{ objectFit: 'contain', marginBottom: '24px' }} />
      <p
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 'clamp(64px, 12vw, 120px)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        404
      </p>
      <h1 className="section-heading" style={{ fontSize: 'clamp(22px, 3vw, 30px)', marginBottom: '12px' }}>
        Aradığınız sayfa bulunamadı
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '32px', lineHeight: 1.7 }}>
        Bu sayfa taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek aradığınız hizmete oradan ulaşabilirsiniz.
      </p>
      <Link href="/" className="cta-button">
        Ana Sayfaya Dön <ArrowRight size={16} />
      </Link>
    </div>
  )
}
