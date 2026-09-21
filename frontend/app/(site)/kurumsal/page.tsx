import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Target, Eye, Leaf, Users, ShieldCheck, Award } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import JsonLd from '@/components/ui/JsonLd'
import { buildMetadata, SITE_URL } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Kurumsal | New Temizlik - GES Temizlik ve Bakım Çözümleri',
  description:
    "New Temizlik hakkında: misyon, vizyon, değerlerimiz ve kurumsal kimliğimiz. Soma merkezli, tüm Türkiye'ye hizmet veren endüstriyel GES temizlik ve bakım firması.",
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

const stats = [
  { value: '3 GWh', label: 'Kurumsal Referans' },
  { value: '100+', label: 'Yıkama Noktası' },
  { value: '81 İlde', label: 'Aktif Hizmet' },
  { value: '5+ Yıl', label: 'Sektör Deneyimi' },
]

const values = [
  { icon: Target, title: 'Sonuç Odaklılık', desc: 'Her projede ölçülebilir verim artışı hedefliyoruz. İşin sonunda üretim verisi konuşur.' },
  { icon: Leaf, title: 'Çevresel Sorumluluk', desc: 'Minimum su tüketimi ve su israfı yapmayan yöntemlerimizle çevreye duyarlı hizmet veriyoruz.' },
  { icon: ShieldCheck, title: 'Güvenlik Önce', desc: 'Tüm operasyonlarımız uluslararası İSG standartlarında ve tam sigorta kapsamında yürütülür.' },
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

export default function KurumsalPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        title="Kurumsal"
        image="solar-panel.webp"
        breadcrumbs={[
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Kurumsal' },
        ]}
      />

      {/* ── Hakkımızda + Collage ── */}
      <section style={{ background: 'var(--bg-body)', padding: '90px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left — text */}
            <div className="w-full lg:w-1/2">
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '12px' }}>
                Biz Kimiz
              </span>
              <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.18, marginBottom: '20px' }}>
                Neden Sıradan Bir <br /> Temizlik Firması Değiliz?
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '16px' }}>
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
                      borderLeft: '3px solid #7FBF3A',
                    }}
                  >
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: '#7FBF3A', lineHeight: 1, marginBottom: '4px' }}>
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

      {/* ── Değerlerimiz ── */}
      <section style={{ background: 'var(--bg-body)', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
              Kurumsal Değerler
            </span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
              Çalışma Prensibimiz
            </h2>
            <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="section-card" style={{ padding: '28px 26px', cursor: 'default' }}>
                <v.icon size={36} style={{ color: '#7FBF3A', marginBottom: '16px' }} />
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

      {/* ── CTA ── */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="flex justify-center">
          <Link
            href="/iletisim"
            className="cta-button inline-flex items-center gap-2"
            style={{
              padding: '14px 36px',
              background: '#7FBF3A',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 15px rgba(127,191,58,0.3)',
              textDecoration: 'none',
            }}
          >
            İletişime Geç <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
