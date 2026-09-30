import Image from 'next/image'
import { AlertTriangle, Droplets, Wrench, type LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Card {
  icon: LucideIcon
  num: string
  title: string
  color: string
  paragraphs: string[]
  img: string
  altText: string
}

const cards: Card[] = [
  {
    icon: AlertTriangle,
    num: '01',
    title: 'Kir Problemleri',
    color: 'var(--color-primary)',
    paragraphs: [
      'GES panellerinde oluşan kirlenme, enerji üretimini doğrudan etkileyen önemli bir problemdir. Özellikle tozlu bölgelerde ve tarım arazilerine yakın santrallerde kirlenme %40\'a varan hızla gerçekleşir.',
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
    color: 'var(--color-secondary)',
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
    color: 'var(--color-primary)',
    paragraphs: [
      'Profesyonel panel temizliği, panellere zarar vermeden yapılan özel uygulamalarla gerçekleştirilmelidir. Su israfı yapmadan, kontrollü ve verimli yöntemlerle panel yüzeyi temizlenir.',
      'Yumuşak fırçalar ve otomatik temizlik sistemleri sayesinde panellerin cam yüzeyi ve hücre yapısı korunur.',
      'Temizlik işlemi genellikle sabah erken saatlerde veya akşam serinliğinde yapılır. Maksimum verim için yılda en az 2 kez temizlik önerilir.',
    ],
    img: '/ges-temizligi.webp',
    altText: 'Profesyonel GES güneş paneli temizlik uygulaması ve yöntemi',
  },
]

export default function KirProblemleri({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section
      id="kir-problemleri"
      className="scroll-mt-16 md:scroll-mt-20"
      style={{ background: 'var(--bg-body)', position: 'relative', zIndex: 1 }}
    >

      {/* ── Header ── */}
      {showHeader && (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{ paddingTop: '120px', paddingBottom: '56px' }}>
          <div className="text-center">
            <SectionHeader
              eyebrow="Panel Kirliliği"
              title="GES Panel Kirlilik Rehberi"
              lead="Kirli panel = kayıp para. Nedenini anlatıyoruz, çözümünü uyguluyoruz."
            />
          </div>
        </div>
      )}

      {/* ── Content: alternating image + text ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12" style={{ paddingTop: showHeader ? '0' : '80px', paddingBottom: '96px' }}>
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
                    background: 'var(--color-accent)',
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
