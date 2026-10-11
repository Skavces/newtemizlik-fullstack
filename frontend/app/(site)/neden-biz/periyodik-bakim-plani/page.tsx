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
  title: 'Periyodik Bakım Planı | New Temizlik',
  description: 'Mevsimsel tozlanma verilerine göre optimize edilmiş yıllık bakım sözleşmeleriyle GES santralinizin bakım takvimini önceden garanti altına alıyoruz.',
  canonical: '/neden-biz/periyodik-bakim-plani',
  image: '/planlama.jpg',
  imageAlt: 'GES santrali için yıllık bakım planlaması',
  imageWidth: 1200,
  imageHeight: 800,
})

const features = [
  'Bölgesel tozlanma ve iklim verisine göre optimize edilmiş takvim',
  'Yıllık bakım sözleşmesiyle sabit fiyat garantisi',
  'Sözleşmeli müşterilere öncelikli randevu ve hızlı müdahale',
  'Sezon öncesi ve sonrası kontrol ziyaretleri',
  'Sahaya özel bakım planı ve doküman arşivi',
  'Değişen hava koşullarına göre esnek yeniden planlama',
]

const detailBlocks = [
  { title: "Sahanın Verisiyle Başlıyoruz", text: "Konumu, çevredeki kirlilik kaynaklarını (tarım, sanayi, yol), panel dizilimini ve geçmiş üretim verisini inceleriz. Plan, genel bir şablon değil sahanın kendi ritmine göre çıkar." },
  { title: "Mevsime Göre Takvim", text: "Bahar çiçeklenme ve polen, yaz yağışsız aylarda toz birikimi, sonbahar hasat ve tarım tozu dönemleridir. Verimin en değerli olduğu aylar öne alınır, sezon öncesi ve sonrası kontrol ziyaretleri takvime eklenir." },
]

const faqs = [
  { question: "Yılda kaç kez temizlik gerekir?", answer: "Maksimum verim için genel öneri yılda en az iki kez temizliktir. Yoğun kirlilik bölgelerinde bu sıklık artar; sahanıza özel takvimi plan aşamasında belirliyoruz." },
  { question: "Yıllık sözleşmede fiyat sabit mi?", answer: "Evet. Yıllık sözleşmeli müşterilerimize sabit fiyat ve öncelikli müdahale sunuyoruz; böylece bakım önceden planlanmış bir kalem olur." },
  { question: "Plan sahaya özel mi hazırlanıyor?", answer: "Evet. Bölgesel tozlanma ve iklim verisine, sahanın yapısına göre size özel bir plan çıkarıyoruz." },
  { question: "Hava koşulları değişirse plan değişir mi?", answer: "Takvim esnektir. Değişen hava koşullarına göre uygulamayı yeniden planlıyoruz." },
]

const faqSchema = buildFaqSchema(faqs)

export default function PeriyodikBakimPlaniPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Periyodik Bakım Planı', item: `${SITE_URL}/neden-biz/periyodik-bakim-plani` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        title="Periyodik Bakım Planı"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Periyodik Bakım Planı' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/planlama.jpg"
                alt="GES santrali için yıllık bakım planlaması"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Neden Biz"
                title="Mevsimsel Veriye Dayalı Bakım Takvimi"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Her bölgenin tozlanma hızı ve iklimi farklıdır. Bu yüzden tek tip bir takvim yerine,
                sahanızın verilerine göre optimize edilmiş, size özel bir yıllık bakım planı hazırlıyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Yıllık sözleşmeli müşterilerimize
                <strong style={{ color: 'var(--text-primary)' }}> sabit fiyat ve öncelikli müdahale garantisi</strong> sunuyoruz —
                bakım artık sürpriz bir maliyet değil, önceden planlanmış bir süreç oluyor.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>2x</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>maksimum verim için önerilen minimum yıllık temizlik sıklığı</span>
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
                params={{ location: 'neden_biz_bakim' }}
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
            <SectionHeader eyebrow="Planlama" title="Bakım Planı Nasıl Hazırlanır?" titleSize="clamp(24px, 3.5vw, 34px)" />
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
            Mevsimlere göre temizlik zamanlamasını blog yazımızda ayrıntılı anlattık.{' '}
            <Link href="/blog/gunes-paneli-temizligi-ne-zaman-yapilmali" className="hover-brand" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              Yazıyı okuyun →
            </Link>
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <SectionHeader eyebrow="Merak Edilenler" title="Bakım Planı Hakkında Merak Edilenler" titleSize="clamp(22px, 3vw, 30px)" />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <RelatedLinks
        eyebrow="Keşfedin"
        title="İlgili Sayfalar"
        background="var(--bg-alt)"
        links={[
          { title: "GES Panel Temizlik Hizmeti", desc: "Planlı temizliğin uygulandığı hizmet sayfası.", href: "/hizmetlerimiz/panel-temizlik" },
          { title: "Panel Bakım ve İzleme", desc: "Termal analiz ve performans izleme ile bakımı tamamlayın.", href: "/hizmetlerimiz/panel-bakim" },
          { title: "Veri Odaklı ROI Analizi", desc: "Her temizliğin üretime etkisini raporlarla görün.", href: "/neden-biz/veri-odakli-roi-analizi" },
        ]}
      />

      <CtaBand title="Sahanıza özel bakım planı için bize ulaşın" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
