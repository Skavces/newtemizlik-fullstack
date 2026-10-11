import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import CtaBand from '@/components/ui/CtaBand'
import RelatedLinks from '@/components/ui/RelatedLinks'
import FaqAccordion from '@/components/ui/FaqAccordion'
import Link from 'next/link'
import { buildFaqSchema, buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Veri Odaklı ROI Analizi | New Temizlik',
  description: 'GES temizliği öncesi ve sonrası inverter verileriyle üretim artışını ölçüyor, yatırımınızın geri dönüşünü somut rakamlarla raporluyoruz.',
  canonical: '/neden-biz/veri-odakli-roi-analizi',
  image: '/ges-bakim-onarim-termal-analiz.webp',
  imageAlt: 'GES santralinde inverter verisi ile performans analizi',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Temizlik öncesi ve sonrası inverter üretim verisi karşılaştırması',
  'kWh bazında somut verim artışı raporu',
  'Sahaya özel yatırım geri dönüş (ROI) hesaplaması',
  'Aylık ve yıllık performans göstergesi (KPI) takibi',
  'Dijital, arşivlenebilir raporlama',
  'Yıllara yayılan trend analiziyle veriye dayalı bakım kararları',
]

const detailBlocks = [
  { title: "Öncesi ve Sonrası Karşılaştırma", text: "Temizlikten önceki inverter üretim verisini kaydeder, temizlik sonrasında karşılaştırılabilir koşullarda ölçüm alırız. Güneşlenme farkı gibi etkenleri göz önünde bulundurarak artışı kWh bazında hesaplarız." },
  { title: "Rapor Kararlarınıza Yön Verir", text: "Rapor; bir sonraki temizliğin ne zaman yapılacağını, temizlik sıklığının yeterli olup olmadığını ve kaybın kirlilikten mi başka bir arızadan mı kaynaklandığını anlamanıza yardımcı olur." },
]

const faqs = [
  { question: "Verim artışını hangi veriye dayandırıyorsunuz?", answer: "Santralinizin inverter üretim verisine. Temizlik öncesi ve sonrası değerleri karşılaştırarak kazancı kWh bazında raporluyoruz." },
  { question: "Temizlik kendini ne kadar sürede amorti eder?", answer: "Bu süre sahanın kirlilik yüküne, panel kapasitesine ve temizlik sıklığına göre değişir. Sabit bir süre vaat etmiyoruz; raporlar sizin sahanız için gerçek geri dönüşü gösterir." },
  { question: "Raporları ne sıklıkla alırım?", answer: "Temizlik sonrası karşılaştırma raporunun yanında aylık ve yıllık performans göstergelerini (KPI) takip ediyoruz." },
  { question: "Raporlar arşivlenebilir mi?", answer: "Evet. Raporlar dijital ve arşivlenebilir biçimde teslim edilir; yıllar içinde trend analizi yapmanıza olanak tanır." },
]

const faqSchema = buildFaqSchema(faqs)

export default function VeriOdakliRoiAnaliziPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Veri Odaklı ROI Analizi', item: `${SITE_URL}/neden-biz/veri-odakli-roi-analizi` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        title="Veri Odaklı ROI Analizi"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Veri Odaklı ROI Analizi' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/ges-bakim-onarim-termal-analiz.webp"
                alt="GES santralinde inverter verisi ile performans analizi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Yatırımınızın Karşılığını Rakamlarla Görün"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                GES temizliğinin gerçek değeri, sonrasında ölçülen üretim artışında ortaya çıkar.
                Biz her sahada temizlik öncesi ve sonrası inverter verilerini karşılaştırarak
                işlemin santralinize kaç kWh kazandırdığını somut biçimde gösteriyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Bu sayede temizlik bir gider kalemi olmaktan çıkıp,
                <strong style={{ color: 'var(--text-primary)' }}> geri dönüşü izlenebilir bir yatırım</strong> haline
                gelir. Raporlarımız, bir sonraki bakım kararınızı veriye dayandırmanızı sağlar.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%30&apos;a kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>verim kaybını raporlarla görünür kılıyoruz</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-primary)', marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <TrackedLink
                href="tel:+905304738793"
                event="phone_click"
                params={{ location: 'neden_biz_roi' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <SectionHeader eyebrow="Ölçüm" title="Verim Artışını Nasıl Ölçüyoruz?" titleSize="clamp(24px, 3.5vw, 34px)" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {detailBlocks.map((b) => (
              <div key={b.title} className="section-card" style={{ padding: '28px 26px', cursor: 'default' }}>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '0.02em' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '14.5px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{b.text}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '14.5px', lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '28px', textAlign: 'center' }}>
            Kirliliğin üretimi ne kadar düşürdüğünü blog yazımızda inceledik.{' '}
            <Link href="/blog/kirli-gunes-paneli-verim-kaybi" className="hover-brand" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              Yazıyı okuyun →
            </Link>
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <SectionHeader eyebrow="Merak Edilenler" title="Raporlama Hakkında Merak Edilenler" titleSize="clamp(22px, 3vw, 30px)" />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <RelatedLinks
        eyebrow="Keşfedin"
        title="İlgili Sayfalar"
        background="var(--bg-alt)"
        links={[
          { title: "Panel Bakım ve İzleme", desc: "Performans düşüşünün nedenini termal analizle tespit edin.", href: "/hizmetlerimiz/panel-bakim" },
          { title: "Periyodik Bakım Planı", desc: "Rapor verilerine göre optimize edilmiş bakım takvimi.", href: "/neden-biz/periyodik-bakim-plani" },
          { title: "GES Panel Temizlik Hizmeti", desc: "Verim kaybını gidermeye yönelik temizlik hizmeti.", href: "/hizmetlerimiz/panel-temizlik" },
        ]}
      />

      <CtaBand title="Santralinizin verim potansiyelini birlikte analiz edelim" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
