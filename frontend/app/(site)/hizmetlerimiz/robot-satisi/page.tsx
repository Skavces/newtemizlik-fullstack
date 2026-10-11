import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Bot, Gamepad2, Wrench, Droplets, ClipboardList, FileText, Truck, GraduationCap, LifeBuoy } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import FaqAccordion from '@/components/ui/FaqAccordion'
import JsonLd from '@/components/ui/JsonLd'
import TrackedLink from '@/components/ui/TrackedLink'
import ProductGallery from '@/components/sections/ProductGallery'
import RelatedLinks from '@/components/ui/RelatedLinks'
import { buildFaqSchema, buildMetadata, ORGANIZATION_ID, SITE_URL } from '@/lib/seo'
import { getFaqs } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'GES Panel Temizlik Robotu ve Makina Satışı | New Temizlik',
  description: 'GES solar panel temizlik robotu ve makina satışı. Büyük santraller için otonom, IoT destekli, uzaktan yönetilebilen panel yıkama sistemleri.',
  ogTitle: 'GES Solar Panel Temizlik Robotu Satışı | New Temizlik',
  canonical: '/hizmetlerimiz/robot-satisi',
  image: '/soma-ges-otonom-temizlik-robotu.webp',
  imageAlt: 'GES sahasında otonom solar panel temizlik robotu çalışma görüntüsü',
  imageWidth: 1200,
  imageHeight: 800,
})

const productPhotos = [
  { src: '/ges-panel-temizlik-robotu-saha-uygulamasi.webp', alt: 'GES panel temizlik robotu saha uygulaması' },
  { src: '/ges-panel-temizlik-robotu-saha-calismasi.webp', alt: 'GES panel temizlik robotu saha çalışması' },
  { src: '/ges-otonom-temizlik-robotu-ray-sistemi.webp', alt: 'GES otonom temizlik robotu ray sistemi' },
  { src: '/leopardust-ges-panel-temizlik-robotu-saha.webp', alt: 'LeopardDust GES panel temizlik robotu sahada' },
  { src: '/gunes-enerjisi-santrali-otomatik-ray-temizlik-sistemi.webp', alt: 'Güneş enerjisi santrali otomatik ray temizlik sistemi' },
  { src: '/gunes-paneli-manuel-temizlik-fircasi-makinasi.webp', alt: 'Güneş paneli manuel temizlik fırçası makinası' },
  { src: '/gunes-paneli-cift-diskli-elektrikli-temizlik-fircasi.webp', alt: 'Güneş paneli çift diskli elektrikli temizlik fırçası' },
  { src: '/gunes-paneli-uzatmali-cift-fircali-temizlik-makinasi.webp', alt: 'Güneş paneli uzatmalı çift fırçalı temizlik makinası' },
  { src: '/gunes-paneli-elektrikli-temizlik-fircasi-seri-uretim.webp', alt: 'Güneş paneli elektrikli temizlik fırçası seri üretim' },
  { src: '/ges-panel-temizlik-makinasi-cesitleri.webp', alt: 'GES panel temizlik makinası çeşitleri' },
  { src: '/gunes-paneli-sulama-temizlik-boru-sistemi.webp', alt: 'Güneş paneli sulama temizlik boru sistemi' },
  { src: '/ges-temizlik-robotu-urun-aksesuarlari.webp', alt: 'GES temizlik robotu ürün aksesuarları' },
  { src: '/ges-temizlik-robotu-uzaktan-kumandali-ozellikler.webp', alt: 'GES temizlik robotu uzaktan kumandalı özellikler' },
]

const features = [
  'Su israfı yapmadan minimum su tüketimiyle etkili temizlik',
  'Uzaktan izleme ve kontrol paneli (IoT entegrasyonu)',
  'Saha koşullarına göre özelleştirilebilir ray sistemleri',
  'Düşük işletme maliyeti ve yüksek temizlik kapasitesi',
  'Kurulum, operatör eğitimi ve 2 yıl teknik destek garantisi',
  'Büyük ölçekli sahalar için maliyet-etkin otomasyon çözümü',
]

