import PageHero from '@/components/ui/PageHero'
import KirProblemleri from '@/components/sections/KirProblemleri'
import CtaBand from '@/components/ui/CtaBand'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'GES Paneli Neden Kirlenir? Kirlilik Rehberi | New Temizlik',
  description: 'GES panellerinde kirlenmenin nedenleri, yol açtığı verim kaybı ve doğru temizlik yöntemleri. Panel kirliliğine karşı uzman rehberi.',
  keywords: 'panel kirliliği, ges panel kirlenmesi, güneş paneli neden kirlenir, panel verim kaybı, solar panel temizlik rehberi',
  canonical: '/panel-kirlilik-rehberi',
  imageAlt: 'GES güneş panellerinde kir ve toz birikimi',
})

export default function PanelKirlilikRehberiPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Panel Kirlilik Rehberi', item: `${SITE_URL}/panel-kirlilik-rehberi` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        title="GES Panel Kirlilik Rehberi"
        image="panel-bg.webp"
        breadcrumbs={[{ label: 'Ana Sayfa', path: '/' }, { label: 'Panel Kirlilik Rehberi' }]}
      />
      <KirProblemleri showHeader={false} />
      <CtaBand title="Panelleriniz kirlilikten verim mi kaybediyor?" href="/iletisim" label="Teklif Alın" />
    </>
  )
}
