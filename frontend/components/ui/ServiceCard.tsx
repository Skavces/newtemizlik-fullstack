import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { servicePath, type ServiceEntry } from '@/lib/services'

// Ana sayfa Services bölümü ve /hizmetlerimiz grid'inin ortak kartı.
export default function ServiceCard({ service }: { service: ServiceEntry }) {
  return (
    <div className="section-card overflow-hidden flex flex-col">
      <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '10px 10px 0 0', aspectRatio: '16/10' }}>
        <Image
          src={service.image}
          alt={service.imageAlt}
          title={service.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="collage-img object-cover"
        />
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '10px' }}>
          {service.name}
        </h3>
        <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>
          {service.summary}
        </p>
        <Link
          href={servicePath(service)}
          className="detay-link inline-flex items-center gap-2 mt-6 font-semibold transition-colors duration-200"
          style={{ fontSize: '13px', color: 'var(--color-secondary)' }}
        >
          Detaylı Bilgi
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
