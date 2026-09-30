import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FaqAccordion from '@/components/ui/FaqAccordion'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import ProductGallery from '@/components/sections/ProductGallery'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getFaqs } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'GES Panel Temizlik Robotu ve Makina Satışı | New Temizlik',
  description: 'GES solar panel temizlik robotu ve makina satışı. Büyük ölçekli güneş enerji santralleri için otonom, IoT destekli, uzaktan yönetilebilen panel yıkama sistemleri.',
  ogTitle: 'GES Solar Panel Temizlik Robotu Satışı | New Temizlik',
  canonical: '/hizmetlerimiz/robot-satisi',
  image: '/soma-ges-otonom-temizlik-robotu.webp',
  imageAlt: 'GES sahasında otonom solar panel temizlik robotu çalışma görüntüsü',
  imageWidth: 1200,
  imageHeight: 800,
})

const productPhotos = [
  { src: '/ges-panel-temizlik-robotu-saha-uygulamasi.webp', alt: 'GES panel temizlik robotu saha uygulaması' },
  { src: '/ges-panel-temizlik-robotu-saha-calismasi.webp', alt: 'GES panel temizlik robotu saha çalışması' },
  { src: '/ges-otonom-temizlik-robotu-ray-sistemi.webp', alt: 'GES otonom temizlik robotu ray sistemi' },
  { src: '/leopardust-ges-panel-temizlik-robotu-saha.webp', alt: 'LeopardDust GES panel temizlik robotu sahada' },
  { src: '/gunes-enerjisi-santrali-otomatik-ray-temizlik-sistemi.webp', alt: 'Güneş enerjisi santrali otomatik ray temizlik sistemi' },
  { src: '/gunes-paneli-manuel-temizlik-fircasi-makinasi.webp', alt: 'Güneş paneli manuel temizlik fırçası makinası' },
  { src: '/gunes-paneli-cift-diskli-elektrikli-temizlik-fircasi.webp', alt: 'Güneş paneli çift diskli elektrikli temizlik fırçası' },
  { src: '/gunes-paneli-uzatmali-cift-fircali-temizlik-makinasi.webp', alt: 'Güneş paneli uzatmalı çift fırçalı temizlik makinası' },
  { src: '/gunes-paneli-elektrikli-temizlik-fircasi-seri-uretim.webp', alt: 'Güneş paneli elektrikli temizlik fırçası seri üretim' },
  { src: '/ges-panel-temizlik-makinasi-cesitleri.webp', alt: 'GES panel temizlik makinası çeşitleri' },
  { src: '/gunes-paneli-sulama-temizlik-boru-sistemi.webp', alt: 'Güneş paneli sulama temizlik boru sistemi' },
  { src: '/ges-temizlik-robotu-urun-aksesuarlari.webp', alt: 'GES temizlik robotu ürün aksesuarları' },
  { src: '/ges-temizlik-robotu-uzaktan-kumandali-ozellikler.webp', alt: 'GES temizlik robotu uzaktan kumandalı özellikler' },
]

const features = [
  'Su israfı yapmadan minimum su tüketimiyle etkili temizlik',
  'Uzaktan izleme ve kontrol paneli (IoT entegrasyonu)',
  'Saha koşullarına göre özelleştirilebilir ray sistemleri',
  'Düşük işletme maliyeti ve yüksek temizlik kapasitesi',
  'Kurulum, operatör eğitimi ve 2 yıl teknik destek garantisi',
  'Büyük ölçekli sahalar için maliyet-etkin otomasyon çözümü',
]

export default async function RobotSatisPage() {
  const faqs = await getFaqs('robot-satisi')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: 'Robot & Makina Satışı', item: `${SITE_URL}/hizmetlerimiz/robot-satisi` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        title="Temizlik Robot & Makina Satışı"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: 'Robot & Makina Satışı' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/soma-ges-otonom-temizlik-robotu.webp"
                alt="GES sahasında kullanılan otonom panel temizlik robotu"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Hizmet Detayı"
                title="Otonom Temizlik Teknolojileri"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Büyük ölçekli GES sahalarında geleneksel temizlik yöntemleri hem maliyetli
                hem de zaman alıcıdır. Otonom robot sistemlerimiz bu sorunu kökten çözüyor:
                daha az insan gücü, daha az su, daha fazla verim.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Saha geometrinize ve panel dizilimine göre özelleştirilen ray sistemi
                üzerinde hareket eden robotlarımız, uzaktan izlenebilir ve programlanabilir
                yapısıyla
                <strong style={{ color: 'var(--text-primary)' }}> 7/24 kesintisiz temizlik</strong> imkânı sunar.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%60&apos;a kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>iş gücü tasarrufu sağlıyoruz</span>
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
                params={{ location: 'robot_satis' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ürün Fotoğrafları ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Ürün Galerisi"
              title="Ürünlerimizin Fotoğrafları"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>

          <ProductGallery photos={productPhotos} />
        </div>
      </section>

      {/* SSS */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Merak Edilenler"
              title="Solar Panel Temizlik Robotu Hakkında SSS"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </>
  )
}
