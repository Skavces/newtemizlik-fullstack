'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, HelpCircle, Images, Inbox, AlertCircle, Plus } from 'lucide-react'
import { getAllBlogPostsAdmin, getAllFaqsAdmin, getAllReferencesAdmin, getQuoteAdminList, getLogAdminList } from '@/lib/panelApi'
import AdminStatCard from '@/components/panel/AdminStatCard'

interface DashboardStats {
  blogCount: number
  faqCount: number
  referenceCount: number
  pendingQuotes: number
  errors24h: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    Promise.all([
      getAllBlogPostsAdmin(),
      getAllFaqsAdmin(),
      getAllReferencesAdmin(),
      getQuoteAdminList({ status: 'new' }),
      getLogAdminList(),
    ]).then(([posts, faqs, references, quotes, logs]) => {
      setStats({
        blogCount: posts.length,
        faqCount: faqs.length,
        referenceCount: references.length,
        pendingQuotes: quotes.stats.new,
        errors24h: logs.stats.errors24h,
      })
    })
    // panelFetch 401'i zaten merkezi olarak /nt-panel/giris'e yönlendiriyor —
    // burada ayrı bir catch/redirect gerekmiyor.
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif", color: 'var(--text-primary)' }}>
        Hoş Geldiniz
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Sol menüden yönetmek istediğiniz bölümü seçin.
      </p>

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <AdminStatCard label="Blog Yazısı" value={stats.blogCount} icon={FileText} />
            <AdminStatCard label="S.S.S." value={stats.faqCount} icon={HelpCircle} />
            <AdminStatCard label="Referans" value={stats.referenceCount} icon={Images} />
            <AdminStatCard label="Bekleyen Teklif" value={stats.pendingQuotes} icon={Inbox} />
            <Link href="/nt-panel/loglar">
              <AdminStatCard label="Son 24s Hata" value={stats.errors24h} icon={AlertCircle} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/nt-panel/blog/yeni"
              className="rounded-xl p-5 transition-colors hover:bg-black/2"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--color-primary)' }}
            >
              <p className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                Yeni Blog Yazısı <Plus size={15} />
              </p>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Ekle ve yayınla</p>
            </Link>
            <Link
              href="/nt-panel/referanslar/yeni"
              className="rounded-xl p-5 transition-colors hover:bg-black/2"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--color-primary)' }}
            >
              <p className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                Yeni Referans <Plus size={15} />
              </p>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Logo ekle</p>
            </Link>
            <Link
              href="/nt-panel/teklif-talepleri"
              className="rounded-xl p-5 transition-colors hover:bg-black/2"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--color-primary)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Teklif Talepleri</p>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Gelen talepleri yönet</p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
