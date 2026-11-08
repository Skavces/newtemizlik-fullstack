import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ServiceCard from '@/components/ui/ServiceCard'
import { getFeaturedServices, getServicesByCategory, SERVICE_CATEGORIES } from '@/lib/services'

// Temizlik önce (hub sayfasıyla aynı sıra). Yayında hizmeti olmayan blok gösterilmez.
const blocks = [
  {
    category: 'temizlik' as const,
    title: 'Ev, İş Yeri ve Kurum Temizliği',
    lead: 'Soma ve Manisa çevresinde ev, iş yeri ve kurumlar için profesyonel temizlik hizmetleri sunuyoruz.',
    linkLabel: 'Tüm Temizlik Hizmetleri',
    services: getFeaturedServices('temizlik').slice(0, 4),
  },
  {
    category: 'ges' as const,
    title: 'GES Bakım ve Panel Temizlik Hizmetleri',
    lead: 'Güneş enerji santrallerinde panel temizliği, bakım ve performans takibi hizmetleri sunuyoruz.',
    linkLabel: 'Tüm GES Hizmetleri',
    services: getServicesByCategory('ges'),
  },
].filter((block) => block.services.length > 0)

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

      <div className="max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col gap-20" style={{ position: 'relative', zIndex: 1 }}>
        {blocks.map((block) => (
          <div key={block.category}>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <SectionHeader
                eyebrow={SERVICE_CATEGORIES[block.category].label}
                title={block.title}
                lead={block.lead}
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {block.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>

            <div className="text-center" style={{ marginTop: '48px' }}>
              <Link href={`/hizmetlerimiz#${SERVICE_CATEGORIES[block.category].anchor}`} className="cta-button">
                {block.linkLabel} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
