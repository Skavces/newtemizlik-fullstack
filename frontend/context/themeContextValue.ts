import { createContext } from 'react'

export interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggle: () => void
}

// Fast Refresh / react-refresh kuralı: bir dosya hem component hem
// context/hook export ederse HMR context kimliğini kaybedip consumer'ları
// yeniden mount eder — bu yüzden context değeri ayrı dosyada (bkz.
// ThemeContext.tsx, useTheme.ts). Vite'daki NewTemizlik sitesinden birebir
// taşındı.
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export default ThemeContext
