'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown, FolderCheck, CalendarDays, ThumbsUp, Users, Sun, type LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { TEAM_SIZE } from '@/lib/companyStats'
import HeroQuoteForm from './HeroQuoteForm'

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
  { icon: Users,        num: TEAM_SIZE, label: 'Uzman Personel',    desc: 'Sertifikalı saha uzmanları ve teknik ekipten oluşan kadro.' },
]

const HERO_VIDEO_ALT = 'Soma GES otonom panel yıkama robotu saha temizliği'

export default function Hero() {
  return (
    <section className="relative w-full" style={{ position: 'relative', zIndex: 2 }}>

      {/* 100dvh hero görseli — video, overlay, başlık ve dalga hep bu kutunun
          içinde: sayfa hiç kaydırılmadan (ilk ekran) dalga görünür kalır. */}
      <div className="relative" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
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
          <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-44 md:py-36 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14">
              <div style={{ maxWidth: '620px', marginTop: '40px', flexShrink: 0 }}>

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
                    margin: 0,
                  }}
                >
                  Soma merkezli, Türkiye geneli GES temizliği. Otonom robotlar ve
                  veri odaklı solar panel yıkama hizmetleri ile güneş enerji santrallerinizde
                  maksimum verim. Kirli panel kayıplarını sıfıra indirin.
                </p>

                {/* CTAs */}
                <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: '36px' }}>
                  <Link
                    href="#teklif-form"
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

              {/* Right side quote form — sahadaki "Ücretsiz Keşif Talep Et" talebini
                  doğrudan hero'da toplar, aynı /quote uç noktasına gider (bkz. HeroQuoteForm) */}
              <div id="teklif-form" className="w-full lg:ml-auto scroll-mt-24" style={{ maxWidth: '420px' }}>
                <HeroQuoteForm />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave — renel-enerji/frontend/src/components/Hero.jsx ile birebir aynı
            desen ve zamanlama, yalnızca renk var(--bg-body)'ye uyarlandı. */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none h-20 z-[2]" aria-hidden="true">
          <svg className="absolute bottom-0 w-[200%] h-full animate-[hero-wave_8s_linear_infinite]" viewBox="0 0 2880 80" preserveAspectRatio="none" fill="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,0 2880,40 L2880,80 L0,80 Z" fill="var(--bg-body)" fillOpacity="0.4" />
          </svg>
          <svg className="absolute bottom-0 w-[200%] h-full animate-[hero-wave_5s_linear_infinite]" viewBox="0 0 2880 80" preserveAspectRatio="none" fill="none">
            <path d="M0,55 C240,20 480,70 720,45 C960,20 1200,70 1440,45 C1680,20 1920,70 2160,45 C2400,20 2640,70 2880,45 L2880,80 L0,80 Z" fill="var(--bg-body)" />
          </svg>
        </div>
      </div>

      {/* Floating info card — straddles hero & next section */}
      <div className="relative z-[5]" style={{ marginTop: '-120px', marginBottom: '-56px' }}>
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
                <s.icon style={{ width: '28px', height: '28px', color: 'var(--color-secondary)', strokeWidth: 1.5, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 'clamp(26px, 2.5vw, 34px)', fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1 }}>
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
                style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '18px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.14)', borderBottom: '3px solid var(--color-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <s.icon style={{ width: '22px', height: '22px', color: 'var(--color-secondary)', strokeWidth: 1.5 }} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1 }}>
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
