import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle, MapPin } from 'lucide-react'
import HeroQuoteForm from '@/components/sections/HeroQuoteForm'
import FaqAccordion from '@/components/ui/FaqAccordion'
import JsonLd from '@/components/ui/JsonLd'
import PageHero from '@/components/ui/PageHero'
import RelatedLinks from '@/components/ui/RelatedLinks'
import SectionHeader from '@/components/ui/SectionHeader'
import { getServiceContent } from '@/content/hizmetler'
import type { TitledText } from '@/content/hizmetler/types'
import { AREA_SERVED_TEMIZLIK, buildServiceBreadcrumb, buildServiceSchema } from '@/lib/schema'
import { buildFaqSchema, buildMetadata } from '@/lib/seo'
import { getService, getTemplateServices, servicePath } from '@/lib/services'

// Listede olmayan slug 404 döner; özel sayfası olan GES hizmetleri kendi klasöründe.
export const dynamicParams = false

export function generateStaticParams() {
  return getTemplateServices().map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

function loadPage(slug: string) {
  const service = getService(slug)
  const content = getServiceContent(slug)
  if (!service || service.customPage || !content) notFound()
  return { service, content }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { service, content } = loadPage(slug)
  return buildMetadata({
    title: content.title,
    description: content.description,
    canonical: servicePath(service),
  })
}

const SECTION_INNER = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-12'
const SUB_TITLE_SIZE = 'clamp(24px, 3.5vw, 34px)'
const cardTitle: CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.03em' }
const cardText: CSSProperties = { fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }

function CardGrid({ items, columns }: { items: TitledText[]; columns: 'md:grid-cols-2' | 'md:grid-cols-3' }) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {items.map((item) => (
        <div key={item.title} className="section-card" style={{ padding: '26px 24px' }}>
          <h3 style={cardTitle}>{item.title}</h3>
          <p style={cardText}>{item.text}</p>
        </div>
      ))}
    </div>
  )
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const { service, content } = loadPage(slug)
  const path = servicePath(service)

  const relatedLinks = content.related.flatMap(({ slug: relatedSlug, desc }) => {
    const related = getService(relatedSlug)
    return related ? [{ title: related.name, desc, href: servicePath(related) }] : []
  })

  return (
    <>
      <JsonLd data={buildServiceBreadcrumb(service.name, path)} />
      <JsonLd
        data={buildServiceSchema({
          name: content.schemaName,
          alternateName: content.alternateNames,
          description: content.description,
          path,
          areaServed: AREA_SERVED_TEMIZLIK,
        })}
      />
      <JsonLd data={buildFaqSchema(content.faqs)} />

      <PageHero
        title={content.h1}
        image="temizlik-banner.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: service.name },
        ]}
      />

      {/* Giriş ve kapsam */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className={SECTION_INNER}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '16/10' }}>
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader eyebrow={content.eyebrow} title={content.heading} titleSize="clamp(26px, 3.5vw, 38px)" align="left" />
              {content.intro.map((paragraph) => (
                <p key={paragraph} style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '56px' }}>
            <h2 className="section-heading" style={{ fontSize: SUB_TITLE_SIZE, marginBottom: '24px' }}>{content.includesTitle}</h2>
            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-3">
              {content.includes.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle aria-hidden="true" size={16} style={{ color: 'var(--color-primary)', marginTop: '4px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '22px', padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderRadius: '8px', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {content.includesNote}
            </p>
          </div>
        </div>
      </section>

      {/* Süreç */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className={SECTION_INNER}>
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Süreç" title={content.processTitle} titleSize={SUB_TITLE_SIZE} />
          </div>
          <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.process.map((step, index) => (
              <li key={step.title} className="section-card" style={{ padding: '26px 24px' }}>
                <span aria-hidden="true" style={{ display: 'block', fontFamily: "'Rajdhani', sans-serif", fontSize: '26px', fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1, marginBottom: '12px' }}>
                  {index + 1}
                </span>
                <h3 style={cardTitle}>{step.title}</h3>
                <p style={cardText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Hizmete özgü dikkat noktaları */}
      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className={SECTION_INNER}>
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Bilmeniz Gerekenler" title={content.notesTitle} titleSize={SUB_TITLE_SIZE} />
          </div>
          <CardGrid items={content.notes} columns={content.notes.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'} />
        </div>
      </section>

      {/* Pratik bilgi */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className={SECTION_INNER}>
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Pratik Bilgi" title={content.guideTitle} titleSize={SUB_TITLE_SIZE} />
          </div>
          <CardGrid items={content.guide} columns="md:grid-cols-2" />
        </div>
      </section>

      {/* Kimler için */}
      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className={SECTION_INNER}>
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Kimler İçin" title={content.forWhomTitle} titleSize={SUB_TITLE_SIZE} />
          </div>
          <CardGrid items={content.forWhom} columns={content.forWhom.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'} />
        </div>
      </section>

      {/* Neden biz */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className={SECTION_INNER}>
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Farkımız" title={content.whyUsTitle} titleSize={SUB_TITLE_SIZE} />
          </div>
          <CardGrid items={content.whyUs} columns="md:grid-cols-2" />
        </div>
      </section>

      {/* Hizmet bölgesi */}
      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className={`${SECTION_INNER} text-center`}>
          <SectionHeader eyebrow="Hizmet Bölgesi" title="Hangi Bölgelere Geliyoruz?" titleSize={SUB_TITLE_SIZE} lead={content.areaText} />
          <ul className="flex flex-wrap justify-center gap-3" style={{ marginTop: '24px' }}>
            {AREA_SERVED_TEMIZLIK.map((place) => (
              <li key={place.name} className="section-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <MapPin aria-hidden="true" size={15} style={{ color: 'var(--color-primary)' }} />
                {place.name}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '24px', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Büyük kurumsal işlerde Türkiye genelinde de görüşebiliriz,{' '}
            <Link href="/iletisim" className="hover-brand" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>iletişime geçin</Link>.
          </p>
        </div>
      </section>

      {/* SSS */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <SectionHeader eyebrow="Sık Sorulan Sorular" title={`${service.name} Hakkında`} titleSize={SUB_TITLE_SIZE} />
          </div>
          <FaqAccordion faqs={content.faqs} />
        </div>
      </section>

      {/* Teklif formu */}
      <section id="teklif" style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-8">
            <SectionHeader eyebrow="Teklif Alın" title={`${service.name} İçin Teklif Alın`} titleSize={SUB_TITLE_SIZE} />
          </div>
          <HeroQuoteForm defaultService={service.slug} />
        </div>
      </section>

      <RelatedLinks eyebrow="Diğer Hizmetler" title="Bunlar da İlginizi Çekebilir" links={relatedLinks} background="var(--bg-alt)" />
    </>
  )
}
