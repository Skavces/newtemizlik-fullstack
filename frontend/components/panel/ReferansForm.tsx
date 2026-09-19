'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { getAllReferencesAdmin, createReference, updateReference, uploadReferenceLogo } from '@/lib/panelApi'
import { useToast } from './ToastProvider'

interface ReferansFormState {
  name: string
  scale: number
  published: boolean
}

const EMPTY: ReferansFormState = { name: '', scale: 1, published: true }

export default function ReferansForm({ referenceId }: { referenceId?: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const isEdit = Boolean(referenceId)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ReferansFormState>(EMPTY)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!referenceId) return
    getAllReferencesAdmin().then((list) => {
      const ref = list.find((r) => r.id === referenceId)
      if (!ref) {
        router.push('/nt-panel/referanslar')
        return
      }
      setForm({ name: ref.name, scale: Number(ref.scale), published: ref.published })
      if (ref.logo) setLogoPreview(ref.logo)
      setLoading(false)
    })
  }, [referenceId, router])

  function set<K extends keyof ReferansFormState>(key: K, value: ReferansFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function removeLogo() {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Firma adı zorunludur.'); return }

    setSaving(true)
    try {
      const dto = { name: form.name, scale: form.scale, published: form.published }
      const ref = isEdit ? await updateReference(referenceId!, dto) : await createReference(dto)
      if (logoFile) await uploadReferenceLogo(ref.id, logoFile)
      showToast('success', isEdit ? 'Referans güncellendi.' : 'Referans oluşturuldu.')
      router.push('/nt-panel/referanslar')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => router.push('/nt-panel/referanslar')}
        className="mb-6 flex items-center gap-1.5 text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={14} /> Geri
      </button>

      <h1 className="mb-6 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {isEdit ? 'Referansı Düzenle' : 'Yeni Referans'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c' }}>{error}</div>}

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Logo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="logo" className="max-h-24 max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeLogo() }}
                    className="absolute top-2 right-2 rounded-full p-1"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}
                  >
                    <X size={13} />
                  </button>
                  <p className="mt-3 text-xs" style={{ color: 'var(--text-faint)' }}>Değiştirmek için tıkla</p>
                </>
              ) : (
                <>
                  <Upload size={22} style={{ color: 'var(--text-faint)' }} className="mb-2" />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Logo yükle</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>PNG, JPG, WebP</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Firma / Müşteri Adı <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Örn: Ahmet Yılmaz Tarım İşletmesi"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Görsel Ölçek <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(dar/uzun logoları dengelemek için, 0.5–2.0)</span>
            </label>
            <input
              type="number"
              min={0.5}
              max={2}
              step={0.05}
              value={form.scale}
              onChange={(e) => set('scale', Number(e.target.value))}
              className="w-32 rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 py-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set('published', e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yayınla</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/nt-panel/referanslar')}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg px-6 py-2 text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ background: 'var(--color-primary)' }}
          >
            {saving ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
