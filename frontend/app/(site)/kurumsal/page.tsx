import Image from 'next/image'
import Link from 'next/link'
import { Target, Eye, Leaf, Users, ShieldCheck, Award, ArrowRight, Search, ClipboardCheck, Wrench, FileBarChart } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import JsonLd from '@/components/ui/JsonLd'
import CtaBand from '@/components/ui/CtaBand'
import Referanslar from '@/components/sections/Referanslar'
import { buildMetadata, ORGANIZATION_ID, SITE_URL } from '@/lib/seo'
import { getReferences } from '@/lib/api'

export const metadata = buildMetadata({
  title: 'Kurumsal - GES Temizlik ve Bakım Çözümleri | New Temizlik',
  description:
    "New Temizlik hakkında: misyon, vizyon ve değerlerimiz. Soma merkezli, tüm Türkiye'ye hizmet veren endüstriyel GES temizlik ve bakım firması.",
  canonical: '/kurumsal',
  imageAlt: 'New Temizlik - GES temizlik ve bakım çözümleri kurumsal logosu',
})

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Kurumsal', item: `${SITE_URL}/kurumsal` },
  ],
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Kurumsal - New Temizlik',
  url: `${SITE_URL}/kurumsal`,
  about: { '@id': ORGANIZATION_ID },
}

const services = [
  { title: 'GES Panel Temizliği', desc: 'Endüstriyel güneş paneli yıkama; kontrollü su kullanımı ve yumuşak fırça sistemleriyle.', href: '/hizmetlerimiz/panel-temizlik' },
  { title: 'Panel Bakım ve İzleme', desc: 'Termal analiz, hotspot tespiti ve performans izleme ile arızaları erkenden yakalama.', href: '/hizmetlerimiz/panel-bakim' },
  { title: 'Robot ve Makina Satışı', desc: 'Otonom ve yarı otomatik panel temizlik sistemleri; kurulum, eğitim ve teknik destekle.', href: '/hizmetlerimiz/robot-satisi' },
  { title: 'Ot Temizliği', desc: 'Panel altı ve aralarındaki bitki örtüsünün düzenli temizliği; gölgelenme ve yangın riskine karşı.', href: '/hizmetlerimiz/ot-temizligi' },
]

const workSteps = [
  { icon: Search, title: 'Keşif', desc: 'Sahayı yerinde inceler, kirlilik türünü ve panel dizilimini belirleriz.' },
  { icon: ClipboardCheck, title: 'Planlama', desc: 'Sahaya uygun yöntemi, ekipmanı ve takvimi birlikte netleştiririz.' },
  { icon: Wrench, title: 'Uygulama', desc: 'Sertifikalı ekibimiz, iş güvenliği kurallarına uygun şekilde temizliği yürütür.' },
  { icon: FileBarChart, title: 'Raporlama', desc: 'Öncesi ve sonrası üretim karşılaştırmasını içeren raporu teslim ederiz.' },
]

const stats = [
  { value: '3 GWh', label: 'Kurumsal Referans' },
  { value: '100+', label: 'Yıkama Noktası' },
  { value: '81 İlde', label: 'Aktif Hizmet' },
  { value: '5+ Yıl', label: 'Sektör Deneyimi' },
]

const values = [
  { icon: Target, title: 'Sonuç Odaklılık', desc: 'Her projede ölçülebilir verim artışı hedefliyoruz. İşin sonunda üretim verisi konuşur.' },
  { icon: Leaf, title: 'Çevresel Sorumluluk', desc: 'Minimum su tüketimi ve su israfı yapmayan yöntemlerimizle çevreye duyarlı hizmet veriyoruz.' },
  { icon: ShieldCheck, title: 'Önce Güvenlik', desc: 'Tüm operasyonlarımız uluslararası İSG standartlarında ve tam sigorta kapsamında yürütülür.' },
  { icon: Users, title: 'Uzman Kadro', desc: 'Sertifikalı saha teknisyenleri ve deneyimli uzmanlardan oluşan ekibimiz.' },
  { icon: Award, title: 'Kalite Güvencesi', desc: 'Tüm hizmetlerimiz firmamızın kalite garantisi altında, belgelenmiş süreçlerle sunulur.' },
  { icon: Eye, title: 'Şeffaf Raporlama', desc: 'Temizlik öncesi ve sonrası üretim karşılaştırması içeren detaylı raporlar sunuyoruz.' },
]

const collageImages = [
  { src: '/endustriyel-gunes-paneli-yikama.webp', alt: 'Endüstriyel güneş paneli yıkama' },
  { src: '/soma-ges-otonom-temizlik-robotu.webp', alt: 'Otonom temizlik robotu' },
  { src: '/ges-bakim-onarim-termal-analiz.webp', alt: 'Termal analiz ve bakım' },
  { src: '/soma-gunes-enerjisi-santrali-uzman-bakim.webp', alt: 'Uzman GES bakımı' },
]

