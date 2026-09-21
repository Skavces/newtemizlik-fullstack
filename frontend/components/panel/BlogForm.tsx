'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { getAllBlogPostsAdmin, createBlogPost, updateBlogPost, uploadBlogCover } from '@/lib/panelApi'
import { SITE_URL } from '@/lib/seo'
import { useToast } from './ToastProvider'
import RichTextEditor from './RichTextEditor'

// Backend `toSlug()`/`uniqueSlug()` ile aynı karakter çevirisi (bkz.
// backend/src/blog/blog.service.ts) — burada yalnızca canlı önizleme için,
// gerçek benzersizlik/kısaltma garantisi backend'de.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface BlogFormState {
  title: string
  slug: string
  excerpt: string
  metaDescription: string
  content: string
  published: boolean
}

const EMPTY: BlogFormState = { title: '', slug: '', excerpt: '', metaDescription: '', content: '', published: false }

export default function BlogForm({ postId }: { postId?: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const isEdit = Boolean(postId)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<BlogFormState>(EMPTY)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [slugManual, setSlugManual] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!postId) return
    getAllBlogPostsAdmin().then((posts) => {
      const post = posts.find((p) => p.id === postId)
      if (!post) {
        router.push('/nt-panel/blog')
        return
      }
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        metaDescription: post.metaDescription ?? '',
        content: post.content,
        published: post.published,
      })
      if (post.coverImage) setCoverPreview(post.coverImage)
      setSlugManual(true)
      setLoading(false)
    })
  }, [postId, router])

  function set<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleTitleChange(val: string) {
    set('title', val)
    if (!slugManual) set('slug', slugify(val))
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function removeCover() {
    setCoverFile(null)
    setCoverPreview(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Başlık zorunludur.'); return }
    if (!form.slug.trim()) { setError('Slug zorunludur.'); return }
    if (!form.content.trim()) { setError('İçerik zorunludur.'); return }

    setSaving(true)
    try {
      const dto = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        metaDescription: form.metaDescription || undefined,
        content: form.content,
        published: form.published,
      }
      const post = isEdit ? await updateBlogPost(postId!, dto) : await createBlogPost(dto)
      if (coverFile) await uploadBlogCover(post.id, coverFile)
      showToast('success', isEdit ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.')
      router.push('/nt-panel/blog')
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
    <div>
      <button
        onClick={() => router.push('/nt-panel/blog')}
        className="mb-6 flex items-center gap-2 text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={16} /> Blog Yazıları
      </button>

      <h1 className="mb-6 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {isEdit ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Başlık *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Yazı başlığı"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => { setSlugManual(true); set('slug', e.target.value) }}
            placeholder="url-adresi"
            className="w-full rounded-xl px-4 py-3 font-mono text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>
            {SITE_URL.replace(/^https?:\/\//, '')}/blog/{form.slug || '...'}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Kısa Özet</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="Blog listesinde görünecek kısa açıklama (opsiyonel)"
            rows={2}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Meta Açıklama <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(Google arama sonucu)</span>
          </label>
          <textarea
            value={form.metaDescription}
            onChange={(e) => set('metaDescription', e.target.value)}
            placeholder="Boş bırakılırsa kısa özet kullanılır. Maks. 160 karakter önerilir."
            rows={2}
            maxLength={160}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none"
            style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>{form.metaDescription.length}/160</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Kapak Görseli</label>
          {coverPreview ? (
            <div className="group relative h-52 w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: object URL (URL.createObjectURL), next/image can't optimize it */}
              <img src={coverPreview} alt="Kapak" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={removeCover}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <Upload size={22} />
              Kapak görseli yükle
            </button>
          )}
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>İçerik *</label>
          <RichTextEditor value={form.content} onChange={(val) => set('content', val)} />
        </div>

        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: 'var(--bg-alt)' }}>
          <button
            type="button"
            onClick={() => set('published', !form.published)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ background: form.published ? 'var(--color-primary)' : 'var(--border-subtle)' }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: form.published ? 'translateX(24px)' : 'translateX(4px)' }}
            />
          </button>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{form.published ? 'Yayında' : 'Taslak'}</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{form.published ? 'Yazı herkese görünür' : 'Yalnızca admin görebilir'}</p>
          </div>
        </div>

        {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c' }}>{error}</div>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}
          >
            {saving ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Yazıyı Oluştur'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/nt-panel/blog')}
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
