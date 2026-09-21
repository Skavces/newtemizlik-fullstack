'use client'

import { useRef, useEffect, type MouseEvent, type TouchEvent } from 'react'
import Image from 'next/image'
import type { Reference } from '@/types/api'

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

    singleWidthRef.current = track.scrollWidth / 3

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
  }, [])

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
      style={{ background: 'var(--bg-body)', padding: '72px 0' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-12">
        {/* Header — referans görseldeki gibi sol hizalı */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
            New Temizlik
          </span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', marginBottom: '12px' }}>
            Bizi Tercih Edenler
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px' }}>
            Güneşin olduğu her yerde enerjinin verimli üretimi için teknolojiler sunmaya güçlenerek devam ediyoruz.
          </p>
        </div>
      </div>

      {/* Scrolling logo track */}
      <div
        style={{ overflow: 'hidden', cursor: 'grab', userSelect: 'none' }}
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
          style={{ display: 'flex', gap: '16px', width: 'max-content', willChange: 'transform' }}
        >
          {looped.map((ref, i) => {
            const scale = Number(ref.scale)
            return (
              <div
                key={i}
                className="reference-logo-card"
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: '160px',
                  height: '88px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  padding: '18px 20px',
                  transition: 'border-color 0.2s',
                }}
              >
                {ref.logo && (
                  <Image
                    src={ref.logo}
                    alt={`${ref.name} logosu`}
                    fill
                    draggable={false}
                    sizes="160px"
                    style={{
                      objectFit: 'contain',
                      filter: 'grayscale(1) opacity(0.5)',
                      transform: scale && scale !== 1 ? `scale(${scale})` : undefined,
                      transition: 'filter 0.3s',
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
