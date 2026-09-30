import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  path?: string
}

interface PageHeroProps {
  /** Sayfa başlığı (sol taraf) */
  title: string
  /** Arka plan resmi (public klasöründen, ör: "solar-panel.webp") */
  image: string
  breadcrumbs?: Breadcrumb[]
}

export default function PageHero({ title, image, breadcrumbs = [] }: PageHeroProps) {
  return (
    <section
      className="mt-20 md:mt-28 h-[220px]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Arka plan resmi */}
      <Image
        src={`/${image}`}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.05)' }}
      />

      {/* Koyu overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* İçerik */}
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full"
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Sol — sayfa adı */}
        <h1 className="section-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#ffffff', margin: 0 }}>
          {title}
        </h1>

        {/* Sağ — breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none', margin: 0, padding: 0 }}>
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {i > 0 && <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />}
                    {crumb.path && !isLast ? (
                      <Link
                        href={crumb.path}
                        className="pagehero-crumb"
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.6)',
                          transition: 'color 0.2s',
                        }}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
      </div>
    </section>
  )
}
