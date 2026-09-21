'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  Eye,
  Users,
  Activity,
  Percent,
  Clock,
  RefreshCw,
  ExternalLink,
  FileText,
  Link2,
  Smartphone,
  Globe,
  Cpu,
  MapPin,
} from 'lucide-react'
import { getDashStats, getDashPageviews, getDashPages, getDashMetrics } from '@/lib/panelApi'
import { dayRangeToEpoch } from '@/lib/date'
import { useLatestFetch } from '@/lib/useLatestFetch'
import AdminTabs from '@/components/panel/AdminTabs'
import AdminDateRange from '@/components/panel/AdminDateRange'
import AdminStatCard from '@/components/panel/AdminStatCard'
import AreaChart from '@/components/panel/AreaChart'
import MetricBars from '@/components/panel/MetricBars'
import type { UmamiStats, UmamiPageviews, UmamiMetric, DashUnit } from '@/types/api'

const RANGE_TABS = [
  { id: 'today', label: 'Bugün' },
  { id: '7d', label: '7 Gün' },
  { id: '30d', label: '30 Gün' },
  { id: 'custom', label: 'Özel' },
]

function startOfDaysAgo(daysAgo: number): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.getTime()
}

interface ResolvedRange {
  startAt: number
  endAt: number
  unit: DashUnit
}

function resolveRange(rangeId: string, fromDay: string, toDay: string): ResolvedRange | null {
  switch (rangeId) {
    case 'today':
      return { startAt: startOfDaysAgo(0), endAt: Date.now(), unit: 'hour' }
    case '7d':
      return { startAt: startOfDaysAgo(6), endAt: Date.now(), unit: 'day' }
    case '30d':
      return { startAt: startOfDaysAgo(29), endAt: Date.now(), unit: 'day' }
    case 'custom': {
      const { startAt, endAt } = dayRangeToEpoch(fromDay, toDay)
      return startAt !== undefined && endAt !== undefined ? { startAt, endAt, unit: 'day' } : null
    }
    default:
      return null
  }
}

interface AnalitikData {
  stats: UmamiStats
  pageviews: UmamiPageviews
  pages: UmamiMetric[]
  referrers: UmamiMetric[]
  devices: UmamiMetric[]
  browsers: UmamiMetric[]
  os: UmamiMetric[]
  countries: UmamiMetric[]
}

function formatDuration(totalSeconds: number, visits: number): string {
  if (!visits) return '0dk'
  return `${Math.round(totalSeconds / visits / 60)}dk`
}

function formatDayLabel(x: string): string {
  const d = new Date(x)
  return isNaN(d.getTime()) ? x : d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
}

