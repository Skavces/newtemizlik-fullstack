import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { TEAM_SIZE } from '@/lib/companyStats'

export const metadata = buildMetadata({
  title: 'İSG & Otonom Teknoloji | New Temizlik',
  description: 'Otonom temizlik robotlarımız ve uluslararası İş Güvenliği standartlarındaki saha protokollerimizle GES temizliğinde riski sıfıra indiriyoruz.',
  canonical: '/neden-biz/isg-otonom-teknoloji',
  image: '/ges-otonom-temizlik-robotu-ray-sistemi.webp',
  imageAlt: 'GES sahasında ray sistemli otonom panel temizlik robotu',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Otonom ve uzaktan kumandalı temizlik robotları',
  'Yüksekte çalışma riskini ortadan kaldıran saha protokolü',
  'Uluslararası İş Güvenliği (İSG) standartlarına uygun ekipman',
  'Sertifikalı operatörler ve düzenli güvenlik eğitimleri',
  'Elektrik çarpması riskine karşı izoleli ekipman kullanımı',
  'Her saha için ayrı risk değerlendirme raporu',
]

export default function IsgOtonomTeknolojiPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'İSG & Otonom Teknoloji', item: `${SITE_URL}/neden-biz/isg-otonom-teknoloji` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="İSG & Otonom Teknoloji"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'İSG & Otonom Teknoloji' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/ges-otonom-temizlik-robotu-ray-sistemi.webp"
                alt="GES sahasında ray sistemli otonom panel temizlik robotu"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Sahada Güvenlik, Teknolojiyle Sıfır Risk"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Yüksekte ve elektrikli bir yüzeyde çalışmak, klasik temizlik yöntemlerinin
                en büyük risk kaynağıdır. Otonom ve uzaktan kumandalı robotlarımız,
                personeli panel yüzeyinden uzak tutarak bu riski baştan ortadan kaldırır.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Tüm operasyonlarımız
                <strong style={{ color: 'var(--text-primary)' }}> uluslararası İş Güvenliği (İSG) standartlarında</strong> ve
                sertifikalı operatörler eşliğinde yürütülür — teknoloji ve saha disiplinini bir arada sunuyoruz.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>{TEAM_SIZE}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>sertifikalı saha uzmanından oluşan kadro</span>
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
                params={{ location: 'neden_biz_isg' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Sahanızda güvenli ve teknolojik bir temizlik için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
