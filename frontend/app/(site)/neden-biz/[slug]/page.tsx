import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle } from 'lucide-react'
import CtaBand from '@/components/ui/CtaBand'
import FaqAccordion from '@/components/ui/FaqAccordion'
import JsonLd from '@/components/ui/JsonLd'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import ServiceCard from '@/components/ui/ServiceCard'
import TrackedLink from '@/components/ui/TrackedLink'
import { getNedenBizContent, NEDEN_BIZ_TEMIZLIK } from '@/content/neden-biz'
import { buildFaqSchema, buildMetadata, SITE_URL } from '@/lib/seo'
import { getService, type ServiceEntry } from '@/lib/services'

// Listede olmayan slug 404 döner; GES "neden biz" sayfaları kendi klasöründe.
export const dynamicParams = false

export function generateStaticParams() {
  return NEDEN_BIZ_TEMIZLIK.map((c) => ({ slug: c.slug }))
}

type Props = { params: Promise<{ slug: string }> }

function loadPage(slug: string) {
  const content = getNedenBizContent(slug)
  if (!content) notFound()
  const services = content.services.map(getService).filter((s): s is ServiceEntry => Boolean(s))
  const [firstService] = services
  if (!firstService) notFound()
  // Özel görsel yoksa ilk hizmetin görseli; tüm /gorseller/*.webp dosyaları 1200x750.
  const image = content.image
    ? { width: 1200, height: 750, ...content.image }
    : { src: firstService.image, alt: firstService.imageAlt, width: 1200, height: 750 }
  return { content, services, image }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { content, image } = loadPage(slug)
  return buildMetadata({
    title: content.title,
    description: content.description,
    canonical: `/neden-biz/${content.slug}`,
    image: image.src,
    imageAlt: image.alt,
    imageWidth: image.width,
    imageHeight: image.height,
  })
}

export default async function NedenBizTemizlikPage({ params }: Props) {
  const { slug } = await params
  const { content, services, image } = loadPage(slug)
  const [paragraph1, paragraph2] = content.paragraphs

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: content.crumb, item: `${SITE_URL}/neden-biz/${content.slug}` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={buildFaqSchema(content.faqs)} />

      <PageHero
        title={content.h1}
        image="temizlik-banner.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: content.crumb },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:items-start">

            {/* Metin sütunu görselden çok uzun: görsel yukarı hizalı ve sabit header (112px) altında yapışkan. */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-36">
              <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title={content.heading}
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                {paragraph1}
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                {paragraph2}
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>{content.callout.title}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>{content.callout.text}</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {content.bullets.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-primary)', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href="tel:+905304738793"
                event="phone_click"
                params={{ location: `neden_biz_${content.trackKey}` }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <SectionHeader
              eyebrow="Hizmetlerimiz"
              title={content.servicesTitle}
              titleSize="clamp(24px, 3.5vw, 34px)"
              lead={content.servicesLead}
            />
          </div>

          <div className={`grid gap-7 sm:grid-cols-2 ${services.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <SectionHeader eyebrow="Merak Edilenler" title="Sık Sorulan Sorular" titleSize="clamp(22px, 3vw, 30px)" />
          </div>
          <FaqAccordion faqs={content.faqs} />
        </div>
      </section>

      <CtaBand title={content.cta.title} href="/iletisim" label="İletişime Geç" background="var(--bg-alt)" />
    </>
  )
}
