import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getBlogPosts } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Blog | GES Temizlik ve Bakım Rehberleri | New Temizlik',
  description: 'Güneş paneli temizliği, GES bakımı, hotspot tespiti ve otonom temizlik teknolojileri hakkında uzman rehberler ve teknik makaleler.',
  canonical: '/blog',
  imageAlt: 'New Temizlik GES temizlik ve bakım blog logosu',
})

export default async function BlogPage() {
  const posts = await getBlogPosts()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'New Temizlik Blog',
    description: 'GES temizlik, bakım ve otonom temizlik teknolojileri hakkında uzman rehberler',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'New Temizlik',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      image: p.coverImage ? `${SITE_URL}${p.coverImage}` : undefined,
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GES Temizlik ve Bakım Blog Yazıları',
    description: 'Güneş paneli temizliği, GES bakımı ve otonom temizlik teknolojileri hakkında uzman rehberler',
    url: `${SITE_URL}/blog`,
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/blog/${p.slug}`,
      name: p.title,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={blogSchema} />
      <JsonLd data={itemListSchema} />

      <PageHero
        title="Blog"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Blog' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '72px 0 96px' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <SectionHeader
              eyebrow="Teknik Rehberler"
              title="GES Temizlik ve Bakım Makaleleri"
              titleSize="clamp(24px, 3.5vw, 36px)"
              lead="Güneş enerji santralinizin verimini korumak için bilmeniz gereken her şey."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <article className="section-card overflow-hidden h-full">
                  {post.coverImage && (
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} />
                        {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '17px', fontWeight: 700,
                      color: 'var(--text-primary)', lineHeight: 1.3,
                      marginBottom: '10px', fontFamily: "'Rajdhani', sans-serif",
                    }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                      {post.excerpt}
                    </p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)',
                    }}>
                      Devamını Oku <ArrowRight size={13} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