const systems = [
  {
    icon: Bot,
    title: 'Otonom Ray Sistemli Robot',
    fit: 'Büyük, düzenli dizilimli arazi santralleri',
    desc: 'Panel sıraları boyunca saha geometrisine göre kurulan ray üzerinde ilerler; uzaktan izlenir ve programlanır. Operatör bağımlılığı en düşük çözümdür.',
  },
  {
    icon: Gamepad2,
    title: 'Uzaktan Kumandalı Robot',
    fit: 'Ray kurulumunun mümkün olmadığı veya dizilimin düzensiz olduğu sahalar',
    desc: 'Operatör tarafından kumandayla yönlendirilir, bir sıradan diğerine taşınabilir. Esnek kullanım gerektiren sahalar için uygundur.',
  },
  {
    icon: Wrench,
    title: 'Elektrikli Fırça Makinaları',
    fit: 'Orta ölçekli arazi ve çatı santralleri',
    desc: 'Çift diskli ve uzatmalı çift fırçalı modeller, manuel temizliğe göre hızlı ve daha az yorucu çalışma sağlar. Tek operatörle kullanılabilir.',
  },
  {
    icon: Droplets,
    title: 'Sulama ve Boru Sistemi',
    fit: 'Fırça makinalarıyla birlikte, su tarafının yönetildiği sahalar',
    desc: 'Kontrollü su sarfiyatı sağlayan boru ve sulama ekipmanları. Temizliği panel yüzeyine zarar vermeden, düşük su kullanımıyla destekler.',
  },
]

const purchaseSteps = [
  { icon: ClipboardList, title: 'Saha Keşfi', desc: 'Santralin büyüklüğünü, panel dizilimini ve zemin koşullarını birlikte inceleriz.' },
  { icon: FileText, title: 'Sistem Seçimi ve Teklif', desc: 'Sahaya uygun robot ya da makina çözümünü belirler, kapsamı netleştirip teklif sunarız.' },
  { icon: Truck, title: 'Kurulum ve Teslimat', desc: 'Gerekli ise ray sistemi dahil olmak üzere kurulumu sahada gerçekleştiririz.' },
  { icon: GraduationCap, title: 'Operatör Eğitimi', desc: 'Ekibiniz sistemi güvenle ve verimli kullanabilmesi için sahada eğitilir.' },
  { icon: LifeBuoy, title: 'Teknik Destek', desc: '2 yıl teknik destek ile satış sonrasında da yanınızdayız.' },
]

const areaServedSchema = [
  { '@type': 'City', name: 'Soma' },
  { '@type': 'City', name: 'Akhisar' },
  { '@type': 'City', name: 'Kırkağaç' },
  { '@type': 'AdministrativeArea', name: 'Manisa' },
  { '@type': 'AdministrativeArea', name: 'İzmir' },
  { '@type': 'AdministrativeArea', name: 'Balıkesir' },
  { '@type': 'AdministrativeArea', name: 'Kütahya' },
  { '@type': 'Country', name: 'Türkiye' },
]

