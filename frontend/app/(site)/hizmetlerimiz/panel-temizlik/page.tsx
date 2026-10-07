import Image from 'next/image'
import { CheckCircle, ArrowRight, MapPin } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FaqAccordion from '@/components/ui/FaqAccordion'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import { buildMetadata, ORGANIZATION_ID, SITE_URL } from '@/lib/seo'
import { getFaqs } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Soma GES Temizliği ve Güneş Paneli Yıkama | New Temizlik',
  description: "Soma'da ve Türkiye genelinde profesyonel GES temizliği, güneş paneli yıkama ve solar panel temizlik hizmeti. Soma'nın endüstriyel toz ortamına özel yöntemlerle %30'a kadar verim artışı sağlıyoruz.",
  keywords: 'soma ges temizliği, güneş paneli temizliği, panel temizliği, ges temizliği, solar panel temizliği, türkiye geneli ges temizliği, güneş enerji santrali temizliği, manisa ges temizliği',
  canonical: '/hizmetlerimiz/panel-temizlik',
  image: '/endustriyel-gunes-paneli-yikama.webp',
  imageAlt: 'GES sahasında profesyonel endüstriyel güneş paneli temizlik çalışması',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Su israfı yapmadan, kontrollü su kullanımıyla leke bırakmayan temizlik',
  'Panel yüzeyine zarar vermeyen yumuşak fırça sistemleri',
  'Saha büyüklüğüne göre optimize edilmiş ekip ve ekipman',
  'Temizlik öncesi ve sonrası üretim karşılaştırma raporu',
  'Mevsimsel tozlanma verilerine göre planlı temizlik takvimi',
  'ISG standartlarına uygun güvenli saha operasyonu',
]

const serviceAreas = [
  { il: 'Manisa', ilceler: 'Soma, Akhisar, Kırkağaç, Saruhanlı, Turgutlu, Salihli, Gördes, Demirci' },
  { il: 'İzmir', ilceler: 'Aliağa, Bergama, Menemen, Torbalı, Kemalpaşa, Selçuk' },
  { il: 'Balıkesir', ilceler: 'Bandırma, Gönen, Burhaniye, Edremit, Ayvalık' },
  { il: 'Kütahya', ilceler: 'Gediz, Tavşanlı, Simav, Emet' },
  { il: 'Uşak & Afyon', ilceler: 'Uşak merkez, Afyonkarahisar merkez ve çevre ilçeler' },
  { il: 'Diğer İller', ilceler: 'Konya, Ankara, Antalya, Adana başta olmak üzere Türkiye geneli GES sahaları' },
]

const nedenSomaCards = [
  {
    title: 'Kömür & Sanayi Tozu',
    text: 'Soma termik santrallerinden yayılan kömür tozu ve silis partikülleri güneş panellerine yapışarak ışık geçirgenliğini ciddi ölçüde düşürür. Standart yöntemler bu kalıcı kirliliği temizlemekte yetersiz kalır.',
  },
  {
    title: 'Tarımsal Kirlilik',
    text: 'Soma çevresindeki geniş tarım arazilerinden yükselen tarımsal toz, ilaç kalıntısı ve ot poleni GES panellerinde birikici bir kirlilik tabakası oluşturur. Panel verimliliğini mevsimsel olarak ciddi şekilde etkiler.',
  },
  {
    title: 'Hızlı Verim Düşüşü',
    text: 'Ülke ortalamasının üzerinde kirlilik yükü taşıyan Soma GES sahalarında temizliksiz bırakılan paneller, yaz-kış döngülerinde ulusal ortalamaya kıyasla iki kat daha hızlı verim kaybeder.',
  },
]

const areaServedSchema = [
  { '@type': 'City', name: 'Soma' },
  { '@type': 'City', name: 'Akhisar' },
  { '@type': 'City', name: 'Kırkağaç' },
  { '@type': 'AdministrativeArea', name: 'Manisa' },
  { '@type': 'AdministrativeArea', name: 'İzmir' },
  { '@type': 'AdministrativeArea', name: 'Balıkesir' },
  { '@type': 'AdministrativeArea', name: 'Kütahya' },
  { '@type': 'Country', name: 'Türkiye' },
]

