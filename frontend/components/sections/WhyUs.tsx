import Image from 'next/image'
import Link from 'next/link'
import { Zap, ShieldCheck, Wrench, CalendarCheck, Award, HeadphonesIcon, ArrowRight, type LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  href: string
}

const features: Feature[] = [
  { icon: Zap,             title: 'Veri Odaklı ROI Analizi',     desc: 'GES yıllık temizlik öncesi ve sonrası üretim artışını inverter verileriyle raporluyoruz.', href: '/neden-biz/veri-odakli-roi-analizi' },
  { icon: ShieldCheck,     title: 'ISG & Otonom Teknoloji',       desc: 'Sahada riskleri sıfıra indiren otonom temizlik robotlarımızla uluslararası İş Güvenliği standartlarındayız.', href: '/neden-biz/isg-otonom-teknoloji' },
  { icon: Wrench,          title: 'Su İsrafı Yapmıyoruz',         desc: 'Minimum su tüketimiyle maksimum temizlik sağlayan yöntemlerimizle çevreye duyarlı hizmet veriyoruz.', href: '/neden-biz/su-tasarrufu' },
  { icon: CalendarCheck,   title: 'Periyodik Bakım Planı',        desc: 'Mevsimsel tozlanma verilerine göre optimize edilmiş yıllık bakım sözleşmeleri sunuyoruz.', href: '/neden-biz/periyodik-bakim-plani' },
  { icon: Award,           title: 'Sertifikalı Uzman Kadrosu',    desc: 'Sadece temizlik değil, GES performans analizi. Her projede detaylı verim raporu teslim edilir.', href: '/neden-biz/sertifikali-uzman-kadro' },
  { icon: HeadphonesIcon,  title: '7/24 Kesintisiz İzleme',       desc: 'Olası arıza veya verim düşüklüğünde anında müdahale için sistemlerinizi sürekli izliyoruz.', href: '/neden-biz/7-24-izleme' },
]

function ServiceCard({ f }: { f: Feature }) {
  return (
    <div className="service-card" style={{ cursor: 'default' }}>
      {/* Icon */}
      <f.icon style={{ width: '42px', height: '42px', color: 'var(--color-secondary)', marginBottom: '18px', flexShrink: 0 }} />

      <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '21px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '10px' }}>
        {f.title}
      </h3>

      <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 16px', flex: 1 }}>
        {f.desc}
      </p>

      <Link
        href={f.href}
        className="whyus-link"
        style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-secondary)', textDecoration: 'none' }}
      >
        Detaylı Bilgi »
      </Link>
    </div>
  )
}

export default function WhyUs() {
  return (
    <section id="hakkimizda" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28" style={{ background: 'var(--bg-alt)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background — solar/wind line art, sağ altta */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 'min(52vw, 620px)',
          pointerEvents: 'none', zIndex: 0,
        }}
      >
        <Image
          src="/aboutbg002.png"
          alt=""
          width={472}
          height={418}
          style={{ width: '100%', height: 'auto', opacity: 0.45 }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Desktop: 4-col grid ── */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
        >
          {/* Intro cell — row 1 col 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '16px' }}>
            <SectionHeader
              eyebrow="New Temizlik"
              title="Neden Sıradan Bir Temizlik Firması Değiliz?"
              titleSize="clamp(24px, 2.8vw, 36px)"
              lead="GES santrallerinde enerji verimliliğini artırmak ve sürdürülebilirliği sağlamak adına profesyonel temizlik ve bakım çözümleri sunuyoruz."
              align="left"
              eyebrowWeight={700}
            />
          </div>

          {/* Cards 1–3 */}
          <ServiceCard f={features[0]} />
          <ServiceCard f={features[1]} />
          <ServiceCard f={features[2]} />

          {/* Cards 4–6 */}
          <ServiceCard f={features[3]} />
          <ServiceCard f={features[4]} />
          <ServiceCard f={features[5]} />

          {/* CTA cell */}
          <div
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <h3 className="section-heading" style={{ fontSize: 'clamp(22px, 2.3vw, 30px)', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Veriminizin Olduğu Her Yerdeyiz
            </h3>
            <Link
              href="/hizmetlerimiz"
              className="cta-button"
              style={{ fontSize: '14px', padding: '12px 22px', alignSelf: 'flex-start' }}
            >
              <ArrowRight size={14} /> Hizmetlerimiz
            </Link>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden">
          <div style={{ marginBottom: '32px' }}>
            <SectionHeader
              eyebrow="New Temizlik"
              title="Neden Sıradan Bir Temizlik Firması Değiliz?"
              titleSize="28px"
              lead="GES santrallerinde enerji verimliliğini artırmak adına profesyonel temizlik ve bakım çözümleri sunuyoruz."
              align="left"
              eyebrowWeight={700}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => <ServiceCard key={i} f={f} />)}
          </div>
        </div>

      </div>
    </section>
  )
}
