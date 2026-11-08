'use client'

import { useEffect, useState, useSyncExternalStore, type FocusEvent, type PointerEvent } from 'react'

const SLIDE_INTERVAL_MS = 7000
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

// Otomatik geçiş kuralları (WCAG 2.2.2):
// - Kullanıcı durdurabilir; açıkça "oynat" demedikçe reduced-motion'da hareket yok.
//   Global CSS kuralı transition'ları kısaltır ama JS zamanlayıcısını durdurmaz.
// - İçerik üzerinde fare varken, klavye odağı içerideyken ve sekme gizliyken döner durur.
export function useHeroSlider(slideCount: number) {
  const [active, setActive] = useState(0)
  const [userChoice, setUserChoice] = useState<'play' | 'pause' | null>(null)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
  const pageHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false)

  const isPlaying = userChoice ? userChoice === 'play' : !reducedMotion
  const isRotating = slideCount > 1 && isPlaying && !hovering && !focused && !pageHidden

  // setTimeout + active bağımlılığı: elle slayt değiştirince süre baştan başlar.
  useEffect(() => {
    if (!isRotating) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % slideCount), SLIDE_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [isRotating, active, slideCount])

  const pauseRegionProps = {
    onPointerEnter: (e: PointerEvent) => { if (e.pointerType === 'mouse') setHovering(true) },
    onPointerLeave: (e: PointerEvent) => { if (e.pointerType === 'mouse') setHovering(false) },
    // Yalnızca klavye odağı: fareyle tıklanan nokta butonu odakta kalıp dönüşü
    // süresiz durdurmasın. Form alanları her zaman focus-visible sayılır.
    onFocus: (e: FocusEvent) => { if (e.target.matches(':focus-visible')) setFocused(true) },
    onBlur: (e: FocusEvent) => {
      const next = e.relatedTarget
      if (!(next instanceof Node) || !e.currentTarget.contains(next)) setFocused(false)
    },
  }

  return {
    active,
    isPlaying,
    goTo: setActive,
    togglePlay: () => setUserChoice(isPlaying ? 'pause' : 'play'),
    pauseRegionProps,
  }
}
