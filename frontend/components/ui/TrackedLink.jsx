'use client'

import { trackEvent } from '@/lib/analytics'

// Sunucu component'lerinde (Footer, Contact vb.) tek bir <a> için client
// island — geri kalan ağacı client component'e çevirmeden GA4 tıklama
// olayını korur (tel:/mailto: linkleri).
export default function TrackedLink({ event, params, ...rest }) {
  return <a onClick={() => trackEvent(event, params)} {...rest} />
}
