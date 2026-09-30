import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Veri Odaklı ROI Analizi | New Temizlik',
  description: 'GES temizliği öncesi ve sonrası inverter verileriyle üretim artışını ölçüyor, yatırımınızın geri dönüşünü somut rakamlarla raporluyoruz.',
  canonical: '/neden-biz/veri-odakli-roi-analizi',
  image: '/ges-bakim-onarim-termal-analiz.webp',
  imageAlt: 'GES santralinde inverter verisi ile performans analizi',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Temizlik öncesi ve sonrası inverter üretim verisi karşılaştırması',
  'kWh bazında somut verim artışı raporu',
  'Sahaya özel yatırım geri dönüş (ROI) hesaplaması',
  'Aylık ve yıllık performans göstergesi (KPI) takibi',
  'Dijital, arşivlenebilir raporlama',
  'Yıllara yayılan trend analiziyle veriye dayalı bakım kararları',
]

export default function VeriOdakliRoiAnaliziPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Veri Odaklı ROI Analizi', item: `${SITE_URL}/neden-biz/veri-odakli-roi-analizi` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Veri Odaklı ROI Analizi"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Veri Odaklı ROI Analizi' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/ges-bakim-onarim-termal-analiz.webp"
                alt="GES santralinde inverter verisi ile performans analizi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Yatırımınızın Karşılığını Rakamlarla Görün"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                GES temizliğinin gerçek değeri, sonrasında ölçülen üretim artışında ortaya çıkar.
                Biz her sahada temizlik öncesi ve sonrası inverter verilerini karşılaştırarak
                işlemin santralinize kaç kWh kazandırdığını somut biçimde gösteriyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Bu sayede temizlik bir gider kalemi olmaktan çıkıp,
                <strong style={{ color: 'var(--text-primary)' }}> geri dönüşü izlenebilir bir yatırım</strong> haline
                gelir. Raporlarımız, bir sonraki bakım kararınızı veriye dayandırmanızı sağlar.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%30&apos;a kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>verim kaybını raporlarla görünür kılıyoruz</span>
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
                params={{ location: 'neden_biz_roi' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Santralinizin verim potansiyelini birlikte analiz edelim" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
