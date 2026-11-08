import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import ServiceCard from '@/components/ui/ServiceCard'
import { buildMetadata } from '@/lib/seo'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { getServicesByCategory, SERVICE_CATEGORIES } from '@/lib/services'

export const metadata = buildMetadata({
  title: 'Hizmetlerimiz | Temizlik ve GES Bakımı | New Temizlik',
  description: 'Soma ve Manisa çevresinde ev, iş yeri ve kurum temizliği; Türkiye genelinde güneş paneli temizliği, GES bakımı ve temizlik robotu satışı.',
  canonical: '/hizmetlerimiz',
  imageAlt: 'New Temizlik temizlik ve GES bakım hizmetleri logosu',
})

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
])

// Temizlik önce: eski .com.tr'nin /hizmetler trafiği 301 ile buraya gelecek ve
// temizlik arıyor. Yayında hizmeti olmayan bölüm hiç gösterilmez.
const sections = [
  {
    category: 'temizlik' as const,
    title: 'Ev, İş Yeri ve Kurum Temizliği',
    lead: 'Soma ve Manisa çevresinde ev, iş yeri ve kurumlar için profesyonel temizlik hizmetleri sunuyoruz. Türkiye genelindeki büyük kurumsal işler için bizimle iletişime geçin.',
    gridClass: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
  {
    category: 'ges' as const,
    title: 'GES Bakım ve Panel Temizlik Hizmetleri',
    lead: 'Güneş enerji santrallerinde panel temizliği, bakım ve performans takibi hizmetleri sunuyoruz.',
    gridClass: 'sm:grid-cols-2 lg:grid-cols-4',
  },
]
  .map((section) => ({ ...section, services: getServicesByCategory(section.category) }))
  .filter((section) => section.services.length > 0)

export default function HizmetlerimizPage() {
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

      {sections.map((section, index) => (
        <section
          key={section.category}
          id={SERVICE_CATEGORIES[section.category].anchor}
          className="scroll-mt-20 md:scroll-mt-28"
          style={{ background: index % 2 === 0 ? 'var(--bg-alt)' : 'var(--bg-body)', padding: '80px 0' }}
        >
          <div className="max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12">

            <div className="text-center mb-14 max-w-2xl mx-auto">
              <SectionHeader
                eyebrow={SERVICE_CATEGORIES[section.category].label}
                title={section.title}
                lead={section.lead}
              />
            </div>

            <div className={`grid gap-7 ${section.gridClass}`}>
              {section.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>

          </div>
        </section>
      ))}
    </>
  )
}
