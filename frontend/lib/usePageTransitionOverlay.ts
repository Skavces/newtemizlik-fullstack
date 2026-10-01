'use client'

import { useEffect, useRef, useState } from 'react'

const OVERLAY_SHOW_DELAY_MS = 120
const OVERLAY_MIN_MS = 250
const OVERLAY_MAX_MS = 6000

// Next.js App Router da hedef sayfanın RSC payload'ı inene kadar pathname'i
// perde arkasında bekletiyor (navigasyon React transition içinde commit
// ediliyor) — yani pathname değişimini izlemek chunk/veri çekme yavaşsa
// animasyonu saniyelerce geç tetikliyor. Bunun yerine tıklamanın kendisini
// dinleyip animasyonu anında gösteriyoruz; pathname gerçekten değiştiğinde
// (= hedef sayfa hazır) kapatıyoruz.
//
// Hedef zaten prefetch edilmişse (aynı sayfaya ikinci ziyaret, ya da
// <Link>'in otomatik prefetch'i) geçiş birkaç ms içinde bitiyor — overlay'i
// o zaman göstermek gereksiz bir flaş yaratır. Bu yüzden overlay tıklamada
// değil, OVERLAY_SHOW_DELAY_MS sonra gösteriliyor; geçiş bu süre içinde
// zaten bitmişse gösterme hiç tetiklenmiyor. Gerçekten gösterildiyse flaş
// görünmemesi için en az OVERLAY_MIN_MS ekranda kalıyor. pathname hiç
// değişmezse (harici link, aynı sayfa, hash link vs.) OVERLAY_MAX_MS
// sonunda güvenlik amaçlı kapanıyor.
//
// renel-enerji/frontend/src/hooks/usePageTransitionOverlay.js ile birebir
// aynı mantık — tek fark pathname kaynağının react-router-dom yerine
// next/navigation'ın usePathname()'i olması.
export function usePageTransitionOverlay(pathname: string) {
  const [visible, setVisible] = useState(false)
  const shownAtRef = useRef(0)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // window.location.pathname, history.pushState ile TIKLAMA ANINDA değişiyor
  // (React'ın kendi pathname state'i transition yüzünden geç günceller) —
  // "hedef zaten aynı sayfa mı" kontrolünü window.location yerine React'ın
  // henüz commit ettiği son pathname'e göre yapmak için bu ref kullanılıyor.
  const pathnameRef = useRef(pathname)
  // "overlay şu an ekranda mı" sorusunun TEK doğru kaynağı — `visible` state'i
  // her değiştiğinde bu ref de AYNI ANDA (show/hide yardımcıları üzerinden)
  // güncelleniyor, böylece ikisi asla birbirinden ayrışamıyor.
  const visibleRef = useRef(false)

  function show() {
    visibleRef.current = true
    shownAtRef.current = performance.now()
    setVisible(true)
  }

  function hide() {
    visibleRef.current = false
    setVisible(false)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return
      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname === pathnameRef.current) return

      clearTimeout(showTimerRef.current)
      clearTimeout(hideTimerRef.current)
      clearTimeout(maxTimerRef.current)
      if (visibleRef.current) {
        // Önceki navigasyonun overlay'i hâlâ ekranda — yeniden göstermeye
        // gerek yok, sadece minimum gösterim süresini bu tıklamadan itibaren
        // yeniden başlat.
        shownAtRef.current = performance.now()
      } else {
        showTimerRef.current = setTimeout(show, OVERLAY_SHOW_DELAY_MS)
      }
      maxTimerRef.current = setTimeout(hide, OVERLAY_SHOW_DELAY_MS + OVERLAY_MAX_MS)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const isFirst = useRef(true)
  useEffect(() => {
    pathnameRef.current = pathname
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    clearTimeout(maxTimerRef.current)
    clearTimeout(showTimerRef.current)
    if (!visibleRef.current) return
    const remaining = OVERLAY_MIN_MS - (performance.now() - shownAtRef.current)
    if (remaining > 0) {
      hideTimerRef.current = setTimeout(hide, remaining)
    } else {
      hide()
    }
  }, [pathname])

  useEffect(() => () => {
    clearTimeout(showTimerRef.current)
    clearTimeout(hideTimerRef.current)
    clearTimeout(maxTimerRef.current)
  }, [])

  return visible
}
