import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ServiceCard from '@/components/ui/ServiceCard'
import { getServicesByCategory } from '@/lib/services'

export default function Services() {
  const services = getServicesByCategory('ges')

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
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
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
