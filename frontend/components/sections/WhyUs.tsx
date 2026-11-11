'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Zap, ShieldCheck, Wrench, CalendarCheck, Award, HeadphonesIcon, ArrowRight,
  MapPin, SprayCan, ClipboardCheck, Clock, MessageSquareQuote,
  type LucideIcon,
} from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  /** Yoksa "Detaylı Bilgi »" linki render edilmez. */
  href?: string
}

const gesFeatures: Feature[] = [
  { icon: Zap,             title: 'Veri Odaklı ROI Analizi',     desc: 'GES projelerinde temizlik öncesi ve sonrası üretim artışını inverter verileriyle raporluyoruz.', href: '/neden-biz/veri-odakli-roi-analizi' },
  { icon: ShieldCheck,     title: 'ISG & Otonom Teknoloji',       desc: 'Sahada riskleri sıfıra indiren otonom temizlik robotlarımızla uluslararası İş Güvenliği standartlarındayız.', href: '/neden-biz/isg-otonom-teknoloji' },
  { icon: Wrench,          title: 'Su İsrafı Yapmıyoruz',         desc: 'Minimum su tüketimiyle maksimum temizlik sağlayan yöntemlerimizle çevreye duyarlı hizmet veriyoruz.', href: '/neden-biz/su-tasarrufu' },
  { icon: CalendarCheck,   title: 'Periyodik Bakım Planı',        desc: 'Mevsimsel tozlanma verilerine göre optimize edilmiş yıllık bakım sözleşmeleri sunuyoruz.', href: '/neden-biz/periyodik-bakim-plani' },
  { icon: Award,           title: 'Sertifikalı Uzman Kadrosu',    desc: 'Temizlikte titiz uygulama, GES projelerinde performans analizi ve detaylı verim raporu.', href: '/neden-biz/sertifikali-uzman-kadro' },
  { icon: HeadphonesIcon,  title: '7/24 Kesintisiz İzleme',       desc: 'Olası arıza veya verim düşüklüğünde anında müdahale için sistemlerinizi sürekli izliyoruz.', href: '/neden-biz/7-24-izleme' },
]

const cleaningFeatures: Feature[] = [
  { icon: MapPin,             title: "Soma'dayız, bölgeyi biliyoruz", desc: "Merkezimiz Soma'da. Mahallenizi ve bölgenin toz yükünü uzaktan tarif etmenize gerek kalmaz.", href: '/neden-biz/soma-merkezli-temizlik' },
  { icon: Award,              title: '5 Yılı Aşkın Saha Deneyimi',    desc: 'Ev, iş yeri ve GES sahalarından gelen deneyimimizle önce nereye bakılacağını biliyoruz.', href: '/neden-biz/temizlik-saha-deneyimi' },
  { icon: SprayCan,           title: 'Malzeme ve Ekipman Bizden',     desc: 'Temizlik malzemesi ve ekipmanı ekibimizle birlikte gelir. Sizin hazırlık yapmanız gerekmez.', href: '/neden-biz/malzeme-ekipman-bizden' },
  { icon: ClipboardCheck,     title: 'Kapsam Baştan Belli',           desc: 'Hangi işin dahil olduğunu iş başlamadan konuşuyoruz. Beklentiniz ile yapılan iş aynı olur.', href: '/neden-biz/kapsam-bastan-belli' },
  { icon: Clock,              title: 'Programınıza Uyuyoruz',         desc: 'Temizliği mesai, vardiya ve açılış saatlerinize göre planlıyoruz. Operasyonunuzu aksatmıyoruz.', href: '/neden-biz/programiniza-uygun-temizlik' },
  { icon: MessageSquareQuote, title: 'Size Özel Teklif',              desc: 'Alan, kir durumu ve sıklığa göre yerinde ya da form üzerinden teklif hazırlıyoruz. Ev, iş yeri ve kurum için çözüm sunuyoruz.', href: '/neden-biz/ozel-temizlik-teklifi' },
]

type TabId = 'temizlik' | 'ges'

const tabs: { id: TabId; label: string; features: Feature[] }[] = [
  { id: 'temizlik', label: 'Temizlik', features: cleaningFeatures },
  { id: 'ges',      label: 'GES',      features: gesFeatures },
]

