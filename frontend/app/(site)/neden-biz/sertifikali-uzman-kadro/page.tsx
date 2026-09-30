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
  title: 'Sertifikalı Uzman Kadrosu | New Temizlik',
  description: 'Sertifikalı saha teknisyenleri ve GES performans analizi konusunda uzmanlaşmış kadromuzla her projede detaylı verim raporu teslim ediyoruz.',
  canonical: '/neden-biz/sertifikali-uzman-kadro',
  image: '/soma-gunes-enerjisi-santrali-uzman-bakim.webp',
  imageAlt: 'Sertifikalı saha teknisyeni güneş paneli üzerinde bakım yaparken',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Sertifikalı saha teknisyenleri ve elektrik mühendisleri',
  'GES performans analizi konusunda uzmanlaşmış kadro',
  'Düzenli iç eğitim ve sertifikasyon yenileme programı',
  'Her projede detaylı verim ve kalite raporu teslimi',
  'Saha deneyimiyle desteklenen teknik danışmanlık',
  'Türkiye genelinde 81 ilde hizmet verebilen ekip kapasitesi',
]

export default function SertifikaliUzmanKadroPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Sertifikalı Uzman Kadrosu', item: `${SITE_URL}/neden-biz/sertifikali-uzman-kadro` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Sertifikalı Uzman Kadrosu"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Sertifikalı Uzman Kadrosu' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/soma-gunes-enerjisi-santrali-uzman-bakim.webp"
                alt="Sertifikalı saha teknisyeni güneş paneli üzerinde bakım yaparken"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Sadece Temizlik Değil, Performans Analizi"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Panel yüzeyini temizlemek teknik bir işlemdir; ama asıl fark, sahadaki ekibin
                o veriyi doğru okuyabilmesinde ortaya çıkar. Kadromuz yalnızca temizlik değil,
                GES performans analizi konusunda da uzmanlaşmıştır.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Sertifikalı teknisyenlerimiz düzenli eğitimlerden geçer;
                <strong style={{ color: 'var(--text-primary)' }}> her proje sonunda size detaylı bir verim raporu</strong> teslim
                ederiz, böylece sahanızın gerçek durumunu her zaman bilirsiniz.
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
                params={{ location: 'neden_biz_kadro' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Uzman kadromuzla tanışmak için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
