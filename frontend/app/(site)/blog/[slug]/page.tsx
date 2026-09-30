import { notFound } from 'next/navigation'
import BlogArticleLayout from '@/components/ui/BlogArticleLayout'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL, SITE_NAME } from '@/lib/seo'
import { getBlogPost, getBlogPosts } from '@/lib/api'
import { isApiError } from '@/lib/errors'

// Build sırasında backend kapalıysa hiçbir slug prerender edilmez; admin'den
// eklenen yazılar da dahil her slug dynamicParams ile ilk istekte üretilip
// cache'lenir (bkz. Faz 3 planı, app/revalidate/route.js).
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts()
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

async function loadPost(slug: string) {
  try {
    return await getBlogPost(slug)
  } catch (err) {
    if (isApiError(err) && err.status === 404) return null
    throw err
  }
}

// metaDescription/excerpt ikisi de boşsa <meta name="description"> boş
// kalmasın diye gövde HTML'inden düz metin türetilir.
function fallbackDescription(html: string): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) return {}

  return buildMetadata({
    title: `${post.title} | New Temizlik`,
    ogTitle: post.title,
    description: post.metaDescription || post.excerpt || fallbackDescription(post.content),
    canonical: `/blog/${post.slug}`,
    image: post.coverImage || '/logo.png',
    imageAlt: post.title,
    imageWidth: post.coverImage ? 1200 : 1080,
    imageHeight: post.coverImage ? 800 : 1015,
    type: 'article',
  })
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()

  const allPosts = await getBlogPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => ({ title: p.title, href: `/blog/${p.slug}` }))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/logo.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlogArticleLayout
        title={post.title}
        publishedAt={post.publishedAt}
        content={post.content}
        relatedPosts={relatedPosts}
      />
    </>
  )
}
