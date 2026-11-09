import { apartmanSiteTemizligi } from './apartman-site-temizligi'
import { avmTemizligi } from './avm-temizligi'
import { bankaTemizligi } from './banka-temizligi'
import { disCepheCamTemizligi } from './dis-cephe-cam-temizligi'
import { evTemizligi } from './ev-temizligi'
import { fabrikaTemizligi } from './fabrika-temizligi'
import { insaatSonrasiTemizlik } from './insaat-sonrasi-temizlik'
import { koltukYikama } from './koltuk-yikama'
import { magazaTemizligi } from './magaza-temizligi'
import { ofisIsYeriTemizligi } from './ofis-is-yeri-temizligi'
import { okulTemizligi } from './okul-temizligi'
import { saglikKurulusuTemizligi } from './saglik-kurulusu-temizligi'
import type { ServiceContent } from './types'
import { villaTemizligi } from './villa-temizligi'

export const SERVICE_CONTENT: readonly ServiceContent[] = [
  evTemizligi,
  villaTemizligi,
  koltukYikama,
  apartmanSiteTemizligi,
  insaatSonrasiTemizlik,
  ofisIsYeriTemizligi,
  magazaTemizligi,
  bankaTemizligi,
  avmTemizligi,
  fabrikaTemizligi,
  okulTemizligi,
  saglikKurulusuTemizligi,
  disCepheCamTemizligi,
]

export function getServiceContent(slug: string): ServiceContent | undefined {
  return SERVICE_CONTENT.find((c) => c.slug === slug)
}