function ServiceCard({ f }: { f: Feature }) {
  return (
    <div className="service-card" style={{ cursor: 'default' }}>
      {/* Icon */}
      <f.icon style={{ width: '42px', height: '42px', color: 'var(--color-secondary)', marginBottom: '18px', flexShrink: 0 }} />

      <h3 className="whyus-card-title" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '21px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '10px' }}>
        {f.title}
      </h3>

      <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: f.href ? '0 0 16px' : 0, flex: 1 }}>
        {f.desc}
      </p>

      {f.href && (
        <Link
          href={f.href}
          className="whyus-link"
          style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-secondary)', textDecoration: 'none' }}
        >
          Detaylı Bilgi »
        </Link>
      )}
    </div>
  )
}

export default function WhyUs() {
  const [active, setActive] = useState<TabId>('temizlik')
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  function select(id: TabId, focus = false) {
    setActive(id)
    if (focus) tabRefs.current[id]?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = -1
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next < 0) return
    e.preventDefault()
    select(tabs[next].id, true)
  }

  return (
    <section id="hakkimizda" className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28" style={{ background: 'var(--bg-alt)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background — sağ altta, aktif sekmeye göre cross-fade (GES: solar/wind, Temizlik: temizlik malzemeleri) */}
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
          className="transition-opacity duration-[350ms] ease-in-out motion-reduce:transition-none"
          style={{ width: '100%', height: 'auto', opacity: active === 'ges' ? 0.45 : 0 }}
        />
        <Image
          src="/cleaning-bg.png"
          alt=""
          width={915}
          height={876}
          className="transition-opacity duration-[350ms] ease-in-out motion-reduce:transition-none"
          style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '100%', height: 'auto',
            opacity: active === 'temizlik' ? 0.24 : 0,
          }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>

        {/* Mobil başlık — sekmelerden önce gelir (başlık → sekmeler → kartlar). md+ başlığı grid içindeki intro hücresinde. */}
        <div className="md:hidden mb-6">
          <SectionHeader
            eyebrow="New Temizlik"
            title="Neden Sıradan Bir Temizlik Firması Değiliz?"
            titleSize="28px"
            lead="Ev ve iş yerlerinden güneş enerji santrallerine profesyonel temizlik ve bakım çözümleri sunuyoruz."
            align="left"
            eyebrowWeight={700}
          />
        </div>

        {/* Sekmeler — yatayda ortalı, kart grid'inin hemen üstünde */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div role="tablist" aria-label="Neden biz kategorisi" className="whyus-tablist">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[t.id] = el }}
                type="button"
                role="tab"
                id={`whyus-tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls={`whyus-panel-${t.id}`}
                tabIndex={active === t.id ? 0 : -1}
                className="whyus-tab"
                data-tab={t.id}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/*
          Tek responsive grid: mobil 1 kolon, sm-lg arası 2 kolon, lg+ 4 kolon.
          md-lg (2 kolon): intro, 6 kart, CTA = 8 hücre. lg+: intro, 3 kart, 3 kart, CTA.
          Sekme panelleri `display: contents` ile grid'in doğrudan çocukları gibi akar.
          İki panelin i. kartı AYNI grid hücresine yerleşir (globals.css `.whyus-panel`);
          pasif panel `visibility: hidden` ile DOM'da kalır (SEO + ARIA ilişkileri korunur)
          ve satır yükseklikleri iki setin maksimumu olduğundan sekme değişince sayfa zıplamaz.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          {/* Intro cell — yalnızca md+ (mobil başlık yukarıda) */}
          <div
            className="whyus-intro hidden md:flex"
            style={{ flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="md:pr-4">
              <SectionHeader
                eyebrow="New Temizlik"
                title="Neden Sıradan Bir Temizlik Firması Değiliz?"
                titleSize="clamp(24px, 2.8vw, 36px)"
                lead="Ev ve iş yerlerinden güneş enerji santrallerine, ihtiyaca uygun profesyonel temizlik ve bakım çözümleri sunuyoruz."
                align="left"
                eyebrowWeight={700}
              />
            </div>
          </div>

          {/* Kart setleri (aktif sekmenin kartları grid'e akar) */}
          {tabs.map((t) => (
            <div
              key={t.id}
              role="tabpanel"
              id={`whyus-panel-${t.id}`}
              aria-labelledby={`whyus-tab-${t.id}`}
              className={active === t.id ? 'whyus-panel' : 'whyus-panel whyus-panel-off'}
            >
              {t.features.map((f) => (
                <ServiceCard key={f.title} f={f} />
              ))}
            </div>
          ))}

          {/* CTA cell — sadece md+ */}
          <div
            className="whyus-cta hidden md:flex"
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <h3 className="section-heading" style={{ fontSize: 'clamp(22px, 2.3vw, 30px)', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              İhtiyacınıza Uygun Çözüm
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

      </div>
    </section>
  )
}
