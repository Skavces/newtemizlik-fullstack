import PageHero from '@/components/ui/PageHero'
import SSS from '@/components/sections/SSS'
import CtaBand from '@/components/ui/CtaBand'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { getFaqs } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Sıkça Sorulan Sorular: GES Temizliği | New Temizlik',
  description: 'Güneş paneli temizliği, GES bakım hizmetleri ve temizlik robotu hakkında merak edilen soruların cevapları. New Temizlik SSS sayfası.',
  canonical: '/sss',
  imageAlt: 'New Temizlik GES panel temizliği sıkça sorulan sorular logosu',
})

export default async function SSSPage() {
  const faqs = await getFaqs('genel')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Sıkça Sorulan Sorular', item: `${SITE_URL}/sss` },
    ],
  }

  // FAQPage şeması artık accordion'u besleyen aynı backend verisinden üretilir
  // — eski sitede 8 yerde elle kopyalanan S.S.S. metinleri tek kaynağa indi.
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
      <JsonLd data={faqSchema} />

      <PageHero
        title="S.S.S."
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'S.S.S.' },
        ]}
      />

      <SSS faqs={faqs} />

      <CtaBand
        title="Panellerin neden kirlendiğini ve nasıl temizlendiğini mi merak ediyorsunuz?"
        href="/panel-kirlilik-rehberi"
        label="Rehberi İnceleyin"
        background="var(--bg-alt)"
      />
    </>
  )
}
