'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Images, Inbox, Plus, FolderOpen, Zap } from 'lucide-react'
import { getAllBlogPostsAdmin, getAllFaqsAdmin, getAllReferencesAdmin, getQuoteAdminList, getLogAdminList } from '@/lib/panelApi'

interface DashboardStats {
  blogCount: number
  faqCount: number
  referenceCount: number
  pendingQuotes: number
  errors24h: number
}

const dividerBorder = { borderColor: 'var(--border-subtle)' }

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
    <div className="relative">
      <Image
        src="/logo.svg"
        alt=""
        width={1080}
        height={1015}
        aria-hidden
        className="pointer-events-none fixed right-0 bottom-0 hidden w-80 -z-10 select-none opacity-5 sm:block lg:w-96"
      />

      {/* Hero banner — tam genişlik, boşluksuz */}
      <div className="relative h-40 w-full overflow-hidden sm:h-52">
        <Image
          src="/admin-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 60%' }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-sm tracking-widest text-white/70 uppercase drop-shadow-md sm:text-base">Yönetim Paneli</p>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg sm:text-6xl" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Hoş geldiniz
          </h1>
          <p className="mt-3 text-base text-white/60 drop-shadow-md sm:text-xl">New Temizlik Hizmetleri</p>
        </div>
      </div>

      {stats && (
        <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8">
          {/* Genel istatistikler */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              <FolderOpen size={14} style={{ color: 'var(--color-primary)' }} />
              Genel İstatistikler
            </p>
            <div
              className="flex flex-col overflow-hidden rounded-2xl shadow-md sm:flex-row"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex-1 border-b px-6 py-5 sm:border-r sm:border-b-0 sm:px-7 sm:py-6" style={dividerBorder}>
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {stats.blogCount}
                </p>
                <p className="mt-0.5 text-base" style={{ color: 'var(--text-muted)' }}>Blog Yazısı</p>
              </div>

              <div className="flex-1 border-b px-6 py-5 sm:border-r sm:border-b-0 sm:px-7 sm:py-6" style={dividerBorder}>
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {stats.faqCount}
                </p>
                <p className="mt-0.5 text-base" style={{ color: 'var(--text-muted)' }}>S.S.S.</p>
              </div>

              <div className="flex-1 border-b px-6 py-5 sm:border-r sm:border-b-0 sm:px-7 sm:py-6" style={dividerBorder}>
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {stats.referenceCount}
                </p>
                <p className="mt-0.5 text-base" style={{ color: 'var(--text-muted)' }}>Referans</p>
              </div>

              <div className="flex-1 border-b px-6 py-5 sm:border-r sm:border-b-0 sm:px-7 sm:py-6" style={dividerBorder}>
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {stats.pendingQuotes}
                </p>
                <p className="mt-0.5 text-base" style={{ color: 'var(--text-muted)' }}>Bekleyen Teklif</p>
              </div>

              <Link href="/nt-panel/loglar" className="flex-1 px-6 py-5 transition-colors hover:bg-black/2 sm:px-7 sm:py-6">
                <p
                  className="text-5xl font-bold"
                  style={{ color: stats.errors24h > 0 ? '#e74c3c' : 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {stats.errors24h}
                </p>
                <p className="mt-0.5 text-base" style={{ color: 'var(--text-muted)' }}>Son 24s Hata</p>
              </Link>
            </div>
          </div>

          {/* Hızlı işlemler */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              <Zap size={14} style={{ color: 'var(--color-primary)' }} />
              Hızlı İşlemler
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/nt-panel/blog/yeni"
                className="group relative flex min-h-[90px] items-center overflow-hidden rounded-2xl px-6 py-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--color-primary)' }}
              >
                <FileText
                  size={90}
                  className="pointer-events-none absolute -right-3 -bottom-4 opacity-10"
                  style={{ color: 'var(--color-primary)' }}
                />
                <div className="relative z-10">
                  <p className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>
                    Yeni Blog Yazısı <Plus size={16} />
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Ekle ve yayınla</p>
                </div>
              </Link>

              <Link
                href="/nt-panel/referanslar/yeni"
                className="group relative flex min-h-[90px] items-center overflow-hidden rounded-2xl px-6 py-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--color-primary)' }}
              >
                <Images
                  size={90}
                  className="pointer-events-none absolute -right-3 -bottom-4 opacity-10"
                  style={{ color: 'var(--color-primary)' }}
                />
                <div className="relative z-10">
                  <p className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>
                    Yeni Referans <Plus size={16} />
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Logo ekle</p>
                </div>
              </Link>

              <Link
                href="/nt-panel/teklif-talepleri"
                className="group relative flex min-h-[90px] items-center overflow-hidden rounded-2xl px-6 py-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--color-primary)' }}
              >
                <Inbox
                  size={90}
                  className="pointer-events-none absolute -right-3 -bottom-4 opacity-10"
                  style={{ color: 'var(--color-primary)' }}
                />
                <div className="relative z-10">
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Teklif Talepleri</p>
                  <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Gelen talepleri yönet</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
