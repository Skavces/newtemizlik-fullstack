'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Images, Inbox, Plus, FolderOpen, Zap, HelpCircle, AlertCircle } from 'lucide-react'
import { getAllBlogPostsAdmin, getAllFaqsAdmin, getAllReferencesAdmin, getQuoteAdminList, getLogAdminList } from '@/lib/panelApi'

interface DashboardData {
  blogCount: number
  faqCount: number
  referenceCount: number
  pendingQuotes: number
  errors24h: number
}

const dividerBorder = { borderColor: 'var(--border-subtle)' }

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Günaydın'
  if (hour >= 12 && hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [greeting, setGreeting] = useState('Hoş geldiniz')
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting(now.getHours()))
    setDateLabel(now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
  }, [])

  useEffect(() => {
    Promise.all([
      getAllBlogPostsAdmin(),
      getAllFaqsAdmin(),
      getAllReferencesAdmin(),
      getQuoteAdminList(),
      getLogAdminList(),
    ]).then(([posts, faqs, references, quotes, logs]) => {
      setData({
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
        className="pointer-events-none fixed right-0 -bottom-16 hidden w-[28rem] select-none opacity-5 sm:block lg:w-[36rem]"
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
            {greeting}
          </h1>
          <p className="mt-3 text-base text-white/60 drop-shadow-md sm:text-xl">
            New Temizlik Hizmetleri{dateLabel ? ` · ${dateLabel}` : ''}
          </p>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
        />
      </div>

      {data && (
        <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8">
          {/* Genel istatistikler */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              <FolderOpen size={14} style={{ color: 'var(--color-primary)' }} />
              Genel İstatistikler
            </p>
            <div
              className="relative flex flex-col overflow-hidden rounded-2xl shadow-md sm:flex-row"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <Link
                href="/nt-panel/blog"
                className="flex-1 border-b px-6 py-5 transition-colors hover:bg-[rgba(127,191,58,0.06)] sm:border-r sm:border-b-0 sm:px-7 sm:py-6"
                style={dividerBorder}
              >
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {data.blogCount}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-base" style={{ color: 'var(--text-muted)' }}>
                  <FileText size={14} style={{ color: 'var(--color-secondary-dark)' }} /> Blog Yazısı
                </p>
              </Link>

              <Link
                href="/nt-panel/sss"
                className="flex-1 border-b px-6 py-5 transition-colors hover:bg-[rgba(127,191,58,0.06)] sm:border-r sm:border-b-0 sm:px-7 sm:py-6"
                style={dividerBorder}
              >
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {data.faqCount}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-base" style={{ color: 'var(--text-muted)' }}>
                  <HelpCircle size={14} style={{ color: 'var(--color-secondary-dark)' }} /> S.S.S.
                </p>
              </Link>

              <Link
                href="/nt-panel/referanslar"
                className="flex-1 border-b px-6 py-5 transition-colors hover:bg-[rgba(127,191,58,0.06)] sm:border-r sm:border-b-0 sm:px-7 sm:py-6"
                style={dividerBorder}
              >
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {data.referenceCount}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-base" style={{ color: 'var(--text-muted)' }}>
                  <Images size={14} style={{ color: 'var(--color-secondary-dark)' }} /> Referans
                </p>
              </Link>

              <Link
                href="/nt-panel/teklif-talepleri"
                className="flex-1 border-b px-6 py-5 transition-colors hover:bg-[rgba(127,191,58,0.06)] sm:border-r sm:border-b-0 sm:px-7 sm:py-6"
                style={dividerBorder}
              >
                <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
                  {data.pendingQuotes}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-base" style={{ color: 'var(--text-muted)' }}>
                  <Inbox size={14} style={{ color: 'var(--color-secondary-dark)' }} /> Bekleyen Teklif
                </p>
              </Link>

              <Link
                href="/nt-panel/loglar"
                className="flex-1 px-6 py-5 transition-colors hover:bg-[rgba(127,191,58,0.06)] sm:px-7 sm:py-6"
              >
                <p
                  className="text-5xl font-bold"
                  style={{ color: data.errors24h > 0 ? '#e74c3c' : 'var(--color-primary)', fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {data.errors24h}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-base" style={{ color: 'var(--text-muted)' }}>
                  <AlertCircle size={14} style={{ color: data.errors24h > 0 ? '#e74c3c' : 'var(--color-secondary-dark)' }} /> Son 24s Hata
                </p>
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