export default async function KurumsalPage() {
  const references = await getReferences()

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={aboutSchema} />

      <PageHero
        title="Kurumsal"
        image="panel-bg.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Kurumsal' },
        ]}
      />

      {/* ── Hakkımızda + Collage ── */}
      <section style={{ background: 'var(--bg-body)', padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background — solar/wind line art, anchored right */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 'min(46vw, 620px)',
            pointerEvents: 'none', zIndex: 0,
          }}
        >
          <Image
            src="/aboutbg002.png"
            alt=""
            fill
            style={{ objectFit: 'contain', objectPosition: 'right center', transform: 'translateY(170px)', opacity: 0.45 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left — text */}
            <div className="w-full lg:w-1/2">
              <SectionHeader
                eyebrow="Biz Kimiz"
                title={<>Neden Sıradan Bir <br /> Temizlik Firması Değiliz?</>}
                titleSize="clamp(26px, 3.5vw, 40px)"
                align="left"
              />
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '16px', marginTop: '20px' }}>
                Güneş enerjisi; doğru bakımla yapıldığında en kârlı yatırımlardan biridir. New Temizlik olarak
                yalnızca panel yüzeyini temizlemiyoruz; sahayı deneyimli bir bakış açısıyla inceliyor,
                verim kaynaklarını tespit ediyor ve çözüm üretiyoruz.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Tüm Türkiye genelindeki yüzlerce GES sahasında edindiğimiz tecrübeyle,
                güneş paneli temizliğini bir maliyet değil; sürdürülebilir
                bir yatırım kalemi olarak konumlandırıyoruz.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-5">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px 22px',
                      background: 'var(--bg-card)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-sm)',
                      borderLeft: '3px solid var(--color-secondary)',
                    }}
                  >
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1, marginBottom: '4px' }}>
                      {s.value}
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — collage */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-3" style={{ height: '480px' }}>
                <div className="flex flex-col gap-3">
                  <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '12px', flex: 1 }}>
                    <Image
                      src={collageImages[0].src}
                      alt={collageImages[0].alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="collage-img object-cover"
                    />
                  </div>
                  <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '12px', flex: 1 }}>
                    <Image
                      src={collageImages[1].src}
                      alt={collageImages[1].alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="collage-img object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '12px', flex: 2 }}>
                    <Image
                      src={collageImages[2].src}
                      alt={collageImages[2].alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="collage-img object-cover"
                    />
                  </div>
                  <div className="overflow-hidden" style={{ position: 'relative', borderRadius: '12px', flex: 1 }}>
                    <Image
                      src={collageImages[3].src}
                      alt={collageImages[3].alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="collage-img object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Soma'dan Türkiye'ye ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Hikâyemiz"
            title="Soma'dan Türkiye'ye"
            titleSize="clamp(24px, 3.5vw, 36px)"
            align="left"
          />
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginTop: '20px', marginBottom: '16px' }}>
            New Temizlik, Soma&apos;da başladı. Sanayi ve enerji tesislerinin çevresindeki güneş santrallerinde
            panellerin ne kadar hızlı ve inatçı biçimde kirlendiğini sahada gördük; standart yöntemlerin
            bu koşullarda yetersiz kaldığını yaşayarak öğrendik.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Bu deneyim bizi yöntem geliştirmeye itti: daha az su, daha kontrollü temizlik ve her müdahalenin
            ölçülebilir olması. Zamanla hizmet alanımız Manisa&apos;dan Türkiye geneline genişledi; bugün
            81 ilde, 100&apos;ü aşkın yıkama noktasında hizmet veriyoruz.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
            Hedefimiz değişmedi: GES yatırımınızın ürettiği enerjiyi, kirlilik nedeniyle kaybetmenize izin vermemek.
          </p>
        </div>
      </section>

      {/* ── Neler Yapıyoruz ── */}
      <section style={{ background: 'var(--bg-body)', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Hizmetlerimiz" title="Neler Yapıyoruz?" titleSize="clamp(24px, 3.5vw, 36px)" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {services.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="section-card"
                style={{ padding: '26px 26px 22px', textDecoration: 'none', display: 'block' }}
              >
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                  {svc.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '14px' }}>{svc.desc}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)' }}>
                  Detaylı bilgi <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Değerlerimiz ── */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <SectionHeader eyebrow="Kurumsal Değerler" title="Çalışma Prensibimiz" titleSize="clamp(24px, 3.5vw, 36px)" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="section-card" style={{ padding: '28px 26px', cursor: 'default' }}>
                <v.icon size={36} style={{ color: 'var(--color-secondary)', marginBottom: '16px' }} />
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nasıl Çalışıyoruz ── */}
      <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <SectionHeader eyebrow="Çalışma Şeklimiz" title="Bir Projeye Nasıl Yaklaşıyoruz?" titleSize="clamp(24px, 3.5vw, 36px)" />
          </div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {workSteps.map((step, i) => (
              <li key={step.title} className="section-card" style={{ padding: '26px 22px', cursor: 'default' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--color-secondary)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <step.icon size={30} style={{ color: 'var(--color-primary)', margin: '10px 0 12px' }} />
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Referanslar references={references} />

      <CtaBand title="GES sahanız için ücretsiz keşif talep edin" href="/iletisim" label="İletişime Geç" />
    </>
  )
}
