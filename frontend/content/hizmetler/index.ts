import { apartmanSiteTemizligi } from './apartman-site-temizligi'
import { evTemizligi } from './ev-temizligi'
import { insaatSonrasiTemizlik } from './insaat-sonrasi-temizlik'
import { koltukYikama } from './koltuk-yikama'
import type { ServiceContent } from './types'
import { villaTemizligi } from './villa-temizligi'

export const SERVICE_CONTENT: readonly ServiceContent[] = [
  evTemizligi,
  villaTemizligi,
  koltukYikama,
  apartmanSiteTemizligi,
  insaatSonrasiTemizlik,
]

export function getServiceContent(slug: string): ServiceContent | undefined {
  return SERVICE_CONTENT.find((c) => c.slug === slug)
}