function formatHourLabel(x: string): string {
  const d = new Date(x)
  return isNaN(d.getTime()) ? x : d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export default function AnalitikPage() {
  const [rangeId, setRangeId] = useState('7d')
  const [fromDay, setFromDay] = useState('')
  const [toDay, setToDay] = useState('')
  const [data, setData] = useState<AnalitikData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTick, setRefreshTick] = useState(0)
  const dataFetch = useLatestFetch()

  const range = resolveRange(rangeId, fromDay, toDay)

  useEffect(() => {
    if (!range) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    const seq = dataFetch.next()
    setLoading(true)
    const base = { startAt: range.startAt, endAt: range.endAt }
    Promise.all([
      getDashStats(base),
      getDashPageviews({ ...base, unit: range.unit }),
      getDashPages(base),
      getDashMetrics({ ...base, type: 'referrer' }),
      getDashMetrics({ ...base, type: 'device' }),
      getDashMetrics({ ...base, type: 'browser' }),
      getDashMetrics({ ...base, type: 'os' }),
      getDashMetrics({ ...base, type: 'country' }),
    ])
      .then(([stats, pageviews, pages, referrers, devices, browsers, os, countries]) => {
        if (!dataFetch.isCurrent(seq)) return
        setData({ stats, pageviews, pages, referrers, devices, browsers, os, countries })
      })
      .finally(() => {
        if (!dataFetch.isCurrent(seq)) return
        setLoading(false)
      })
    // panelFetch 401'i zaten merkezi olarak /nt-panel/giris'e yönlendiriyor —
    // burada ayrı bir catch/redirect gerekmiyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeId, fromDay, toDay, refreshTick])

  function changeRange(next: string | number) {
    setRangeId(String(next))
  }

  // UMAMI_WEBSITE_ID boşken backend /dash/stats'ı {} döner (hiç anahtar yok);
  // gerçekten bağlıysa Umami sıfır trafikte bile tüm alanları {value:0,...}
  // ile döndürür — bu yüzden "anahtar var mı" bağlantı sinyali olarak güvenilir.
  const connected = data !== null && Object.keys(data.stats).length > 0
  const stats = data?.stats ?? {}
  const visits = stats.visits?.value ?? 0

  if (loading && !data) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analitik</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Site ziyaretçi istatistikleri (Umami)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {rangeId === 'custom' && (
            <AdminDateRange from={fromDay} to={toDay} onChange={(f, t) => { setFromDay(f); setToDay(t) }} />
          )}
          <AdminTabs items={RANGE_TABS} value={rangeId} onChange={changeRange} size="xs" />
          <button
            onClick={() => setRefreshTick((t) => t + 1)}
            disabled={loading}
            className="rounded-lg p-2"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            aria-label="Yenile"
            title="Yenile"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {process.env.NEXT_PUBLIC_UMAMI_URL && (
            <a
              href={process.env.NEXT_PUBLIC_UMAMI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            >
              Umami&apos;de Aç <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {rangeId === 'custom' && !range && (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--text-faint)' }}>Başlangıç ve bitiş tarihi seç.</p>
      )}

      {range && !connected && (
        <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
          <BarChart3 size={36} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p>Umami henüz bağlı değil.</p>
          <p className="mt-1 text-xs">Backend&apos;de UMAMI_WEBSITE_ID ayarlanmadan veri gelmez.</p>
        </div>
      )}

      {range && connected && data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <AdminStatCard
              dense
              label="Sayfa Görüntülenme"
              value={(stats.pageviews?.value ?? 0).toLocaleString('tr-TR')}
              icon={Eye}
              change={stats.pageviews?.change}
            />
            <AdminStatCard
              dense
              label="Tekil Ziyaretçi"
              value={(stats.visitors?.value ?? 0).toLocaleString('tr-TR')}
              icon={Users}
              change={stats.visitors?.change}
            />
            <AdminStatCard dense label="Oturum" value={visits.toLocaleString('tr-TR')} icon={Activity} change={stats.visits?.change} />
            <AdminStatCard
              dense
              label="Çıkma Oranı"
              value={visits ? `%${Math.round(((stats.bounces?.value ?? 0) / visits) * 100)}` : '%0'}
              icon={Percent}
            />
            <AdminStatCard dense label="Ort. Süre" value={formatDuration(stats.totaltime?.value ?? 0, visits)} icon={Clock} />
          </div>

          <div className="mb-6 rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h2 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ziyaret Trendi</h2>
            {data.pageviews.pageviews?.length ? (
              <AreaChart
                series={[
                  { label: 'Sayfa Görüntülenme', color: 'var(--color-primary)', points: data.pageviews.pageviews ?? [] },
                  { label: 'Ziyaretçi', color: '#94a3b8', points: data.pageviews.sessions ?? [] },
                ]}
                formatX={range.unit === 'hour' ? formatHourLabel : formatDayLabel}
              />
            ) : (
              <p className="py-10 text-center text-sm" style={{ color: 'var(--text-faint)' }}>Bu aralıkta veri yok.</p>
            )}
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <MetricBars title="En Çok Görüntülenen Sayfalar" icon={FileText} items={data.pages} emptyText="Sayfa verisi yok" />
            <MetricBars title="Trafik Kaynakları" icon={Link2} items={data.referrers} emptyText="Kaynak verisi yok" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricBars title="Cihazlar" icon={Smartphone} items={data.devices} emptyText="Cihaz verisi yok" max={6} />
            <MetricBars title="Tarayıcılar" icon={Globe} items={data.browsers} emptyText="Tarayıcı verisi yok" max={6} />
            <MetricBars title="İşletim Sistemi" icon={Cpu} items={data.os} emptyText="İşletim sistemi verisi yok" max={6} />
            <MetricBars title="Ülkeler" icon={MapPin} items={data.countries} emptyText="Ülke verisi yok" max={6} />
          </div>
        </>
      )}
    </div>
  )
}
