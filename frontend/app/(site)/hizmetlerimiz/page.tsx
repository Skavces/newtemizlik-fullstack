import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Hizmetlerimiz | GES Temizlik ve Bakım | New Temizlik',
  description: 'Panel temizlik hizmeti, bakım & onarım izleme ve temizlik robot satışı. Güneş enerji santralleriniz için profesyonel çözümler.',
  canonical: '/hizmetlerimiz',
  imageAlt: 'New Temizlik GES temizlik ve bakım hizmetleri logosu',
})

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
  ],
}

const services = [
  {
    title: 'Panel Temizlik Hizmeti',
    description: 'Özel ekipmanlar ve uygun temizlik yöntemleri kullanarak güneş panellerinin yüzey temizliğini gerçekleştiriyoruz. Düzenli temizlik, panel veriminin korunmasına ve üretim kayıplarının azaltılmasına yardımcı olur.',
    img: '/endustriyel-gunes-paneli-yikama.webp',
    alt: 'GES sahasında profesyonel güneş paneli temizlik çalışması',
    path: '/hizmetlerimiz/panel-temizlik',
  },
  {
    title: 'Panel Bakım & Onarım İzleme',
    description: 'Santral üretim verilerini inceleyerek performans düşüşlerini tespit ediyoruz. Planlı bakım ve kontroller ile sistemin düzenli ve verimli çalışmasına destek oluyoruz.',
    img: '/soma-gunes-enerjisi-santrali-uzman-bakim.webp',
    alt: 'Güneş enerjisi santralinde bakım ve performans kontrol çalışması',
    path: '/hizmetlerimiz/panel-bakim',
  },
  {
    title: 'Temizlik Robot Makina Satışı',
    description: 'Büyük ölçekli güneş enerji santralleri için panel temizlik robotları sunuyoruz. Otomatik temizlik sistemleri ile bakım süreçleri hızlanır ve iş gücü ihtiyacı azalır.',
    img: '/soma-ges-otonom-temizlik-robotu.webp',
    alt: 'GES sahasında kullanılan panel temizlik robotu',
    path: '/hizmetlerimiz/robot-satisi',
  },
]

export default function HizmetlerimizPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Hizmetlerimiz"
        image="solar-panel.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz' },
        ]}
      />

      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="text-center mb-14">
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
              Hizmetlerimiz
            </span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
              GES Bakım ve Panel Temizlik Hizmetleri
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', maxWidth: '560px', margin: '14px auto 0', lineHeight: 1.7 }}>
              Güneş enerji santrallerinde panel temizliği, bakım ve performans takibi hizmetleri sunuyoruz.
            </p>
            <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-7">
            {services.map((service, i) => (
              <div key={i} className="section-card overflow-hidden flex flex-col">
                <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '10px 10px 0 0', aspectRatio: '16/10' }}>
                  <Image
                    src={service.img}
                    alt={service.alt}
                    title={service.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="collage-img object-cover"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', flex: 1 }}>
                    {service.description}
                  </p>
                  <Link
                    href={service.path}
                    className="detay-link inline-flex items-center gap-2 mt-6 font-semibold transition-colors duration-200"
                    style={{ fontSize: '13px', color: '#7FBF3A' }}
                  >
                    Detaylı Bilgi
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
