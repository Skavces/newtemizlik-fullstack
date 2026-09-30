import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Periyodik Bakım Planı | New Temizlik',
  description: 'Mevsimsel tozlanma verilerine göre optimize edilmiş yıllık bakım sözleşmeleriyle GES santralinizin bakım takvimini önceden garanti altına alıyoruz.',
  canonical: '/neden-biz/periyodik-bakim-plani',
  image: '/planlama.jpg',
  imageAlt: 'GES santrali için yıllık bakım planlaması',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Bölgesel tozlanma ve iklim verisine göre optimize edilmiş takvim',
  'Yıllık bakım sözleşmesiyle sabit fiyat garantisi',
  'Sözleşmeli müşterilere öncelikli randevu ve hızlı müdahale',
  'Sezon öncesi ve sonrası kontrol ziyaretleri',
  'Sahaya özel bakım planı ve doküman arşivi',
  'Değişen hava koşullarına göre esnek yeniden planlama',
]

export default function PeriyodikBakimPlaniPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Periyodik Bakım Planı', item: `${SITE_URL}/neden-biz/periyodik-bakim-plani` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Periyodik Bakım Planı"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Periyodik Bakım Planı' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/planlama.jpg"
                alt="GES santrali için yıllık bakım planlaması"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Mevsimsel Veriye Dayalı Bakım Takvimi"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Her bölgenin tozlanma hızı ve iklimi farklıdır. Bu yüzden tek tip bir takvim yerine,
                sahanızın verilerine göre optimize edilmiş, size özel bir yıllık bakım planı hazırlıyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Yıllık sözleşmeli müşterilerimize
                <strong style={{ color: 'var(--text-primary)' }}> sabit fiyat ve öncelikli müdahale garantisi</strong> sunuyoruz —
                bakım artık sürpriz bir maliyet değil, önceden planlanmış bir süreç oluyor.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>2x</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>maksimum verim için önerilen minimum yıllık temizlik sıklığı</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-primary)', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href="tel:+905304738793"
                event="phone_click"
                params={{ location: 'neden_biz_bakim' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Sahanıza özel bakım planı için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
