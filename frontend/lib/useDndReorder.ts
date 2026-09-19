'use client'

import { useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

// renel-enerji'deki useDndReorder.ts'in portu — sensörler burada değil,
// SortableList component'inde yaşıyor (bkz. components/panel/SortableList.tsx);
// bu hook yalnızca iyimser sıra değişimi + hata durumunda geri alma mantığını
// taşır. İyimser güncelleme: önce local state değişir, backend'e reorderFn
// gönderilir, başarısız olursa önceki sıraya dönülür.
export function useDndReorder<T extends { id: string }>(
  items: T[],
  setItems: (items: T[]) => void,
  reorderFn: (orderedIds: string[]) => Promise<void>,
  setSaving?: (saving: boolean) => void,
  onError?: (err: unknown) => void,
) {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const previous = items
      const reordered = arrayMove(items, oldIndex, newIndex)
      setItems(reordered)
      setSaving?.(true)

      reorderFn(reordered.map((i) => i.id))
        .catch((err) => {
          setItems(previous)
          onError?.(err)
        })
        .finally(() => setSaving?.(false))
    },
    [items, setItems, reorderFn, setSaving, onError],
  )

  return { handleDragEnd }
}
