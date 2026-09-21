'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown, FolderCheck, CalendarDays, ThumbsUp, Users, Sun, type LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface InfoStat {
  icon: LucideIcon
  num: string
  label: string
  desc: string
}

const infoStats: InfoStat[] = [
  { icon: FolderCheck,  num: '195+', label: 'Tamamlanan Proje',    desc: 'Türkiye genelinde başarıyla teslim edilen GES projeleri.' },
  { icon: CalendarDays, num: '5+',   label: 'Yıllık Saha Deneyimi', desc: 'Güneş enerji santrallerinde kesintisiz saha tecrübesi.' },
  { icon: ThumbsUp,     num: '%95',  label: 'Müşteri Memnuniyeti',  desc: 'Hizmet sonrası müşteri memnuniyet oranımız.' },
  { icon: Users,        num: '17+',  label: 'Uzman Personel',       desc: 'Sertifikalı saha uzmanları ve teknik ekipten oluşan kadro.' },
]

const HERO_VIDEO_ALT = 'Soma GES otonom panel yıkama robotu saha temizliği'

export default function Hero() {
  return (
    <section
      className="relative w-full"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          aria-label={HERO_VIDEO_ALT}
          title={HERO_VIDEO_ALT}
          className="w-full h-full object-cover"
          poster="/hero-poster.webp"
          muted
          playsInline
          autoPlay
          loop
          preload="none"
        >
          <source src="/otonom-panel-yikama-robotu.webm" type="video/webm" />
          <source src="/otonom-panel-yikama-robotu.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.25) 100%)' }} />

      {/* Bottom gradient for controls */}
      <div className="absolute bottom-0 left-0 right-0 z-[1]" style={{ height: '200px', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />

      {/* Main content */}
      <div className="relative z-[2] flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-28 md:py-36 w-full">
          <div style={{ maxWidth: '620px' }}>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 'clamp(36px, 7vw, 88px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '0.03em',
                color: '#ffffff',
                margin: '0 0 20px',
              }}
            >
              Profesyonel<br />
              <span style={{ color: '#7FBF3A' }}>Güneş Paneli</span><br />
              Temizliği
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                fontWeight: 400,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.65)',
                maxWidth: '480px',
                marginBottom: '36px',
              }}
            >
              Soma merkezli, Türkiye geneli GES temizliği. Otonom robotlar ve
              veri odaklı solar panel yıkama hizmetleri ile güneş enerji santrallerinizde
              maksimum verim. Kirli panel kayıplarını sıfıra indirin.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/iletisim"
                onClick={() => trackEvent('cta_click', { location: 'hero', text: 'Ücretsiz Keşif Talep Et' })}
                className="hero-cta-primary inline-flex items-center gap-2.5 transition-all duration-200"
                style={{
                  padding: '13px 28px',
                  background: '#7FBF3A',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 20px rgba(127,191,58,0.4)',
                }}
              >
                Ücretsiz Keşif Talep Et
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/hizmetlerimiz"
                className="hero-cta-secondary inline-flex items-center gap-2 transition-all duration-200"
                style={{
                  padding: '13px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Hizmetleri Keşfet
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>



      {/* Floating info card — straddles hero & next section */}
      <div className="relative z-[5]" style={{ marginBottom: '-56px' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          {/* Desktop */}
          <div
            className="hidden md:flex"
            style={{ background: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}
          >
            {/* Left intro cell */}
            <div style={{ padding: '28px 28px', minWidth: '220px', maxWidth: '240px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <Sun style={{ position: 'absolute', right: '-16px', bottom: '-16px', width: '90px', height: '90px', color: '#7FBF3A', opacity: 0.07 }} />
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '10px' }}>
                Enerji Veriminizi Zirveye Taşıyın!
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                Kirli paneller enerji üretim verimliliğini %30 azaltmaktadır.
              </p>
            </div>

            {/* Stat columns */}
            {infoStats.map((s, i) => (
              <div
                key={i}
                style={{ flex: 1, padding: '28px 22px', borderRight: i < infoStats.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <s.icon style={{ width: '28px', height: '28px', color: '#7FBF3A', strokeWidth: 1.5, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(26px, 2.5vw, 34px)', fontWeight: 700, color: '#7FBF3A', lineHeight: 1 }}>
                  {s.num}
                </span>
                <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                  {s.label}
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: 2×2 grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {infoStats.map((s, i) => (
              <div
                key={i}
                style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '18px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.14)', borderBottom: '3px solid #7FBF3A', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <s.icon style={{ width: '22px', height: '22px', color: '#7FBF3A', strokeWidth: 1.5 }} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '28px', fontWeight: 700, color: '#7FBF3A', lineHeight: 1 }}>
                  {s.num}
                </span>
                <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {s.label}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
