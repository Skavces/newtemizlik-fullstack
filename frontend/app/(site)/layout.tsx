import type { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </ThemeProvider>
  )
}
