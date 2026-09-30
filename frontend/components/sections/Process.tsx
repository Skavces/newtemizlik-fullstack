import { Fragment } from 'react'
import Image from 'next/image'
import { Search, ClipboardList, Play, CheckCircle2, type LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

const CARD_H = 380   // fixed card height (px)
const STAGGER = 100   // vertical offset for low cards (px)
const ARROW_W = 100   // arrow connector width (px)
const ROW_H = CARD_H + STAGGER  // total flex row height

// Card centers relative to flex-row top:
const CENTER_TOP = CARD_H / 2              // = 200 (cards 01, 03)
const CENTER_LOW = STAGGER + CARD_H / 2   // = 290 (cards 02, 04)

interface Step {
  icon: LucideIcon
  num: string
  title: string
  description: string
  color: string
  img: string
  alt: string
}

const steps: Step[] = [
  {
    icon: Search,
    num: '01',
    title: 'Keşif',
    description: 'Sahaya giderek detaylı analiz ve ihtiyaç tespiti yapıyoruz. Sorunlu paneller ve gölgelenme noktaları belirlenir.',
    color: 'var(--color-primary)',
    img: '/alankesif.jpg',
    alt: 'GES sahasında termal analiz ve keşif çalışması',
  },
  {
    icon: ClipboardList,
    num: '02',
    title: 'Planlama',
    description: 'Keşif verilerine dayanarak size özel temizlik ve bakım planı hazırlıyoruz. Ekip büyüklüğü, ekipman ve maliyet analizi net biçimde ortaya konur.',
    color: 'var(--color-secondary)',
    img: '/planlama.jpg',
    alt: 'Güneş enerjisi santralinde uzman bakım planlaması',
  },
  {
    icon: Play,
    num: '03',
    title: 'Uygulama',
    description: 'Sertifikalı ekibimiz ve otonom robotlarımızla planı sahada hayata geçiriyoruz. Su israfı yapmadan, panellere zarar vermeden profesyonel temizlik gerçekleştirilir.',
    color: 'var(--color-primary)',
    img: '/uygulama.jpg',
    alt: 'Otonom panel temizlik robotu uygulaması',
  },
  {
    icon: CheckCircle2,
    num: '04',
    title: 'Kontrol',
    description: 'Temizlik öncesi/sonrası veriler karşılaştırılır, invertör verileriyle kalite doğrulanır. Detaylı rapor ve garanti belgesi teslim edilir.',
    color: 'var(--color-secondary)',
    img: '/kontrol.jpg',
    alt: 'Güneş paneli temizlik kalite kontrol çalışması',
  },
]

const CONNECTOR_COLOR = 'var(--color-primary)'

/**
 * S-curve dashed connector between two staggered cards.
 * startY / endY are relative to the flex-row top (y=0).
 */
function StepArrow({ startY, endY }: { startY: number; endY: number }) {
  const mid = ARROW_W / 2
  const curvePath = `M0,${startY} C${mid},${startY} ${mid},${endY} ${ARROW_W},${endY}`
  return (
    <svg
      width={ARROW_W}
      height={ROW_H}
      viewBox={`0 0 ${ARROW_W} ${ROW_H}`}
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path
        d={curvePath}
        stroke={CONNECTOR_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 5"
        opacity="0.55"
      />
    </svg>
  )
}

/** Small decorative arrow trailing off after the final card, curving upward. */
function TrailingArrow({ y }: { y: number }) {
  const w = 50
  const tipX = w
  const tipY = y - 34
  const curveEndX = tipX - 14
  const armLen = 8
  return (
    <svg
      width={w}
      height={ROW_H}
      viewBox={`0 0 ${w} ${ROW_H}`}
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path
        d={`M0,${y} C${w * 0.5},${y} ${w * 0.5},${tipY} ${curveEndX},${tipY}`}
        stroke={CONNECTOR_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 5"
        opacity="0.55"
      />
      {/* > chevron tip */}
      <polyline
        points={`${tipX - 12},${tipY - armLen} ${tipX},${tipY} ${tipX - 12},${tipY + armLen}`}
        stroke={CONNECTOR_COLOR}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
        fill="none"
        opacity="0.85"
      />
    </svg>
  )
}

function StepCard({ step }: { step: Step }) {
  return (
    <div style={{ height: `${CARD_H}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {/* Photo card */}
      <div style={{
        position: 'relative', flexShrink: 0, width: '100%',
        background: 'var(--bg-card)', borderRadius: '18px', padding: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
      }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1 / 1' }}>
          <Image
            src={step.img}
            alt={step.alt}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Step number badge — overflows card corner */}
        <div style={{
          position: 'absolute', top: '-20px', left: '-20px',
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px',
          color: '#1a1a1a',
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          zIndex: 1,
        }}>
          {step.num}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: '20px' }}>
        <h3
          className="section-heading"
          style={{ fontSize: 'clamp(19px, 1.8vw, 24px)', color: 'var(--text-primary)', marginBottom: '8px' }}
        >
          {step.title}
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
          {step.description}
        </p>
      </div>
    </div>
  )
}

export default function Process() {
  return (
    <section
      id="surec"
      className="scroll-mt-16 md:scroll-mt-20 pt-8 pb-20 md:pt-10 md:pb-28"
      style={{ background: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}
    >

      {/* Decorative background — solar/wind line art */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <Image
          src="/bg001.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'left bottom', opacity: 0.8 }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <SectionHeader
            eyebrow="Süreç"
            title="Çalışma Sürecimiz"
            lead="Sahadan rapora 4 adımda profesyonel hizmet."
          />
        </div>

        {/* ── Desktop: staggered horizontal flow ── */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: `1fr ${ARROW_W}px 1fr ${ARROW_W}px 1fr ${ARROW_W}px 1fr 50px`,
            alignItems: 'flex-start',
            height: `${ROW_H}px`,
          }}
        >
          {steps.map((step, i) => {
            const isLow = i % 2 === 1
            const isLast = i === steps.length - 1
            const thisCenter = isLow ? CENTER_LOW : CENTER_TOP
            const nextIsLow = (i + 1) % 2 === 1
            const nextCenter = nextIsLow ? CENTER_LOW : CENTER_TOP

            return (
              <Fragment key={step.num}>
                <div style={{ marginTop: isLow ? `${STAGGER}px` : '0', minWidth: 0 }}>
                  <StepCard step={step} />
                </div>
                {!isLast
                  ? <StepArrow startY={thisCenter} endY={nextCenter} />
                  : <TrailingArrow y={thisCenter} />}
              </Fragment>
            )
          })}
        </div>

        {/* ── Mobile: vertical list with left spine ── */}
        <div className="md:hidden relative" style={{ paddingLeft: '52px' }}>
          <div
            style={{
              position: 'absolute', left: '18px', top: '24px', bottom: '24px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary), var(--color-primary), var(--color-secondary))',
              opacity: 0.3,
            }}
          />
          {steps.map((step, i) => (
            <div key={step.num} style={{ position: 'relative', marginBottom: i < steps.length - 1 ? '24px' : '0' }}>
              <div
                style={{
                  position: 'absolute', left: '-42px', top: '20px',
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: step.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '16px',
                  boxShadow: `0 4px 14px ${step.color}45`,
                  border: '2px solid var(--bg-alt)', zIndex: 2,
                }}
              >
                {step.num}
              </div>
              <div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9' }}>
                    <Image
                      src={step.img} alt={step.alt} fill sizes="100vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div style={{ paddingTop: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: step.color, display: 'block', marginBottom: '5px' }}>
                    Adım {step.num}
                  </span>
                  <h3 className="section-heading" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 8px' }}>
                    {step.title}
                  </h3>
                  <div style={{ width: '32px', height: '3px', background: step.color, borderRadius: '2px', marginBottom: '10px' }} />
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
