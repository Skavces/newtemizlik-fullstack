import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Su İsrafı Yapmıyoruz | New Temizlik',
  description: 'Minimum su tüketimiyle maksimum temizlik sağlayan yöntemlerimiz ve mobil su sistemlerimizle GES temizliğinde çevreye duyarlı hizmet veriyoruz.',
  canonical: '/neden-biz/su-tasarrufu',
  image: '/gunes-paneli-sulama-temizlik-boru-sistemi.webp',
  imageAlt: 'GES panel temizliğinde kontrollü su sarfiyatlı sulama sistemi',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Düşük basınçlı, kontrollü su sarfiyatlı yıkama sistemleri',
  'Kuru fırçalama destekli hibrit temizlik yöntemleri',
  'Saha kaynaklarına bağımlı olmayan mobil su tankları',
  'Panel yüzeyine zarar vermeyen, kimyasal içermeyen sıvılar',
  'Su geri kazanım ve minimum atık prensibi',
  'Bölgesel su kısıtlarına duyarlı operasyon planlaması',
]

export default function SuTasarrufuPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Su İsrafı Yapmıyoruz', item: `${SITE_URL}/neden-biz/su-tasarrufu` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Su İsrafı Yapmıyoruz"
        image="gunes-paneli-sulama-temizlik-boru-sistemi.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Su İsrafı Yapmıyoruz' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/gunes-paneli-sulama-temizlik-boru-sistemi.webp"
                alt="GES panel temizliğinde kontrollü su sarfiyatlı sulama sistemi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Suyu Değil, Verimi Artırıyoruz"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Büyük ölçekli GES sahalarında bilinçsiz su kullanımı hem maliyeti hem de
                çevresel etkiyi artırır. Kontrollü basınçlı sistemlerimiz ve kuru fırçalama
                destekli yöntemlerimizle aynı temizlik kalitesini çok daha az su ile sağlıyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Mobil su tanklarımız sayesinde saha kaynaklarına bağımlı kalmadan çalışır,
                <strong style={{ color: 'var(--text-primary)' }}> minimum su tüketimiyle maksimum temizlik</strong> ilkesini
                her projede uygularız.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>Minimum Su</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>tüketimiyle maksimum temizlik verimi</span>
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
                params={{ location: 'neden_biz_su' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Çevreye duyarlı GES temizliği için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
