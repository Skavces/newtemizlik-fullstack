import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getReferences } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Referanslarımız | Güvenilir GES Temizlik Hizmeti | New Temizlik',
  description: 'New Temizlik olarak hizmet verdiğimiz kurumsal referanslarımız. Halkbank, Albayrak, Gezgin Enerji ve daha birçok sektör lideri firma ile çalışıyoruz.',
  canonical: '/referanslarimiz',
  imageAlt: 'New Temizlik GES temizlik hizmetleri kurumsal logosu',
})

export default async function ReferanslarPage() {
  const references = await getReferences()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Referanslarımız', item: `${SITE_URL}/referanslarimiz` },
    ],
  }

  // Eski sitede yoktu — backend'den gerçek referans listesi geldiği için artık
  // bedava bir SEO kazancı (bkz. plan Faz 2).
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: references.length,
    itemListElement: references.map((ref, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ref.name,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <PageHero
        title="Referanslarımız"
        image="solar-panel.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Referanslarımız' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
              Referanslar
            </span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
              Bize Güvenen Markalar
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', maxWidth: '480px', margin: '14px auto 0', lineHeight: 1.7 }}>
              Sektörün öncü firmalarıyla birlikte çalışarak güvenilir hizmet anlayışımızı kanıtlıyoruz.
            </p>
            <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
          </div>
        </div>

        <div
          className="max-w-screen-xl mx-auto px-5 sm:px-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px',
          }}
        >
          {references.map((ref) => {
            const scale = Number(ref.scale)
            return (
              <div
                key={ref.id}
                className="section-card flex flex-col items-center justify-center p-4 gap-3"
                style={{ aspectRatio: '4/3' }}
              >
                {ref.logo && (
                  <div style={{ position: 'relative', width: '80%', height: '65%' }}>
                    <Image
                      src={ref.logo}
                      alt={`${ref.name} Logosu`}
                      fill
                      sizes="160px"
                      className="object-contain transition-all duration-300"
                      style={{ transform: scale && scale !== 1 ? `scale(${scale})` : undefined }}
                    />
                  </div>
                )}
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>
                  {ref.name}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
