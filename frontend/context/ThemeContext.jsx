'use client'

import { useState, useEffect } from 'react'
import ThemeContext from './themeContextValue'

const STORAGE_KEY = 'nt-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  // İlk render sunucu ile aynı olsun diye 'light' ile başlar; mount sonrası
  // localStorage'daki tercih varsa uygulanır (eski sitede bu kalıcılık yoktu).
  // Bilinçli tek seferlik dış-sistem okuması — hidrasyon uyuşmazlığını önlemek
  // için lazy state yerine effect kullanılıyor.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
