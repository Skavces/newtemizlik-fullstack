import type { Metadata } from 'next'

export const SITE_URL = 'https://www.newtemizlik.com'
export const SITE_NAME = 'New Temizlik'

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
  image = '/og.png',
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
