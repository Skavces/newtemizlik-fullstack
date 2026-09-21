import { Fragment } from 'react'
import Image from 'next/image'
import { Search, ClipboardList, Play, CheckCircle2, type LucideIcon } from 'lucide-react'

const CARD_H = 400   // fixed card height (px)
const STAGGER = 90   // vertical offset for low cards (px)
const ARROW_W = 150   // arrow connector width (px)
const ROW_H = CARD_H + STAGGER  // total flex row height = 490

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
    color: '#7FBF3A',
    img: '/alankesif.jpg',
    alt: 'GES sahasında termal analiz ve keşif çalışması',
  },
  {
    icon: ClipboardList,
    num: '02',
    title: 'Planlama',
    description: 'Keşif verilerine dayanarak size özel temizlik ve bakım planı hazırlıyoruz. Ekip büyüklüğü, ekipman ve maliyet analizi net biçimde ortaya konur.',
    color: '#1F6EC7',
    img: '/planlama.jpg',
    alt: 'Güneş enerjisi santralinde uzman bakım planlaması',
  },
  {
    icon: Play,
    num: '03',
    title: 'Uygulama',
    description: 'Sertifikalı ekibimiz ve otonom robotlarımızla planı sahada hayata geçiriyoruz. Su israfı yapmadan, panellere zarar vermeden profesyonel temizlik gerçekleştirilir.',
    color: '#7FBF3A',
    img: '/uygulama.jpg',
    alt: 'Otonom panel temizlik robotu uygulaması',
  },
  {
    icon: CheckCircle2,
    num: '04',
    title: 'Kontrol',
    description: 'Temizlik öncesi/sonrası veriler karşılaştırılır, invertör verileriyle kalite doğrulanır. Detaylı rapor ve garanti belgesi teslim edilir.',
    color: '#1F6EC7',
    img: '/kontrol.jpg',
    alt: 'Güneş paneli temizlik kalite kontrol çalışması',
  },
]

/**
 * S-curve arrow connecting two staggered cards.
 * startY / endY are relative to the flex-row top (y=0).
 * The bezier's last control point shares X with the endpoint → horizontal tangent at end.
 * This guarantees the arrowhead is always a clean rightward >.
 */
function StepArrow({ color, startY, endY }: { color: string; startY: number; endY: number }) {
  const mid = ARROW_W / 2
  const tipX = ARROW_W
  const curveEndX = tipX - 14
  const armLen = 9
  const curvePath = `M0,${startY} C${mid},${startY} ${mid},${endY} ${curveEndX},${endY}`
  return (
    <svg
      width={ARROW_W}
      height={ROW_H}
      viewBox={`0 0 ${ARROW_W} ${ROW_H}`}
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Dashed S-curve body */}
      <path
        d={curvePath}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 5"
        opacity="0.6"
      />
      {/* > chevron tip */}
      <polyline
        points={`${tipX - 12},${endY - armLen} ${tipX},${endY} ${tipX - 12},${endY + armLen}`}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
        fill="none"
        opacity="0.9"
      />
    </svg>
  )
}

function StepCard({ step }: { step: Step }) {
  return (
    <div style={{ height: `${CARD_H}px`, display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', flexShrink: 0, height: '195px' }}>
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '100%' }}>
          <Image
            src={step.img}
            alt={step.alt}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* Step number badge — overflows image corner */}
        <div style={{
          position: 'absolute', top: '-18px', left: '-18px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#F4C430',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '18px',
          color: '#1a1a1a',
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          zIndex: 1,
        }}>
          {step.num}
        </div>
      </div>

      {/* Content — no card bg, just bare text */}
      <div style={{ paddingTop: '18px', flex: 1 }}>
        {/* Step label */}
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: step.color, display: 'block', marginBottom: '6px' }}>
          Adım {step.num}
        </span>

        {/* Title */}
        <h3
          className="section-heading"
          style={{ fontSize: 'clamp(18px, 1.6vw, 22px)', color: 'var(--text-primary)', marginBottom: '8px' }}
        >
          {step.title}
        </h3>

        {/* Accent bar */}
        <div style={{ width: '32px', height: '3px', background: step.color, borderRadius: '2px', marginBottom: '10px' }} />

        {/* Description */}
        <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
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
      className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28"
      style={{ background: 'var(--bg-alt)' }}
    >

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
            Süreç
          </span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
            Çalışma Sürecimiz
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.7 }}>
            Sahadan rapora 4 adımda profesyonel hizmet.
          </p>
          <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
        </div>

        {/* ── Desktop: staggered horizontal flow ── */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: `1fr ${ARROW_W}px 1fr ${ARROW_W}px 1fr ${ARROW_W}px 1fr`,
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
                {!isLast && (
                  <StepArrow
                    color={step.color}
                    startY={thisCenter}
                    endY={nextCenter}
                  />
                )}
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
              background: 'linear-gradient(to bottom, #7FBF3A, #1F6EC7, #7FBF3A, #1F6EC7)',
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
