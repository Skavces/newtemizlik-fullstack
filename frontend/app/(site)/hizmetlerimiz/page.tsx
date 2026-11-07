import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import ServiceCard from '@/components/ui/ServiceCard'
import { buildMetadata } from '@/lib/seo'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { getServicesByCategory } from '@/lib/services'

export const metadata = buildMetadata({
  title: 'Hizmetlerimiz | GES Temizlik ve Bakım | New Temizlik',
  description: 'Panel temizlik hizmeti, bakım & onarım izleme ve temizlik robot satışı. Güneş enerji santralleriniz için profesyonel çözümler.',
  canonical: '/hizmetlerimiz',
  imageAlt: 'New Temizlik GES temizlik ve bakım hizmetleri logosu',
})

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
])

export default function HizmetlerimizPage() {
  const services = getServicesByCategory('ges')

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Hizmetlerimiz"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz' },
        ]}
      />

      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12">

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

        </div>
      </section>
    </>
  )
}
