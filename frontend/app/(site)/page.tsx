import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import WhyUs from '@/components/sections/WhyUs'
import Process from '@/components/sections/Process'
import Referanslar from '@/components/sections/Referanslar'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, ORGANIZATION_ID, SITE_URL } from '@/lib/seo'
import { getReferences } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'New Temizlik | Soma GES Temizlik ve Bakım Çözümleri',
  description:
    'Soma ve Türkiye genelinde endüstriyel GES ve güneş paneli temizliği. Solar panel yıkama, bakım izleme ve otonom temizlik robotu ile verim kaybını önlüyoruz.',
  keywords: 'soma ges temizliği, güneş paneli temizliği, panel temizliği, ges temizliği, solar panel yıkama, türkiye geneli ges temizliği, manisa ges temizliği',
  canonical: '/',
  imageAlt: 'New Temizlik - GES ve güneş paneli temizlik hizmetleri',
})

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Soma GES Otonom Panel Yıkama Robotu Saha Testi',
  description: 'Soma güneş enerji santralinde otonom panel yıkama robotunun sahada performans testi ve çalışma görüntüleri. New Temizlik GES temizlik robotu uygulaması.',
  thumbnailUrl: `${SITE_URL}/hero-poster.webp`,
  uploadDate: '2026-09-30',
  contentUrl: `${SITE_URL}/otonom-panel-yikama-robotu.mp4`,
  publisher: { '@id': ORGANIZATION_ID },
}

export default async function HomePage() {
  const references = await getReferences()

  return (
    <>
      <JsonLd data={videoSchema} />
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <Referanslar references={references} />
    </>
  )
}
