'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Clock, Inbox, PhoneCall, Trash2, Trophy, XCircle, Phone, Droplets, MapPin } from 'lucide-react'
import { getQuoteAdminList, updateQuoteStatus, deleteQuoteRequest, type QuoteAdminListParams } from '@/lib/panelApi'
import { dayRangeToIso, formatDateTime } from '@/lib/date'
import { formatStoredPhone } from '@/lib/phone'
import { applyPagedResult } from '@/lib/adminPaging'
import { useLatestFetch } from '@/lib/useLatestFetch'
import { useToast } from '@/components/panel/ToastProvider'
import { useConfirm } from '@/components/panel/ConfirmProvider'
import AdminStatCard from '@/components/panel/AdminStatCard'
import AdminTabs from '@/components/panel/AdminTabs'
import AdminDateRange from '@/components/panel/AdminDateRange'
import AdminPager from '@/components/panel/AdminPager'
import type { QuoteAdminListResponse, QuoteRequest, QuoteStatus } from '@/types/api'

const STATUS_META: Record<QuoteStatus, { label: string; icon: typeof Clock; color: string }> = {
  new: { label: 'Yeni', icon: Clock, color: '#d97706' },
  contacted: { label: 'İletişime Geçildi', icon: PhoneCall, color: '#2563eb' },
  won: { label: 'Kazanıldı', icon: Trophy, color: 'var(--color-primary)' },
  lost: { label: 'Kaybedildi', icon: XCircle, color: 'var(--text-faint)' },
}

const STATUS_TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'new', label: 'Yeni' },
  { id: 'contacted', label: 'İletişime Geçildi' },
  { id: 'won', label: 'Kazanıldı' },
  { id: 'lost', label: 'Kaybedildi' },
]

function RequestRow({
  request,
  onStatusChange,
  onDelete,
  deleting,
}: {
  request: QuoteRequest
  onStatusChange: (id: string, status: QuoteStatus) => void
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const meta = STATUS_META[request.status]
  const StatusIcon = meta.icon

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
            {request.adSoyad ?? '(anonimleştirildi)'}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            {request.telefon && (
              <a href={`tel:+${request.telefon}`} className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Phone size={13} /> {formatStoredPhone(request.telefon)}
              </a>
            )}
            {request.ePosta && <span>{request.ePosta}</span>}
            <span>{request.panelAdeti} panel</span>
            {request.sahaMegavati != null && <span>{Number(request.sahaMegavati)} MW</span>}
            <span className="flex items-center gap-1.5">
              <Droplets size={13} /> Su {request.suUlasimi ? 'Var' : 'Yok'}
            </span>
            {request.lokasyon && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} /> {request.lokasyon}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-faint)' }}>{formatDateTime(request.createdAt)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <select
              value={request.status}
              onChange={(e) => onStatusChange(request.id, e.target.value as QuoteStatus)}
              className="appearance-none rounded-lg py-1.5 pr-7 pl-7 text-sm font-semibold"
              style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-body)', color: meta.color }}
            >
              {(Object.entries(STATUS_META) as [QuoteStatus, typeof meta][]).map(([value, m]) => (
                <option key={value} value={value}>{m.label}</option>
              ))}
            </select>
            <StatusIcon size={13} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2" style={{ color: meta.color }} />
            <ChevronDown size={13} className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
          </div>
          <button
            onClick={() => onDelete(request.id)}
            disabled={deleting}
            className="rounded-lg p-2 disabled:opacity-40"
            style={{ color: 'var(--text-faint)' }}
            aria-label="Talebi sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TeklifTalepleriPage() {
  const [data, setData] = useState<QuoteAdminListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string>('all')
  const [fromDay, setFromDay] = useState('')
  const [toDay, setToDay] = useState('')
  const [refreshTick, setRefreshTick] = useState(0)
  const dataFetch = useLatestFetch()
  const { showToast } = useToast()
  const confirm = useConfirm()

  function query(): QuoteAdminListParams {
    return {
      page,
      status: status === 'all' ? undefined : (status as QuoteStatus),
      ...dayRangeToIso(fromDay, toDay),
    }
  }

  useEffect(() => {
    const seq = dataFetch.next()
    getQuoteAdminList(query())
      .then((result) => {
        if (!dataFetch.isCurrent(seq)) return
        applyPagedResult(result.requests, result, setPage, setData)
      })
      .finally(() => {
        if (!dataFetch.isCurrent(seq)) return
        setLoading(false)
        setDeletingId(null)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, fromDay, toDay, refreshTick])

  function changeStatus(next: string | number) {
    setStatus(String(next))
    setPage(1)
  }

  function changeDates(nextFrom: string, nextTo: string) {
    setFromDay(nextFrom)
    setToDay(nextTo)
    setPage(1)
  }

  async function handleStatusChange(id: string, nextStatus: QuoteStatus) {
    setData((prev) =>
      prev ? { ...prev, requests: prev.requests.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)) } : prev,
    )
    try {
      await updateQuoteStatus(id, nextStatus)
    } catch {
      showToast('error', 'Durum güncellenemedi.')
      setRefreshTick((t) => t + 1)
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirm({ title: 'Talebi sil', message: 'Bu talebi silmek istediğinize emin misiniz?', destructive: true })
    if (!ok) return
    setDeletingId(id)
    try {
      await deleteQuoteRequest(id)
      setRefreshTick((t) => t + 1)
      showToast('success', 'Talep silindi.')
    } catch {
      showToast('error', 'Silinemedi.')
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  const stats = data?.stats ?? { total: 0, new: 0, contacted: 0, won: 0, lost: 0 }
  const requests = data?.requests ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Teklif Talepleri</h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>{stats.total} talep · iletişim formundan gelenler</p>
      </div>

      {stats.total === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
          <Inbox size={36} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p>Henüz teklif talebi yok.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <AdminStatCard label="Toplam" value={stats.total} icon={Inbox} dense />
            <AdminStatCard label="Yeni" value={stats.new} icon={Clock} dense />
            <AdminStatCard label="İletişimde" value={stats.contacted} icon={PhoneCall} dense />
            <AdminStatCard label="Kazanıldı" value={stats.won} icon={Trophy} dense />
            <AdminStatCard label="Kaybedildi" value={stats.lost} icon={XCircle} dense />
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminTabs items={STATUS_TABS} value={status} onChange={changeStatus} size="sm" wrap />
            <AdminDateRange from={fromDay} to={toDay} onChange={changeDates} />
          </div>

          {requests.length === 0 ? (
            <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
              <p>Filtreyle eşleşen talep yok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <RequestRow
                  key={r.id}
                  request={r}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  deleting={deletingId === r.id}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <AdminPager page={data?.page ?? 1} pageCount={data?.pageCount ?? 1} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}
