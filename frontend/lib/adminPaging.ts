import type { PagedMeta } from '@/types/api'

// Sayfalı bir yanıtı uygularken: dönen sayfa boşsa VE istenen sayfa aralık
// dışındaysa (ör. son kayıt silindikten sonra 3. sayfada kalınmışsa) page'i
// son geçerli sayfaya (pageCount) çeker — -1 değil, mutlak değere.
export function applyPagedResult<T extends PagedMeta>(
  items: unknown[],
  result: T,
  setPage: (page: number) => void,
  setData: (data: T) => void,
): void {
  setData(result)
  if (items.length === 0 && result.page > result.pageCount) {
    setPage(result.pageCount)
  }
}
