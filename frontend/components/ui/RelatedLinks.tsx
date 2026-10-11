import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface RelatedLink {
  title: string
  desc: string
  href: string
}

interface RelatedLinksProps {
  eyebrow?: string
  title?: string
  links: RelatedLink[]
  background?: string
}

// Sayfalar arası dahili bağlantı bloğu — hizmet ↔ neden-biz ↔ blog.
export default function RelatedLinks({
  eyebrow = 'Keşfedin',
  title = 'İlgili Sayfalar',
  links,
  background = 'var(--bg-body)',
}: RelatedLinksProps) {
  if (links.length === 0) return null

  return (
    <section style={{ background, padding: '72px 0' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <SectionHeader eyebrow={eyebrow} title={title} titleSize="clamp(22px, 3vw, 30px)" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="section-card"
              style={{ padding: '24px 24px 22px', textDecoration: 'none', display: 'block' }}
            >
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                {l.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {l.desc}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                }}
              >
                Detaylı bilgi <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
