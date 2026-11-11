import { kapsamBastanBelli } from './kapsam-bastan-belli'
import { malzemeEkipmanBizden } from './malzeme-ekipman-bizden'
import { ozelTemizlikTeklifi } from './ozel-temizlik-teklifi'
import { programinizaUygunTemizlik } from './programiniza-uygun-temizlik'
import { somaMerkezliTemizlik } from './soma-merkezli-temizlik'
import { temizlikSahaDeneyimi } from './temizlik-saha-deneyimi'
import type { NedenBizContent } from './types'

// WhyUs "Temizlik" sekmesindeki kart sırasıyla.
export const NEDEN_BIZ_TEMIZLIK: readonly NedenBizContent[] = [
  somaMerkezliTemizlik,
  temizlikSahaDeneyimi,
  malzemeEkipmanBizden,
  kapsamBastanBelli,
  programinizaUygunTemizlik,
  ozelTemizlikTeklifi,
]

export function getNedenBizContent(slug: string): NedenBizContent | undefined {
  return NEDEN_BIZ_TEMIZLIK.find((c) => c.slug === slug)
}
