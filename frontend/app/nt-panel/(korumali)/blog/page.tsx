'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import { getAllBlogPostsAdmin, deleteBlogPost, reorderBlogPosts } from '@/lib/panelApi'
import { formatDate } from '@/lib/date'
import { useDndReorder } from '@/lib/useDndReorder'
import { useToast } from '@/components/panel/ToastProvider'
import { useConfirm } from '@/components/panel/ConfirmProvider'
import { SortableList, SortableItem } from '@/components/panel/SortableList'
import type { BlogPost } from '@/types/api'

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const confirm = useConfirm()

  const { handleDragEnd } = useDndReorder(posts, setPosts, reorderBlogPosts, setSaving, () =>
    showToast('error', 'Sıralama kaydedilemedi.'),
  )

  useEffect(() => {
    getAllBlogPostsAdmin()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string, title: string) {
    const ok = await confirm({ title: 'Yazıyı sil', message: `"${title}" yazısını silmek istediğinize emin misiniz?`, destructive: true })
    if (!ok) return
    setDeletingId(id)
    try {
      await deleteBlogPost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      showToast('success', 'Yazı silindi.')
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
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Blog Yazıları</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {posts.length} yazı{saving && <span style={{ color: 'var(--color-primary)' }}> · kaydediliyor...</span>}
          </p>
        </div>
        <Link
          href="/nt-panel/blog/yeni"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          <Plus size={16} /> Yeni Yazı
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-4">Henüz blog yazısı yok.</p>
          <Link href="/nt-panel/blog/yeni" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>İlk yazıyı ekle</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="overflow-x-auto">
            <SortableList ids={posts.map((p) => p.id)} onDragEnd={handleDragEnd}>
              <table className="w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wide" style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}>
                    <th className="w-10 px-4 py-4" />
                    <th className="w-20 px-3 py-4 text-left font-medium">Kapak</th>
                    <th className="px-5 py-4 text-left font-medium">Başlık</th>
                    <th className="px-5 py-4 text-left font-medium">Tarih</th>
                    <th className="px-5 py-4 text-left font-medium">Durum</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <SortableItem key={post.id} id={post.id}>
                      {({ setNodeRef, style, dragHandleProps }) => (
                        <tr ref={setNodeRef} style={style}>
                          <td className="w-10 px-4 py-4">
                            <button {...dragHandleProps} className="cursor-grab touch-none" style={{ color: 'var(--text-faint)' }}>
                              <GripVertical size={18} />
                            </button>
                          </td>
                          <td className="w-20 px-3 py-4">
                            <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ background: 'var(--bg-alt)' }}>
                              {post.coverImage ? (
                                <Image src={post.coverImage} alt={post.title} fill sizes="64px" className="object-cover" />
                              ) : (
                                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Görsel yok</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{post.title}</p>
                            {post.excerpt && <p className="mt-0.5 line-clamp-1 text-sm" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>}
                            <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>/blog/{post.slug}</p>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(post.publishedAt ?? post.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            {post.published ? (
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-primary)' }}><Eye size={14} /> Yayında</span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-faint)' }}><EyeOff size={14} /> Taslak</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/nt-panel/blog/${post.id}/duzenle`} className="rounded-lg p-2" style={{ color: 'var(--text-faint)' }}>
                                <Pencil size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(post.id, post.title)}
                                disabled={deletingId === post.id}
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
