'use client'

import { usePathname } from 'next/navigation'
import PageLoader from './PageLoader'
import { usePageTransitionOverlay } from '@/lib/usePageTransitionOverlay'

export default function PageTransitionOverlay() {
  const pathname = usePathname()
  const show = usePageTransitionOverlay(pathname)
  return <PageLoader fullScreen overlay show={show} />
}
