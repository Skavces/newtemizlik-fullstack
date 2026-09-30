'use client'

import { useRef, useEffect, type MouseEvent, type TouchEvent } from 'react'
import Image from 'next/image'
import type { Reference } from '@/types/api'
import SectionHeader from '@/components/ui/SectionHeader'

// references artık backend'den geliyor (GET /api/references) — sayfa (server
// component) veriyi çekip prop olarak geçer, bu bileşen sadece marquee animasyonunu yürütür.
export default function Referanslar({ references }: { references: Reference[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)
  const singleWidthRef = useRef(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartPos = useRef(0)
  const isPaused = useRef(false)
  const SPEED = 0.5 // px per frame

  // Sonsuz döngü için listeyi 3 kez tekrarla
  const looped = [...references, ...references, ...references]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // scrollWidth/3 kayan noktalı bir yaklaşım — 3N öğe arasında (3N-1) gap
    // varken bu, tek bir setin gerçek periyodundan (N öğe + N gap) gap/3
    // kadar sapar ve her turda görünür bir sıçramaya (kesinti) yol açar.
    // Gerçek periyot: 2. kopyanın ilk öğesiyle 1. kopyanın ilk öğesi arasındaki mesafe.
    const singleSetLength = references.length
    const firstOfSecondSet = track.children[singleSetLength] as HTMLElement | undefined
    const firstItem = track.children[0] as HTMLElement | undefined
    singleWidthRef.current = firstOfSecondSet && firstItem
      ? firstOfSecondSet.offsetLeft - firstItem.offsetLeft
      : track.scrollWidth / 3

    function animate() {
      if (!isPaused.current && track) {
        posRef.current += SPEED
        if (posRef.current >= singleWidthRef.current) {
          posRef.current -= singleWidthRef.current
        }
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [references.length])

  // Mouse drag
  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    isDragging.current = true
    isPaused.current = true
    dragStartX.current = e.clientX
    dragStartPos.current = posRef.current
    e.preventDefault()
  }

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return
    const delta = dragStartX.current - e.clientX
    const track = trackRef.current
    const singleWidth = singleWidthRef.current
    let newPos = dragStartPos.current + delta
    if (newPos < 0) newPos += singleWidth
    if (newPos >= singleWidth) newPos -= singleWidth
    posRef.current = newPos
    if (track) track.style.transform = `translateX(-${posRef.current}px)`
  }

  function onMouseUp() {
    isDragging.current = false
    isPaused.current = false
  }

  // Touch drag
  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    isPaused.current = true
    dragStartX.current = e.touches[0].clientX
    dragStartPos.current = posRef.current
  }

  function onTouchMove(e: TouchEvent<HTMLDivElement>) {
    const delta = dragStartX.current - e.touches[0].clientX
    const track = trackRef.current
    const singleWidth = singleWidthRef.current
    let newPos = dragStartPos.current + delta
    if (newPos < 0) newPos += singleWidth
    if (newPos >= singleWidth) newPos -= singleWidth
    posRef.current = newPos
    if (track) track.style.transform = `translateX(-${posRef.current}px)`
  }

  function onTouchEnd() {
    isPaused.current = false
  }

  return (
    <section
      id="referanslar"
      className="scroll-mt-16 md:scroll-mt-20"
      style={{ background: 'var(--bg-alt)', padding: '0 0 120px' }}
    >
      {/* Top gradient bar — Footer'daki ile aynı, bölümün en üst kenarında */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-12" style={{ paddingTop: '72px' }}>
        <div className="text-center">
          <SectionHeader
            eyebrow="New Temizlik"
            title="Bizi Tercih Edenler"
            titleSize="clamp(26px, 3.8vw, 40px)"
            lead="Güneşin olduğu her yerde enerjinin verimli üretimi için teknolojiler sunmaya güçlenerek devam ediyoruz."
            align="center"
          />
        </div>
      </div>

      {/* Scrolling logo track */}
      <div
        style={{ overflow: 'hidden', cursor: 'grab', userSelect: 'none', marginTop: '64px' }}
        onMouseDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; onMouseDown(e) }}
        onMouseMove={onMouseMove}
        onMouseUp={(e) => { e.currentTarget.style.cursor = 'grab'; onMouseUp() }}
        onMouseLeave={(e) => { e.currentTarget.style.cursor = 'grab'; onMouseUp() }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: '56px', width: 'max-content', willChange: 'transform' }}
        >
          {looped.map((ref, i) => {
            const scale = Number(ref.scale)
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: '240px',
                  height: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                }}
              >
                {ref.logo && (
                  <Image
                    src={ref.logo}
                    alt={`${ref.name} logosu`}
                    fill
                    draggable={false}
                    sizes="240px"
                    style={{
                      objectFit: 'contain',
                      padding: '16px',
                      transform: scale && scale !== 1 ? `scale(${scale})` : undefined,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
