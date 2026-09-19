'use client'

import { useCallback, useEffect, useRef } from 'react'

// Filtre/sayfa hızlı değiştiğinde önceki isteğin sonucu sonrakinin üstüne
// yazmasın diye sıra numarası (race guard). next() dispatch anında, isCurrent()
// sonuç geldiğinde çağrılır; unmount sonrası da false döner.
export function useLatestFetch() {
  const seq = useRef(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const next = useCallback(() => ++seq.current, [])
  const isCurrent = useCallback((requested: number) => mounted.current && requested === seq.current, [])

  return { next, isCurrent }
}