export default async function PanelTemizlikPage() {
  const faqs = await getFaqs('panel-temizlik')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: 'Panel Temizlik Hizmeti', item: `${SITE_URL}/hizmetlerimiz/panel-temizlik` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GES Panel Temizliği',
    alternateName: ['Güneş Paneli Temizliği', 'Solar Panel Yıkama', 'GES Temizliği', 'Panel Temizliği', 'Soma GES Temizliği'],
    description: "Soma ve Türkiye genelinde profesyonel güneş enerji santrali (GES) panel temizliği, solar panel yıkama ve bakım hizmetleri. Yumuşak fırça sistemleri ve kontrollü su kullanımıyla panellerinizde %30'a kadar verim artışı.",
    serviceType: 'GES Panel Temizliği',
    url: `${SITE_URL}/hizmetlerimiz/panel-temizlik`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: areaServedSchema,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'GES Temizlik Hizmetleri',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Endüstriyel GES Panel Temizliği' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Otonom Robot ile Panel Yıkama' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Periyodik GES Bakım Sözleşmesi' } },
      ],
    },
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
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        title="Panel Temizlik Hizmeti"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: 'Panel Temizlik Hizmeti' },
        ]}
      />

      {/* Ana içerik */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/endustriyel-gunes-paneli-yikama.webp"
                alt="GES sahasında profesyonel güneş paneli temizlik çalışması"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Soma & Türkiye Geneli GES Hizmeti"
                title="Soma ve Türkiye Genelinde Profesyonel GES Panel Temizliği"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Soma GES temizliği</strong> konusunda bölgenin en deneyimli ekibiyiz.
                Termik santraller ve sanayi tesislerine yakın Soma&apos;da güneş panelleri; kömür tozu, silis tozu ve endüstriyel
                is birikimi nedeniyle ulusal ortalamadan çok daha hızlı kirlenip <strong style={{ color: 'var(--text-primary)' }}>%30&apos;a kadar</strong> verim
                kaybeder. Bu özel koşullar için doğru ekipman ve yöntemlerle sahada çözüm üretiyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Soma merkezli olmakla birlikte Manisa, İzmir, Balıkesir, Kütahya, Uşak ve
                Türkiye genelindeki tüm büyük <strong style={{ color: 'var(--text-primary)' }}>güneş enerji santrali (GES)</strong> sahalarına hizmet veriyoruz.
                Su israfı yapmadan, saha koşullarına göre optimize edilmiş
                özel ekipmanlarla panellerinizin yüzeyini fabrika çıkışı temizliğine kavuşturuyoruz.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%30&apos;a kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>verim artışı sağlıyoruz</span>
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
                params={{ location: 'panel_temizlik' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Soma'ya Özel Bölüm */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Neden Soma?"
              title="Soma'nın GES Sahalarına Özel Temizlik Zorluğu"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {nedenSomaCards.map((item, i) => (
              <div key={i} className="section-card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.03em' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmet Bölgelerimiz */}
      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Türkiye Geneli Hizmet"
              title="GES Temizliği Hizmet Verilen Bölgeler"
              titleSize="clamp(24px, 3.5vw, 34px)"
              lead="Soma merkezli saha ekiplerimiz Türkiye genelindeki güneş enerji santrallerine ulaşır. Aşağıdaki il ve ilçelerde aktif GES temizlik hizmeti veriyoruz."
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceAreas.map((area, i) => (
              <div key={i} className="section-card" style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.03em' }}>{area.il}</h3>
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0, paddingLeft: '23px' }}>{area.ilceler}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Listede yer almayan bölgeler için{' '}
            <TrackedLink href="tel:+905304738793" event="phone_click" params={{ location: 'panel_temizlik_bolge' }} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>bizi arayın</TrackedLink>
            {' '}— Türkiye&apos;nin her bölgesindeki GES sahalarına saha keşfi yaparak hizmet sunabiliyoruz.
          </p>
        </div>
      </section>

      {/* SSS */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Merak Edilenler"
              title="Güneş Paneli Temizliği Hakkında SSS"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>
    </>
  )
}
