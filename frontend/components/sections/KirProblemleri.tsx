import Image from 'next/image'
import { TrendingDown, Flame, RefreshCw, AlertTriangle, Droplets, Wrench, type LucideIcon } from 'lucide-react'

interface Stat {
  icon: LucideIcon
  value: string
  label: string
  sub: string
  color: string
}

interface Card {
  icon: LucideIcon
  num: string
  title: string
  color: string
  paragraphs: string[]
  img: string
  altText: string
}

const stats: Stat[] = [
  {
    icon: TrendingDown,
    value: '%30',
    label: 'Verim Kaybı',
    sub: 'Temizlenmeyen panellerde ortalama kayıp',
    color: '#e74c3c',
  },
  {
    icon: Flame,
    value: '%40',
    label: 'Daha Hızlı Kirlenme',
    sub: 'Tarım & sanayi bölgelerindeki santrallerde',
    color: '#f39c12',
  },
  {
    icon: RefreshCw,
    value: '2x',
    label: 'Yıllık Temizlik',
    sub: 'Maksimum verim için önerilen minimum sıklık',
    color: '#7FBF3A',
  },
]

const cards: Card[] = [
  {
    icon: AlertTriangle,
    num: '01',
    title: 'Kir Problemleri',
    color: '#7FBF3A',
    paragraphs: [
      'GES panellerinde oluşan kirlenme, enerji üretimini doğrudan etkileyen önemli bir problemdir. Özellikle tozlu bölgelerde ve tarım arazilerine yakın santrallerde kirlenme daha hızlı gerçekleşir.',
      'Yağmurla birleşen kir tabakası zamanla panel yüzeyine yapışarak ışık geçirgenliğini ciddi şekilde azaltır.',
      'Uzun süre temizlenmeyen panellerde düzensiz ısınma (hot-spot) ve hücre hasarları oluşabilir.',
    ],
    img: '/ges-kir-problemleri.jpg',
    altText: 'GES güneş panellerinde kir ve toz birikimi sonucu oluşan verim kaybı',
  },
  {
    icon: Droplets,
    num: '02',
    title: 'Neden Yıkanmalı?',
    color: '#1F6EC7',
    paragraphs: [
      'GES panel temizliği, güneş enerji santrallerinde maksimum enerji verimliliği sağlamak için kritik bir bakım sürecidir.',
      "%30'a varan verim kayıplarının önüne geçilir. Temiz paneller, santralinizin tam kapasite çalışmasını sağlar ve yatırım geri dönüş süresini kısaltır.",
      'Düzenli bakım, ekipman ömrünü uzatarak uzun vadede işletme maliyetlerini azaltır.',
    ],
    img: '/ges-neden-yikanmali.jpg',
    altText: 'Güneş paneli temizliğinin enerji üretimi ve verime katkısı',
  },
  {
    icon: Wrench,
    num: '03',
    title: 'Nasıl Temizlenmeli?',
    color: '#7FBF3A',
    paragraphs: [
      'Profesyonel panel temizliği, panellere zarar vermeden yapılan özel uygulamalarla gerçekleştirilmelidir. Su israfı yapmadan, kontrollü ve verimli yöntemlerle panel yüzeyi temizlenir.',
      'Yumuşak fırçalar ve otomatik temizlik sistemleri sayesinde panellerin cam yüzeyi ve hücre yapısı korunur.',
      'Temizlik işlemi genellikle sabah erken saatlerde veya akşam serinliğinde yapılır.',
    ],
    img: '/ges-temizligi.webp',
    altText: 'Profesyonel GES güneş paneli temizlik uygulaması ve yöntemi',
  },
]

export default function KirProblemleri() {
  return (
    <section
      id="kir-problemleri"
      className="scroll-mt-16 md:scroll-mt-20"
      style={{ background: 'var(--bg-body)', position: 'relative', zIndex: 1 }}
    >

      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{ paddingTop: '120px', paddingBottom: '56px' }}>
        <div className="text-center">
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
            Panel Kirliliği
          </span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
            GES Panel Kirlilik Rehberi
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.7 }}>
            Kirli panel = kayıp para. Verilerle anlıyoruz, çözümle gidiyoruz.
          </p>
          <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
        </div>
      </div>

      {/* ── Stats dark band ── */}
      <div style={{ background: 'var(--bg-alt)', padding: '0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {stats.map((s, i) => (
              <div
                key={i}
                className={i < 2 ? 'border-b md:border-b-0 md:border-r' : ''}
                style={{
                  padding: '36px 28px',
                  borderColor: 'var(--border-subtle)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Ghost icon bg */}
                <s.icon
                  style={{
                    position: 'absolute', right: '20px', bottom: '20px',
                    width: '80px', height: '80px',
                    color: s.color, opacity: 0.07,
                  }}
                />

                {/* Color dot */}
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, marginBottom: '20px' }} />

                {/* Big number */}
                <div
                  className="section-heading"
                  style={{ fontSize: 'clamp(48px, 6vw, 72px)', color: s.color, lineHeight: 1, marginBottom: '10px' }}
                >
                  {s.value}
                </div>

                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.04em' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content: alternating image + text ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {cards.map((card, i) => {
            const isReverse = i % 2 === 1
            return (
              <div
                key={i}
                className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
              >
                {/* Image */}
                <div className={isReverse ? 'md:order-2' : ''} style={{ position: 'relative' }}>
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.14)', aspectRatio: '4/3' }}>
                    <Image
                      src={card.img}
                      alt={card.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Number badge */}
                  <div style={{
                    position: 'absolute', top: '-20px', right: '-20px',
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#F4C430',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px',
                    color: '#1a1a1a',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    zIndex: 1,
                  }}>
                    {card.num}
                  </div>
                </div>

                {/* Text */}
                <div className={isReverse ? 'md:order-1' : ''}>
                  {/* Ghost number */}
                  <span style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '96px', fontWeight: 700,
                    color: `${card.color}0d`,
                    lineHeight: 1, display: 'block',
                    marginBottom: '-16px',
                    letterSpacing: '0.02em',
                    userSelect: 'none',
                  }}>
                    {card.num}
                  </span>

                  {/* Icon + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <card.icon style={{ width: '36px', height: '36px', color: card.color, flexShrink: 0 }} />
                    <h3 className="section-heading" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--text-primary)', margin: 0 }}>
                      {card.title}
                    </h3>
                  </div>

                  {/* Accent bar */}
                  <div style={{ width: '44px', height: '3px', background: card.color, borderRadius: '2px', marginBottom: '20px' }} />

                  {/* Paragraphs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {card.paragraphs.map((p, j) => (
                      <p key={j} style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </section>
  )
}
