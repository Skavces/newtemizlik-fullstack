'use client'

import { useState, type FormEvent } from 'react'
import { createFaq, updateFaq } from '@/lib/panelApi'
import { FAQ_SCOPES, type Faq, type FaqScope } from '@/types/api'

const SCOPE_LABELS: Record<FaqScope, string> = {
  genel: 'Genel',
  'panel-temizlik': 'Panel Temizlik',
  'panel-bakim': 'Panel Bakım',
  'robot-satisi': 'Robot Satışı',
}

interface SSSFormProps {
  initial: Faq | null
  onSave: () => void
  onCancel: () => void
}

export default function SSSForm({ initial, onSave, onCancel }: SSSFormProps) {
  const isEdit = Boolean(initial)
  const [question, setQuestion] = useState(initial?.question ?? '')
  const [answer, setAnswer] = useState(initial?.answer ?? '')
  const [scope, setScope] = useState<FaqScope>(initial?.scope ?? 'genel')
  const [published, setPublished] = useState(initial?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!question.trim()) { setError('Soru zorunludur.'); return }
    if (!answer.trim()) { setError('Cevap zorunludur.'); return }

    setSaving(true)
    try {
      const dto = { question, answer, scope, published }
      if (isEdit && initial) await updateFaq(initial.id, dto)
      else await createFaq(dto)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {isEdit ? 'Soruyu Düzenle' : 'Yeni Soru'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Soru *</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Sık sorulan soru"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Cevap *</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Sorunun cevabı"
            rows={6}
            className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Kapsam * <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(bu soru hangi sayfada görünsün)</span>
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as FaqScope)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          >
            {FAQ_SCOPES.map((s) => (
              <option key={s} value={s}>{SCOPE_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: 'var(--bg-alt)' }}>
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ background: published ? 'var(--color-primary)' : 'var(--border-subtle)' }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: published ? 'translateX(24px)' : 'translateX(4px)' }}
            />
          </button>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{published ? 'Yayında' : 'Gizli'}</p>
        </div>

        {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c' }}>{error}</div>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}
          >
            {saving ? 'Kaydediliyor...' : isEdit ? 'Kaydet' : 'Oluştur'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-6 py-3 text-sm"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}
