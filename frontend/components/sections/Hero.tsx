'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, FolderCheck, CalendarDays, Pause, Play, Sparkles, ThumbsUp, Users, type LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { TEAM_SIZE } from '@/lib/companyStats'
import { getServicesByCategory, SERVICE_CATEGORIES } from '@/lib/services'
import { useHeroSlider } from '@/lib/useHeroSlider'
import HeroQuoteForm from './HeroQuoteForm'

interface InfoStat {
  icon: LucideIcon
  num: string
  label: string
  desc: string
}

const infoStats: InfoStat[] = [
  { icon: FolderCheck,  num: '195+', label: 'Tamamlanan Proje',    desc: 'Başarıyla teslim edilen temizlik ve GES projeleri.' },
  { icon: CalendarDays, num: '5+',   label: 'Yıllık Saha Deneyimi', desc: 'Temizlik ve güneş enerji santrali işlerinde saha tecrübesi.' },
  { icon: ThumbsUp,     num: '%95',  label: 'Müşteri Memnuniyeti',  desc: 'Hizmet sonrası müşteri memnuniyet oranımız.' },
  { icon: Users,        num: TEAM_SIZE, label: 'Uzman Personel',    desc: 'Sertifikalı saha uzmanları ve teknik ekipten oluşan kadro.' },
]

const HERO_VIDEO_ALT = 'Soma GES otonom panel yıkama robotu saha temizliği'

interface HeroSlide {
  id: 'temizlik' | 'ges'
  name: string
  eyebrow: string
  lead: string
  primary: string
  secondary: { label: string; href: string }
}

const TEMIZLIK_SLIDE: HeroSlide = {
  id: 'temizlik',
  name: 'Temizlik',
  eyebrow: SERVICE_CATEGORIES.temizlik.label,
  lead: 'Soma ve Manisa çevresinde ev, iş yeri ve kurum temizliği. Mekânınıza göre planlanan profesyonel hizmet için hemen teklif alın.',
  primary: 'Teklif Alın',
  secondary: { label: 'Temizlik Hizmetleri', href: `/hizmetlerimiz#${SERVICE_CATEGORIES.temizlik.anchor}` },
}

const GES_SLIDE: HeroSlide = {
  id: 'ges',
  name: 'GES',
  eyebrow: SERVICE_CATEGORIES.ges.label,
  lead: 'Soma merkezli, Türkiye geneli GES temizliği. Otonom robotlar ve veri odaklı solar panel yıkama hizmetleri ile güneş enerji santrallerinizde maksimum verim. Kirli panel kayıplarını sıfıra indirin.',
  primary: 'Ücretsiz Keşif Talep Et',
  secondary: { label: 'GES Hizmetleri', href: `/hizmetlerimiz#${SERVICE_CATEGORIES.ges.anchor}` },
}

// Temizlik slaytı, ilk temizlik grubu yayına alınınca (P7) görünür: öncesinde
// teklif formunda temizlik seçeneği ve temizlik sayfası yok, slayt çıkmaza götürürdü.
const slides: HeroSlide[] = getServicesByCategory('temizlik').length > 0
  ? [TEMIZLIK_SLIDE, GES_SLIDE]
  : [GES_SLIDE]
const VIDEO_SLIDE_INDEX = slides.indexOf(GES_SLIDE)

// Slayt metinleri aynı grid hücresine yığılır: kutu en uzun metnin yüksekliğini
// alır, geçişte form ve kartlar kaymaz (CLS 0). visibility: gizli CTA Tab sırasına girmez.
function slideLayerStyle(isActive: boolean) {
  return {
    gridArea: '1 / 1',
    opacity: isActive ? 1 : 0,
    visibility: isActive ? 'visible' : 'hidden',
    transition: 'opacity 700ms ease, visibility 700ms',
  } as const
}

function backgroundLayerStyle(isActive: boolean) {
  return { opacity: isActive ? 1 : 0, transition: 'opacity 700ms ease' }
}

