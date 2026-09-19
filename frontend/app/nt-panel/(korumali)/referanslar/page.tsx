'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import { getAllReferencesAdmin, deleteReference, reorderReferences } from '@/lib/panelApi'
import { useDndReorder } from '@/lib/useDndReorder'
import { useToast } from '@/components/panel/ToastProvider'
import { useConfirm } from '@/components/panel/ConfirmProvider'
import { SortableList, SortableItem } from '@/components/panel/SortableList'
import type { Reference } from '@/types/api'

export default function ReferanslarListPage() {
  const [refs, setRefs] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const confirm = useConfirm()

  const { handleDragEnd } = useDndReorder(refs, setRefs, reorderReferences, setSaving, () =>
    showToast('error', 'Sıralama kaydedilemedi.'),
  )

  useEffect(() => {
    getAllReferencesAdmin()
      .then(setRefs)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string, name: string) {
    const ok = await confirm({ title: 'Referansı sil', message: `"${name}" referansını silmek istediğinize emin misiniz?`, destructive: true })
    if (!ok) return
    setDeletingId(id)
    try {
      await deleteReference(id)
      setRefs((prev) => prev.filter((r) => r.id !== id))
      showToast('success', 'Referans silindi.')
    } catch {
      showToast('error', 'Silinemedi.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Referanslar</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {refs.length} referans{saving && <span style={{ color: 'var(--color-primary)' }}> · kaydediliyor...</span>}
          </p>
        </div>
        <Link
          href="/nt-panel/referanslar/yeni"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <Plus size={16} /> Yeni Referans
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : refs.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-4">Henüz referans yok.</p>
          <Link href="/nt-panel/referanslar/yeni" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>İlk referansı ekle</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="overflow-x-auto">
            <SortableList ids={refs.map((r) => r.id)} onDragEnd={handleDragEnd}>
              <table className="w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wide" style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}>
                    <th className="w-10 px-4 py-4" />
                    <th className="w-20 px-3 py-4 text-left font-medium">Görsel</th>
                    <th className="px-5 py-4 text-left font-medium">Firma Adı</th>
                    <th className="px-5 py-4 text-left font-medium">Durum</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {refs.map((r) => (
                    <SortableItem key={r.id} id={r.id}>
                      {({ setNodeRef, style, dragHandleProps }) => (
                        <tr ref={setNodeRef} style={style}>
                          <td className="w-10 px-4 py-5">
                            <button {...dragHandleProps} className="cursor-grab touch-none" style={{ color: 'var(--text-faint)' }}>
                              <GripVertical size={18} />
                            </button>
                          </td>
                          <td className="px-3 py-5">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                              {r.logo ? (
                                <img src={r.logo} alt={r.name} className="max-h-14 max-w-full object-contain" />
                              ) : (
                                <span className="text-base font-bold" style={{ color: 'var(--text-faint)' }}>{r.name.charAt(0)}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                          </td>
                          <td className="px-5 py-5">
                            {r.published ? (
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-primary)' }}><Eye size={14} /> Yayında</span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-faint)' }}><EyeOff size={14} /> Gizli</span>
                            )}
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/nt-panel/referanslar/${r.id}/duzenle`} className="rounded-lg p-2" style={{ color: 'var(--text-faint)' }}>
                                <Pencil size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(r.id, r.name)}
                                disabled={deletingId === r.id}
                                className="rounded-lg p-2 disabled:opacity-40"
                                style={{ color: 'var(--text-faint)' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </SortableItem>
                  ))}
                </tbody>
              </table>
            </SortableList>
          </div>
        </div>
      )}
    </div>
  )
}
