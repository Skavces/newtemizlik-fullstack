import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'GES Sahası Ot Temizliği Hizmeti | New Temizlik',
  description: 'Güneş enerji santrali sahalarında panel altı ve aralarındaki ot ve bitki örtüsünün düzenli temizliği. Gölgelenme, yangın riski ve haşere üremesini önlüyoruz.',
  canonical: '/hizmetlerimiz/ot-temizligi',
  image: '/gesottemizligi.webp',
  imageAlt: 'GES sahasında tırpanla ot temizliği yapan saha ekibi',
  imageWidth: 1536,
  imageHeight: 1024,
})

const features = [
  'Panel altı ve aralarındaki ot/bitki örtüsünün gölgelenmeye yol açmadan temizlenmesi',
  'Kuru ve yanıcı bitki örtüsünün azaltılmasıyla yangın riskinin düşürülmesi',
  'Kemirgen ve haşere üremesine zemin hazırlayan bitki örtüsünün kontrol altına alınması',
  'Kablo ve ekipmanlara zarar vermeyen dikkatli, elle veya makineli çalışma yöntemleri',
  'Saha büyüklüğüne göre optimize edilmiş ekip ve ekipman planlaması',
  'Mevsimsel bitki büyüme hızına göre planlı temizlik takvimi',
]

export default function OtTemizligiPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: 'Ot Temizliği', item: `${SITE_URL}/hizmetlerimiz/ot-temizligi` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Ot Temizliği"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: 'Ot Temizliği' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div
              className="w-full lg:w-1/2 overflow-hidden"
              style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}
            >
              <Image
                src="/gesottemizligi.webp"
                alt="GES sahasında tırpanla ot temizliği yapan saha ekibi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Hizmet Detayı"
                title="GES Sahalarında Ot ve Bitki Örtüsü Temizliği"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Güneş enerji santrali sahalarında zamanla yükselen ot ve bitki örtüsü, panelleri
                gölgeleyerek üretim kaybına yol açar; kuru mevsimlerde ise
                <strong style={{ color: 'var(--text-primary)' }}> yangın riskini</strong> ciddi şekilde artırır.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Saha ekiplerimiz, panel altı ve aralarındaki bitki örtüsünü kablo ve ekipmanlara
                zarar vermeyen yöntemlerle düzenli olarak temizler. Böylece sahanız gölgelenme,
                yangın ve haşere riskinden korunmuş olur.
              </p>

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
                params={{ location: 'ot_temizligi' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Sahanızda ot ve bitki örtüsü kontrolü için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
