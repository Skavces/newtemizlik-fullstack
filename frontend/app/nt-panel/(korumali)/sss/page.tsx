'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ChevronDown } from 'lucide-react'
import { getAllFaqsAdmin, deleteFaq, reorderFaqs } from '@/lib/panelApi'
import { useDndReorder } from '@/lib/useDndReorder'
import { useToast } from '@/components/panel/ToastProvider'
import { useConfirm } from '@/components/panel/ConfirmProvider'
import { SortableList, SortableItem } from '@/components/panel/SortableList'
import AdminTabs from '@/components/panel/AdminTabs'
import SSSForm from '@/components/panel/SSSForm'
import { FAQ_SCOPES, type Faq, type FaqScope } from '@/types/api'

const SCOPE_LABELS: Record<FaqScope, string> = {
  genel: 'Genel',
  'panel-temizlik': 'Panel Temizlik',
  'panel-bakim': 'Panel Bakım',
  'robot-satisi': 'Robot Satışı',
}

const SCOPE_TABS = [{ id: 'all', label: 'Tümü' }, ...FAQ_SCOPES.map((s) => ({ id: s, label: SCOPE_LABELS[s] }))]

export default function SSSListPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [scopeFilter, setScopeFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // null = kapalı, undefined = yeni, Faq = düzenleme
  const [editing, setEditing] = useState<Faq | null | undefined>(null)
  const { showToast } = useToast()
  const confirm = useConfirm()

  const { handleDragEnd } = useDndReorder(faqs, setFaqs, reorderFaqs, setSaving, () =>
    showToast('error', 'Sıralama kaydedilemedi.'),
  )

  // Kaydetme sonrası listeyi yenilemek için (SSSForm onSave) — mount'taki ilk
  // yüklemeden farklı olarak burada `loading` zaten false, yeniden true
  // yapılması gerekiyor. Mount effect'i senkron setState tetiklememesi için
  // ayrı, doğrudan bir fetch kullanıyor (bkz. react-hooks/set-state-in-effect).
  function reload() {
    setLoading(true)
    getAllFaqsAdmin()
      .then(setFaqs)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAllFaqsAdmin()
      .then(setFaqs)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (scopeFilter === 'all' ? faqs : faqs.filter((f) => f.scope === scopeFilter)),
    [faqs, scopeFilter],
  )

  async function handleDelete(id: string, question: string) {
    const ok = await confirm({ title: 'Soruyu sil', message: `"${question}" sorusunu silmek istediğinize emin misiniz?`, destructive: true })
    if (!ok) return
    setDeletingId(id)
    try {
      await deleteFaq(id)
      setFaqs((prev) => prev.filter((f) => f.id !== id))
      showToast('success', 'Soru silindi.')
    } catch {
      showToast('error', 'Silinemedi.')
    } finally {
      setDeletingId(null)
    }
  }

  if (editing !== null) {
    return (
      <SSSForm
        initial={editing ?? null}
        onSave={() => { setEditing(null); reload() }}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>S.S.S.</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {faqs.length} soru{saving && <span style={{ color: 'var(--color-primary)' }}> · kaydediliyor...</span>}
          </p>
        </div>
        <button
          onClick={() => setEditing(undefined)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <Plus size={16} /> Yeni Soru
        </button>
      </div>

      <div className="mb-5">
        <AdminTabs items={SCOPE_TABS} value={scopeFilter} onChange={(v) => setScopeFilter(String(v))} size="sm" wrap />
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-4">{faqs.length === 0 ? 'Henüz soru yok.' : 'Bu kapsamda soru yok.'}</p>
          {faqs.length === 0 && (
            <button onClick={() => setEditing(undefined)} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>İlk soruyu ekle</button>
          )}
        </div>
      ) : (
        <SortableList ids={filtered.map((f) => f.id)} onDragEnd={handleDragEnd}>
          <div className="space-y-2">
            {filtered.map((faq) => {
              const expanded = expandedId === faq.id
              return (
                <SortableItem key={faq.id} id={faq.id}>
                  {({ setNodeRef, style, dragHandleProps }) => (
                    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-xl" data-background>
                      <div
                        className="flex items-center gap-3 px-5 py-4"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                      >
                        <button {...dragHandleProps} className="shrink-0 cursor-grab touch-none" style={{ color: 'var(--text-faint)' }}>
                          <GripVertical size={20} />
                        </button>
                        <button onClick={() => setExpandedId(expanded ? null : faq.id)} className="flex flex-1 items-center gap-3 text-left">
                          <p className="flex-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{faq.question}</p>
                          <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}>
                            {SCOPE_LABELS[faq.scope]}
                          </span>
                          <ChevronDown size={16} style={{ color: 'var(--text-faint)', transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
                        </button>
                        <div className="flex shrink-0 items-center gap-1">
                          {faq.published ? (
                            <span className="hidden items-center gap-1 rounded-full px-2 py-1 text-xs sm:flex" style={{ color: 'var(--color-primary)', background: 'rgba(127,191,58,0.1)' }}>
                              <Eye size={12} /> Yayında
                            </span>
                          ) : (
                            <span className="hidden items-center gap-1 rounded-full px-2 py-1 text-xs sm:flex" style={{ color: 'var(--text-faint)', background: 'var(--bg-alt)' }}>
                              <EyeOff size={12} /> Gizli
                            </span>
                          )}
                          <button onClick={() => setEditing(faq)} className="rounded-lg p-2" style={{ color: 'var(--text-faint)' }}>
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id, faq.question)}
                            disabled={deletingId === faq.id}
                            className="rounded-lg p-2 disabled:opacity-40"
                            style={{ color: 'var(--text-faint)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {expanded && (
                        <p className="px-5 pt-3 pb-1 pl-13 text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  )}
                </SortableItem>
              )
            })}
          </div>
        </SortableList>
      )}
    </div>
  )
}
