import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: '7/24 Kesintisiz İzleme | New Temizlik',
  description: 'Olası arıza veya verim düşüklüğünde anında müdahale edebilmek için GES sistemlerinizi 7/24 kesintisiz izliyoruz.',
  canonical: '/neden-biz/7-24-izleme',
  image: '/kontrol.jpg',
  imageAlt: 'GES santrali performans verilerinin sürekli izlenmesi',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  '7/24 uzaktan sistem izleme ve anomali tespiti',
  'Verim düşüklüğünde otomatik uyarı mekanizması',
  'Acil durumlarda hızlı saha müdahale ekibi',
  'Haftalık ve aylık performans özet raporları',
  'Arıza geçmişi ve çözüm kayıtlarının dijital arşivi',
  'Santral sahibine özet verilerle şeffaf raporlama',
]

export default function YirmiDortKesintisizIzlemePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '7/24 Kesintisiz İzleme', item: `${SITE_URL}/neden-biz/7-24-izleme` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="7/24 Kesintisiz İzleme"
        image="soma-ges-otonom-temizlik-robotu.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: '7/24 Kesintisiz İzleme' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/kontrol.jpg"
                alt="GES santrali performans verilerinin sürekli izlenmesi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Verim Düşüşünü Siz Fark Etmeden Yakalıyoruz"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Bir GES santralinde verim kaybı günler, hatta haftalar boyunca fark edilmeden
                sürebilir. Sistemlerinizi sürekli izleyerek olası arıza veya performans
                düşüklüğünü erken aşamada tespit ediyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Bir sorun tespit edildiğinde
                <strong style={{ color: 'var(--text-primary)' }}> saha ekibimiz hızla devreye girer</strong> —
                böylece kayıp süresi minimuma iner ve santralinizin üretim sürekliliği korunur.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%95</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>müşteri memnuniyet oranımız</span>
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
                params={{ location: 'neden_biz_izleme' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Santralinizin sürekli izlenmesi için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
