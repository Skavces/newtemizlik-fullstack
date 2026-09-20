import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import TrackedLink from './TrackedLink'
import { estimateReadTime } from '@/lib/readTime'

interface RelatedPost {
  title: string
  href: string
}

interface BlogArticleLayoutProps {
  title: string
  publishedAt: string | null
  content: string
  relatedPosts?: RelatedPost[]
}

// Backend'in allowlist'iyle (bkz. backend/src/common/html-sanitize.ts) birebir
// eşleşen render-taraflı ikinci savunma katmanı. Backend zaten sanitize ediyor;
// bu katman yalnızca allowlist'te bir boşluk (editöre eklenip html-sanitize.ts'e
// eklenmeyen bir tiptap extension'ı, ya da sanitize-html'de bir CVE) çıktığında
// devreye girer.
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    'p', 'br', 'hr',
    'h1', 'h2', 'h3',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'a', 'span',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'img',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'src', 'alt', 'width', 'height'],
  ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
}

// Sayfa Navbar/Footer/WhatsAppButton'ı (site) layout'undan alır — burada
// yalnızca makale gövdesi var. content = backend'in sanitize edip döndürdüğü
// güvenli HTML (bkz. backend/src/common/html-sanitize.ts).
export default function BlogArticleLayout({ title, publishedAt, content, relatedPosts = [] }: BlogArticleLayoutProps) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const readTime = estimateReadTime(content)
  const safeContent = DOMPurify.sanitize(content, SANITIZE_OPTIONS)

  return (
    <>
      {/* Header band */}
      <div style={{ background: 'var(--bg-alt)', marginTop: '80px', padding: '32px 0 28px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
          <Link
            href="/blog"
            className="hover-brand inline-flex items-center gap-1.5"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '16px' }}
          >
            <ArrowLeft size={14} /> Blog
          </Link>
          <h1
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, margin: '0 0 14px' }}
          >
            {title}
          </h1>
          <div className="flex items-center gap-4" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {dateLabel && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} /> {dateLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {readTime} dk okuma
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12" style={{ padding: '40px 0 80px' }}>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: safeContent }} />

        {/* CTA */}
        <div
          className="section-card"
          style={{ padding: '28px', marginTop: '48px', background: 'rgba(127,191,58,0.06)', border: '1px solid rgba(127,191,58,0.2)' }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
            GES santralınız için ücretsiz keşif alın
          </p>
          <TrackedLink
            href="tel:+905304738793"
            event="phone_click"
            params={{ location: 'blog_article_cta' }}
            className="cta-button inline-flex items-center gap-2"
            style={{ background: '#7FBF3A', color: '#fff', fontSize: '14px', fontWeight: 600, padding: '11px 22px', borderRadius: '9999px', textDecoration: 'none' }}
          >
            0530 473 87 93
          </TrackedLink>
        </div>

        {/* Related */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 className="section-heading" style={{ fontSize: '20px', marginBottom: '16px' }}>
              İlgili Makaleler
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {relatedPosts.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="hover-brand"
                  style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  → {p.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