export default async function RobotSatisPage() {
  const faqs = await getFaqs('robot-satisi')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', item: `${SITE_URL}/hizmetlerimiz` },
      { '@type': 'ListItem', position: 3, name: 'Robot & Makina Satışı', item: `${SITE_URL}/hizmetlerimiz/robot-satisi` },
    ],
  }

  const faqSchema = buildFaqSchema(faqs)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GES Panel Temizlik Robotu Satışı',
    alternateName: ['GES Robot Satışı', 'Solar Panel Temizlik Robotu', 'Otonom Panel Yıkama Makinası'],
    description: 'GES solar panel temizlik robotu ve makina satışı. Büyük ölçekli güneş enerji santralleri için otonom, IoT destekli, uzaktan yönetilebilen panel yıkama sistemleri.',
    serviceType: 'GES Panel Temizlik Robotu Satışı',
    url: `${SITE_URL}/hizmetlerimiz/robot-satisi`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: areaServedSchema,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'GES Robot Satış ve Kurulum Hizmetleri',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Otonom Temizlik Robotu Satışı' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ray Sistemi Kurulumu' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Operatör Eğitimi ve Teknik Destek' } },
      ],
    },
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        title="Temizlik Robot & Makina Satışı"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Hizmetlerimiz', path: '/hizmetlerimiz' },
          { label: 'Robot & Makina Satışı' },
        ]}
      />

      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="w-full lg:w-1/2 overflow-hidden" style={{ position: 'relative', borderRadius: '16px', aspectRatio: '4/3' }}>
              <Image
                src="/soma-ges-otonom-temizlik-robotu.webp"
                alt="GES sahasında kullanılan otonom panel temizlik robotu"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Hizmet Detayı"
                title="Otonom Temizlik Teknolojileri"
                titleSize="clamp(26px, 3.5vw, 38px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '16px' }}>
                Büyük ölçekli GES sahalarında geleneksel temizlik yöntemleri hem maliyetli
                hem de zaman alıcıdır. Otonom robot sistemlerimiz bu sorunu kökten çözüyor:
                daha az insan gücü, daha az su, daha fazla verim.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '28px' }}>
                Saha geometrinize ve panel dizilimine göre özelleştirilen ray sistemi
                üzerinde hareket eden robotlarımız, uzaktan izlenebilir ve programlanabilir
                yapısıyla
                <strong style={{ color: 'var(--text-primary)' }}> 7/24 kesintisiz temizlik</strong> imkânı sunar.
              </p>

              <div
                style={{ padding: '14px 20px', background: 'rgba(1,113,189,0.08)', borderLeft: '3px solid var(--color-secondary)', borderRadius: '0 8px 8px 0', marginBottom: '28px' }}
              >
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '22px', fontWeight: 700, color: 'var(--color-secondary)' }}>%60&apos;a kadar</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '10px' }}>iş gücü tasarrufu sağlıyoruz</span>
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
                params={{ location: 'robot_satis' }}
                className="cta-button"
              >
                Teklif Al <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hangi Sistem Hangi Saha İçin ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Doğru Sistemi Seçin"
              title="Hangi Sistem Hangi Saha İçin?"
              titleSize="clamp(24px, 3.5vw, 34px)"
              lead="Her santral aynı değildir. Saha büyüklüğü, panel dizilimi ve su imkânlarına göre farklı çözümler öneriyoruz."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {systems.map((sys) => (
              <div key={sys.title} className="section-card" style={{ padding: '28px 26px', cursor: 'default' }}>
                <sys.icon size={34} style={{ color: 'var(--color-secondary)', marginBottom: '14px' }} />
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '0.02em' }}>
                  {sys.title}
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '10px' }}>
                  {sys.fit}
                </p>
                <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Satın Alma Süreci ── */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Süreç"
              title="Satın Alma Süreci Nasıl İşler?"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {purchaseSteps.map((step, i) => (
              <li key={step.title} className="section-card" style={{ padding: '24px 20px', cursor: 'default' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--color-secondary)' }}>
                  ADIM {i + 1}
                </span>
                <step.icon size={28} style={{ color: 'var(--color-primary)', margin: '10px 0 12px' }} />
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Robot mu, Hizmet mi? ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Karar Rehberi"
            title="Robot Satın Almak mı, Temizlik Hizmeti Almak mı?"
            titleSize="clamp(22px, 3vw, 30px)"
            align="left"
          />
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '18px', marginBottom: '14px' }}>
            Sürekli ve sık temizlik gereken büyük sahalarda kendi robotunuza sahip olmak uzun vadede maliyeti düşürür.
            Daha küçük santrallerde ya da yılda birkaç kez temizlik yeterliyse, ekipman yatırımı yapmadan{' '}
            <Link href="/hizmetlerimiz/panel-temizlik" className="hover-brand" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              profesyonel panel temizlik hizmeti
            </Link>{' '}
            almak daha mantıklı olabilir.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
            İki yaklaşımın maliyet ve saha büyüklüğü açısından farklarını{' '}
            <Link href="/blog/otonom-robot-mu-manuel-temizlik-mi" className="hover-brand" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              otonom robot mu, manuel temizlik mi
            </Link>{' '}
            yazımızda ayrıntılı olarak karşılaştırdık. Sahanız için hangisinin doğru olduğundan emin değilseniz keşif talebi bırakın, birlikte değerlendirelim.
          </p>
        </div>
      </section>

      {/* ── Ürün Fotoğrafları ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Ürün Galerisi"
              title="Ürünlerimizin Fotoğrafları"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>

          <ProductGallery photos={productPhotos} />
        </div>
      </section>

      {/* SSS */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader
              eyebrow="Merak Edilenler"
              title="Solar Panel Temizlik Robotu Hakkında SSS"
              titleSize="clamp(24px, 3.5vw, 34px)"
            />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <RelatedLinks
        eyebrow="Keşfedin"
        title="Bunlar da İlginizi Çekebilir"
        background="var(--bg-alt)"
        links={[
          { title: 'GES Panel Temizlik Hizmeti', desc: 'Ekipman almak yerine temizliği bize bırakın: Soma ve Türkiye genelinde profesyonel hizmet.', href: '/hizmetlerimiz/panel-temizlik' },
          { title: 'İSG ve Otonom Teknoloji', desc: 'Otonom sistemlerin sahada iş güvenliğine katkısı.', href: '/neden-biz/isg-otonom-teknoloji' },
          { title: 'Su İsrafı Yapmıyoruz', desc: 'Düşük su tüketimiyle temizlik yöntemlerimiz.', href: '/neden-biz/su-tasarrufu' },
        ]}
      />
    </>
  )
}
