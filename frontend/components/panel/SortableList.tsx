'use client'

// dnd-kit sarmalayıcıları. renel-enerji'de DndContext üç liste sayfasında
// <table> ile <tbody> arasına konmuştu (geçersiz HTML, React'in tolere ettiği
// ama bilinçli tekrarlanmaması gereken bir kalıp) — burada SortableList
// bilinçli olarak <table>'ın TAMAMINI (üst öğe olarak) sarmalayacak şekilde
// tasarlandı; SortableItem ise render-prop ile hangi kök elemanın (<tr>,
// <div>...) kullanılacağını çağırana bırakır.
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties, ReactNode } from 'react'

interface SortableListProps {
  ids: string[]
  onDragEnd: (event: DragEndEvent) => void
  children: ReactNode
}

export function SortableList({ ids, onDragEnd, children }: SortableListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

interface SortableItemRenderProps {
  setNodeRef: (node: HTMLElement | null) => void
  style: CSSProperties
  isDragging: boolean
  dragHandleProps: Record<string, unknown>
}

export function SortableItem({
  id,
  children,
}: {
  id: string
  children: (props: SortableItemRenderProps) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return <>{children({ setNodeRef, style, isDragging, dragHandleProps: { ...attributes, ...listeners } })}</>
}
