import { useContext } from 'react'
import ThemeContext, { type ThemeContextValue } from './themeContextValue'

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useTheme, bir <ThemeProvider> içinde kullanılmalı')
  }
  return value
}
