import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { getBlogPosts } from '@/lib/api'

interface StaticRoute {
  url: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

const STATIC_ROUTES: StaticRoute[] = [
  { url: '/', changeFrequency: 'weekly', priority: 1.0 },
  { url: '/kurumsal', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/hizmetlerimiz', changeFrequency: 'monthly', priority: 0.9 },
  { url: '/hizmetlerimiz/panel-temizlik', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/hizmetlerimiz/panel-bakim', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/hizmetlerimiz/robot-satisi', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/hizmetlerimiz/ot-temizligi', changeFrequency: 'monthly', priority: 0.85 },
  { url: '/panel-kirlilik-rehberi', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/neden-biz/7-24-izleme', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/neden-biz/isg-otonom-teknoloji', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/neden-biz/periyodik-bakim-plani', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/neden-biz/sertifikali-uzman-kadro', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/neden-biz/su-tasarrufu', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/neden-biz/veri-odakli-roi-analizi', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/referanslarimiz', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/sss', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/iletisim', changeFrequency: 'monthly', priority: 0.7 },
  { url: '/blog', changeFrequency: 'weekly', priority: 0.8 },
]

// Elle güncellenen eski public/sitemap.xml'in yerini alır — blog slug'ları
// artık backend'den geliyor, yeni yazı eklendiğinde otomatik dahil olur.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // BlogPostSummary'de updatedAt yok (bkz. GET /api/blog partial select) —
  // publishedAt yoksa createdAt'e düş.
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt || p.createdAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
