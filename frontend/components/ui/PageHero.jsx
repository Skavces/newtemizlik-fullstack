import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

/**
 * PageHero — iç sayfa hero banner
 * @param {string} title       - Sayfa başlığı (sol taraf)
 * @param {string} image       - Arka plan resmi (public klasöründen, ör: "ges-temizligi.jpg")
 * @param {Array}  breadcrumbs - [{ label: 'Ana Sayfa', path: '/' }, { label: 'Kurumsal' }]
 */
export default function PageHero({ title, image, breadcrumbs = [] }) {
  return (
    <section
      style={{
        position: 'relative',
        height: '220px',
        marginTop: '80px', // navbar yüksekliği kadar (md: 112px ama 80px yeterli)
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Arka plan resmi */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(/${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.05)',
        }}
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
        <h1
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
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
                        className="hover-brand"
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
                          color: '#7FBF3A',
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
