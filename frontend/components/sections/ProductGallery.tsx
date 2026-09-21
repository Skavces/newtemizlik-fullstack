'use client'

import { useState, useEffect, type MouseEvent } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  src: string
  alt: string
}

export default function ProductGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lightboxPrev = (e: MouseEvent) => { e.stopPropagation(); setLightboxIndex((i) => ((i ?? 0) - 1 + photos.length) % photos.length) }
  const lightboxNext = (e: MouseEvent) => { e.stopPropagation(); setLightboxIndex((i) => ((i ?? 0) + 1) % photos.length) }

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => ((i ?? 0) - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => ((i ?? 0) + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, photos.length])

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        {photos.map((photo, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', width: 'calc(25% - 9px)', minWidth: '160px', aspectRatio: '1/1', background: 'var(--bg-card)', flexShrink: 0, cursor: 'pointer' }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="collage-img object-cover"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (() => {
        const photo = photos[lightboxIndex]
        return (
          <div
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
            >
              <X size={20} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            >
              {/* Prev */}
              <button
                onClick={lightboxPrev}
                style={{
                  position: 'absolute', left: '-60px',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <div style={{ position: 'relative', width: '80vw', height: '80vh', maxWidth: '900px', maxHeight: '900px' }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="90vw"
                  style={{ borderRadius: '12px', objectFit: 'contain' }}
                />
              </div>

              {/* Next */}
              <button
                onClick={lightboxNext}
                style={{
                  position: 'absolute', right: '-60px',
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  borderRadius: '50%', width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Counter */}
            <span style={{
              position: 'absolute', bottom: '20px',
              fontSize: '13px', color: 'rgba(255,255,255,0.5)',
            }}>
              {lightboxIndex + 1} / {photos.length}
            </span>
          </div>
        )
      })()}
    </>
  )
}
