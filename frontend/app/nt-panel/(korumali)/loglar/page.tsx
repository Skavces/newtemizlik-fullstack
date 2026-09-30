'use client'

import { useEffect, useState } from 'react'
import { ScrollText, AlertCircle, AlertTriangle, ChevronDown, Copy, Check } from 'lucide-react'
import { getLogAdminList, type LogAdminListParams } from '@/lib/panelApi'
import { dayRangeToIso, formatDateTime } from '@/lib/date'
import AdminPager from '@/components/panel/AdminPager'
import AdminDateRange from '@/components/panel/AdminDateRange'
import AdminStatCard from '@/components/panel/AdminStatCard'
import AdminTabs from '@/components/panel/AdminTabs'
import type { AppLog, LogAdminListResponse, LogLevel } from '@/types/api'

// backend/src/logs/uploads-cleanup gibi servislerin LOG_RETENTION_INTERVAL
// sabitiyle senkron tutulmalı (30 gün) — API bu değeri döndürmüyor.
const LOG_RETENTION_DAYS = 30

function logToText(log: AppLog): string {
  const level = log.level === 'error' ? 'HATA' : 'UYARI'
  const context = log.context ? ` [${log.context}]` : ''
  return `${formatDateTime(log.createdAt)} [${level}]${context} ${log.message}`
}

function CopyButton({ getText, title, className, children }: { getText: () => string; title: string; className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // izin/eski tarayıcı — sessizce geç
    }
  }

  return (
    <button onClick={copy} title={title} className={className} type="button">
      {copied ? <Check size={14} style={{ color: 'var(--color-primary)' }} /> : <Copy size={14} />}
      {children && <span>{copied ? 'Kopyalandı' : children}</span>}
    </button>
  )
}

function LevelBadge({ level }: { level: LogLevel }) {
  return level === 'error' ? (
    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.08)' }}>HATA</span>
  ) : (
    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" style={{ color: '#d97706', background: 'rgba(217,119,6,0.08)' }}>UYARI</span>
  )
}

function LogRow({ log }: { log: AppLog }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = log.message.length > 140

  return (
    <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex w-full flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={() => isLong && setExpanded((e) => !e)}
          className={`flex min-w-0 flex-1 items-center gap-3 text-left ${isLong ? '' : 'cursor-default'}`}
        >
          <LevelBadge level={log.level} />
          {log.context && <span className="shrink-0 font-mono text-xs" style={{ color: 'var(--text-faint)' }}>[{log.context}]</span>}
          <span
            className={`min-w-0 text-sm ${expanded ? 'break-words whitespace-pre-wrap' : 'truncate'}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {log.message}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDateTime(log.createdAt)}</span>
          <CopyButton getText={() => logToText(log)} title="Bu kaydı kopyala" className="rounded-lg p-1.5" />
          {isLong && (
            <button onClick={() => setExpanded((e) => !e)} className="rounded-lg p-1" style={{ color: 'var(--text-faint)' }} title={expanded ? 'Daralt' : 'Genişlet'}>
              <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoglarPage() {
  const [data, setData] = useState<LogAdminListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [fromDay, setFromDay] = useState('')
  const [toDay, setToDay] = useState('')

  useEffect(() => {
    let ignore = false
    // Filtre/sayfa değişince yeniden true'ya çekilmesi kasıtlı — ilk mount'ta
    // zaten true olan state'i sonraki her bağımlılık değişiminde tazeler.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const params: LogAdminListParams = {
      level: level === 'all' ? undefined : (level as LogLevel),
      page,
      ...dayRangeToIso(fromDay, toDay),
    }
    getLogAdminList(params)
      .then((result) => { if (!ignore) setData(result) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [level, page, fromDay, toDay])

  function changeLevel(next: string | number) {
    setLevel(String(next))
    setPage(1)
  }

  function changeDates(nextFrom: string, nextTo: string) {
    setFromDay(nextFrom)
    setToDay(nextTo)
    setPage(1)
  }

  const stats = data?.stats ?? { total: 0, errors24h: 0, warns24h: 0 }
  const logs = data?.logs ?? []

  if (loading && !data) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Loglar</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            Backend hata ve uyarıları · sayfa başına 50 kayıt · {LOG_RETENTION_DAYS} gün saklanır
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminDateRange from={fromDay} to={toDay} onChange={changeDates} />
          {logs.length > 0 && (
            <CopyButton
              getText={() => logs.map(logToText).join('\n')}
              title="Bu sayfadaki kayıtları kopyala"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold"
            >
              Kopyala
            </CopyButton>
          )}
          <AdminTabs
            items={[{ id: 'all', label: 'Tümü' }, { id: 'error', label: 'Hata' }, { id: 'warn', label: 'Uyarı' }]}
            value={level}
            onChange={changeLevel}
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <AdminStatCard label="Toplam Kayıt" value={stats.total} icon={ScrollText} />
        <AdminStatCard label="Son 24s Hata" value={stats.errors24h} icon={AlertCircle} />
        <AdminStatCard label="Son 24s Uyarı" value={stats.warns24h} icon={AlertTriangle} />
      </div>

      {logs.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <ScrollText size={36} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          {level !== 'all' || fromDay || toDay ? (
            <p>Filtreyle eşleşen kayıt yok.</p>
          ) : (
            <>
              <p>Kayıt yok — her şey yolunda görünüyor.</p>
              <p className="mt-1 text-xs">Backend&apos;de hata veya uyarı oluşunca burada görünür.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {logs.map((l) => <LogRow key={l.id} log={l} />)}
          </div>
          <div className="mt-6">
            <AdminPager page={data?.page ?? 1} pageCount={data?.pageCount ?? 1} onChange={setPage} disabled={loading} />
          </div>
        </>
      )}
    </div>
  )
}
