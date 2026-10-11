import type { Metadata } from 'next'

export const SITE_URL = 'https://www.newtemizlik.com'
export const SITE_NAME = 'New Temizlik'
// Sitewide JSON-LD organizasyon düğümünün @id'si (bkz. app/(site)/layout.tsx);
// diğer şemalar provider/publisher/author'ı bu id'ye referansla bağlar.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

const TITLE_MAX = 60
const DESCRIPTION_MAX = 155

// Başlığa " | New Temizlik" eki 60 karakteri aşıyorsa ek düşer — SERP'te
// kesilen bir başlıktan, markasız ama tam bir başlık daha iyi.
export function brandedTitle(title: string): string {
  const branded = `${title} | ${SITE_NAME}`
  return branded.length <= TITLE_MAX ? branded : title
}

// Backend'den gelen (editörün yazdığı) açıklamalar için güvenlik ağı:
// sınırı aşarsa son tam kelimede kesip "…" ekler.
export function clampDescription(text: string): string {
  if (text.length <= DESCRIPTION_MAX) return text
  const cut = text.slice(0, DESCRIPTION_MAX - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`
}

interface FaqItem {
  question: string
  answer: string
}

// FAQPage JSON-LD — accordion'u besleyen veriyle aynı kaynaktan üretilir ki
// görünen metin ile şema birbirinden sapmasın.
export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

interface BuildMetadataOptions {
  title: string
  description: string
  canonical: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  type?: 'website' | 'article'
  keywords?: string
  // RobotSatisPage'de <title> ile og:title/twitter:title kasıtlı olarak
  // farklıydı (eski site) — birebir korunması için opsiyonel override.
  ogTitle?: string
}

// Her sayfanın Helmet bloğunda tekrarlanan sabit OG/Twitter alanları — bkz.
// plan Faz 2. `image` ve `canonical` relative verilir, root layout'taki
// metadataBase ile otomatik SITE_URL'e bağlanır.
export function buildMetadata({
  title,
  description,
  canonical,
  image = '/og.jpg',
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  type = 'website',
  keywords,
  ogTitle,
}: BuildMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      title: ogTitle || title,
      description,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      images: [{ url: image, width: imageWidth, height: imageHeight, alt: imageAlt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || title,
      description,
      images: [image],
    },
  }
}
