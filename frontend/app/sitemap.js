import { SITE_URL } from '@/lib/seo'
import { getBlogPosts } from '@/lib/api'

const STATIC_ROUTES = [
  { url: '/', changeFrequency: 'weekly', priority: 1.0 },
  { url: '/kurumsal', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/hizmetlerimiz', changeFrequency: 'monthly', priority: 0.9 },
  { url: '/hizmetlerimiz/panel-temizlik', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/hizmetlerimiz/panel-bakim', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/hizmetlerimiz/robot-satisi', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/referanslarimiz', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/sss', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/iletisim', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/blog', changeFrequency: 'weekly', priority: 0.8 },
]

// Elle güncellenen eski public/sitemap.xml'in yerini alır — blog slug'ları
// artık backend'den geliyor, yeni yazı eklendiğinde otomatik dahil olur.
export default async function sitemap() {
  const posts = await getBlogPosts()

  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const blogEntries = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
