import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getFaqs } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'GES Panel Bakım ve Onarım İzleme Hizmeti | New Temizlik',
  description: 'GES santrallerinde proaktif bakım, termal analiz ve performans izleme hizmetleri. Hotspot tespiti ve invertör kontrolüyle verim kayıplarını ve arızaları erkenden önlüyoruz.',
  canonical: '/hizmetlerimiz/panel-bakim',
  image: '/ges-bakim-onarim-termal-analiz.webp',
  imageAlt: 'GES santralinde termal analiz ve bakım onarım izleme çalışması',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'İnvertör verisi ile sıcak nokta (hotspot) tespiti',
  'Invertör ve DC kablo hat kontrolü',
  'Sigorta, montaj ve bağlantı noktası kontrolleri',
  'Dijital raporlama ve periyodik bakım takvimi',
  'Üretim verisi analizi ile erken arıza tespiti',
  'Yıllık bakım sözleşmesiyle öncelikli müdahale garantisi',
]

export default async function PanelBakimPage() {
  const faqs = await getFaqs('panel-bakim')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: 'Panel Bakım & Onarım İzleme', item: `${SITE_URL}/hizmetlerimiz/panel-bakim` },
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
        title="Panel Bakım & Onarım İzleme"
        image="solar-panel.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: 'Panel Bakım & Onarım İzleme' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ borderRadius: '16px', aspectRatio: '4/3' }}>
              <img
                src="/soma-gunes-enerjisi-santrali-uzman-bakim.webp"
                alt="Güneş enerjisi santralinde bakım ve performans kontrol çalışması"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '12px' }}>
                Hizmet Detayı
              </span>
              <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: '18px' }}>
                Proaktif Performans Yönetimi
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                GES santrallerindeki verim kayıplarının büyük çoğunluğu erken müdahaleyle
                önlenebilir. Ancak sorunlar gözle görülür hale geldiğinde çoğunlukla
                aylarca kayıp yaşanmış olur.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Santral üretim verilerini sürekli izleyerek performans düşüşlerini anında
                tespit ediyoruz. İnvertör kontrolleri ve
                elektrik ölçümleriyle sisteminizin tam kapasitede çalışmasını
                <strong style={{ color: 'var(--text-primary)' }}> proaktif bir yaklaşımla</strong> garanti ediyoruz.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(127,191,58,0.08)', borderLeft: '3px solid #7FBF3A', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: '#7FBF3A' }}>%15&apos;e kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>kayıp önleme sağlıyoruz</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={16} style={{ color: '#7FBF3A', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href="tel:+905304738793"
                event="phone_click"
                params={{ location: 'panel_bakim' }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px', background: '#7FBF3A', color: '#fff',
                  fontSize: '14px', fontWeight: 600, borderRadius: '9999px',
                  textDecoration: 'none', letterSpacing: '0.04em',
                  boxShadow: '0 4px 15px rgba(127,191,58,0.3)',
                }}
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
              Merak Edilenler
            </span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(24px, 3.5vw, 34px)' }}>
              GES Bakım ve İzleme Hakkında SSS
            </h2>
            <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((f) => (
              <div key={f.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '24px 28px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>{f.question}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
