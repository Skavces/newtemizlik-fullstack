import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Service {
  title: string
  description: string
  img: string
  alt: string
  path: string
}

const services: Service[] = [
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
  {
    title: 'Ot Temizliği',
    description: 'GES sahalarında panel altı ve aralarında oluşan ot ve bitki örtüsünü düzenli olarak temizliyoruz. Gölgelenmeyi, yangın riskini ve haşere üremesini önleyerek saha güvenliğini koruyoruz.',
    img: '/gesottemizligi.webp',
    alt: 'GES sahasında ot temizliği çalışması',
    path: '/hizmetlerimiz/ot-temizligi',
  },
]

export default function Services() {
  return (
    <section id="hizmetlerimiz" className="scroll-mt-16 md:scroll-mt-20 pt-24 pb-10 md:pt-32 md:pb-14" style={{ background: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background — solar/wind line art, sol altta */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: '-80px',
          width: 'min(75vw, 900px)',
          pointerEvents: 'none', zIndex: 0,
        }}
      >
        <Image
          src="/banner-bg2.png"
          alt=""
          width={639}
          height={565}
          style={{ width: '100%', height: 'auto', opacity: 0.8 }}
        />
      </div>

      <div className="max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>

        <div className="text-center mb-14 max-w-2xl mx-auto">
          <SectionHeader
            eyebrow="Hizmetlerimiz"
            title="GES Bakım ve Panel Temizlik Hizmetleri"
            lead="Güneş enerji santrallerinde panel temizliği, bakım ve performans takibi hizmetleri sunuyoruz."
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
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
                  style={{ fontSize: '13px', color: 'var(--color-secondary)' }}
                >
                  Detaylı Bilgi
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '48px' }}>
          <Link href="/hizmetlerimiz" className="cta-button">
            Tüm Hizmetlerimiz <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}