export default function Hero() {
  const { active, isPlaying, goTo, togglePlay, pauseRegionProps } = useHeroSlider(slides.length)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideoActive = active === VIDEO_SLIDE_INDEX

  // Video yalnızca kendi slaytındayken ve kullanıcı durdurmamışken oynar.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isVideoActive && isPlaying) {
      // Tarayıcı otomatik oynatmayı reddederse poster görünür kalır.
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isVideoActive, isPlaying])

  return (
    <section className="relative w-full" style={{ position: 'relative', zIndex: 2 }}>

      {/* 100dvh hero görseli — arka plan, overlay, başlık ve dalga hep bu kutunun
          içinde: sayfa hiç kaydırılmadan (ilk ekran) dalga görünür kalır. */}
      <div className="relative" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Slayt arka planları */}
        {slides.includes(TEMIZLIK_SLIDE) && (
          <div className="absolute inset-0 z-0" style={backgroundLayerStyle(!isVideoActive)} aria-hidden={isVideoActive}>
            <Image
              src="/gorseller/hero-temizlik-v3.webp"
              alt="Aydınlık bir salonda profesyonel temizlik çalışması"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        )}
        <div className="absolute inset-0 z-0" style={backgroundLayerStyle(isVideoActive)} aria-hidden={!isVideoActive}>
          <video
            ref={videoRef}
            aria-label={HERO_VIDEO_ALT}
            title={HERO_VIDEO_ALT}
            className="w-full h-full object-cover"
            poster="/hero-poster.webp"
            muted
            playsInline
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
              <div style={{ maxWidth: '620px', marginTop: '40px', flexShrink: 0 }} {...pauseRegionProps}>

                {/* Eyebrow — slayta göre */}
                <div style={{ display: 'grid', marginBottom: '14px' }}>
                  {slides.map((slide, i) => (
                    <span
                      key={slide.id}
                      aria-hidden={i !== active}
                      style={{
                        ...slideLayerStyle(i === active),
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: '#7FBF3A',
                      }}
                    >
                      {slide.eyebrow}
                    </span>
                  ))}
                </div>

                {/* H1 — sabit: slayta göre değişse sayfada iki H1 ya da gizli başlık olurdu */}
                <h1
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 'clamp(30px, 5.5vw, 60px)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: '0.03em',
                    color: '#ffffff',
                    margin: '0 0 20px',
                  }}
                >
                  Soma&apos;da Profesyonel<br />
                  <span style={{ color: '#7FBF3A' }}>Temizlik ve</span><br />
                  GES Panel Bakımı
                </h1>

                {/* Lead ve CTA'lar — slayta göre */}
                <div style={{ display: 'grid' }} aria-live={isPlaying ? 'off' : 'polite'}>
                  {slides.map((slide, i) => (
                    <div key={slide.id} aria-hidden={i !== active} style={slideLayerStyle(i === active)}>
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
                        {slide.lead}
                      </p>

                      <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: '36px' }}>
                        <Link
                          href="#teklif-form"
                          onClick={() => trackEvent('cta_click', { location: 'hero', text: slide.primary, slide: slide.id })}
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
                          {slide.primary}
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                          href={slide.secondary.href}
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
                          {slide.secondary.label}
                          <ChevronDown className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Durdur/oynat + slayt noktaları. Tek slaytta da durdur butonu kalır:
                    5 sn'den uzun süren döngülü video için WCAG 2.2.2 gereği. */}
                <div role="group" aria-label="Hero hareket kontrolleri" className="flex items-center" style={{ marginTop: '20px', marginLeft: '-13px' }}>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Hareketi durdur' : 'Hareketi başlat'}
                    className="hero-control w-11 h-11 flex items-center justify-center cursor-pointer"
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)' }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  {slides.length > 1 && slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Slayt ${i + 1}: ${slide.name}`}
                      aria-current={i === active ? 'true' : undefined}
                      className="hero-control w-11 h-11 flex items-center justify-center cursor-pointer"
                      style={{ background: 'none', border: 'none' }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '9999px',
                          border: '1.5px solid #ffffff',
                          background: i === active ? '#ffffff' : 'transparent',
                          transition: 'background 0.2s',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side quote form — sahadaki "Ücretsiz Keşif Talep Et" talebini
                  doğrudan hero'da toplar, aynı /quote uç noktasına gider (bkz. HeroQuoteForm) */}
              <div id="teklif-form" className="w-full lg:ml-auto scroll-mt-24" style={{ maxWidth: '420px' }} {...pauseRegionProps}>
                <HeroQuoteForm />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave — renel-enerji/frontend/src/components/Hero.jsx ile birebir aynı
            desen ve zamanlama, yalnızca renk var(--bg-body)'ye uyarlandı. */}
        <div className="absolute -bottom-px left-0 right-0 overflow-hidden leading-none h-20 z-[2]" aria-hidden="true">
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
              <Sparkles style={{ position: 'absolute', right: '-16px', bottom: '-16px', width: '90px', height: '90px', color: '#7FBF3A', opacity: 0.07 }} />
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '10px' }}>
                Temizlikte ve GES&apos;te Yanınızdayız
              </p>
              <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                Evinizden güneş santralinize, profesyonel temizlik ve bakım.
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
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
                  {s.label}
                </p>
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
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
