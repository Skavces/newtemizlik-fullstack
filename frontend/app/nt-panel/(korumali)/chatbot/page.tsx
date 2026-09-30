'use client'

import { useEffect, useState } from 'react'
import { Star, ChevronDown, ChevronRight, MessageCircle, Users, Send, Clock, TrendingUp, Trash2, ThumbsUp } from 'lucide-react'
import {
  getChatLeadAdminList,
  deleteChatLead,
  getChatRatingAdminList,
  deleteChatRating,
  getChatFunnel,
} from '@/lib/panelApi'
import { dayRangeToIso, formatDateTime } from '@/lib/date'
import { applyPagedResult } from '@/lib/adminPaging'
import { useLatestFetch } from '@/lib/useLatestFetch'
import { useToast } from '@/components/panel/ToastProvider'
import { useConfirm } from '@/components/panel/ConfirmProvider'
import AdminStatCard from '@/components/panel/AdminStatCard'
import AdminTabs from '@/components/panel/AdminTabs'
import AdminDateRange from '@/components/panel/AdminDateRange'
import AdminPager from '@/components/panel/AdminPager'
import type { ChatFunnel, ChatLead, ChatLeadAdminListResponse, ChatLeadStatus, ChatMessage, ChatRating, ChatRatingAdminListResponse } from '@/types/api'

const LEAD_STATUS_TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Geçmeyen' },
  { id: 'whatsapp', label: "WhatsApp'a Geçen" },
]

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={{ color: star <= value ? 'var(--color-accent)' : 'var(--border-subtle)' }}
          fill={star <= value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

function Transcript({ conversation }: { conversation: ChatMessage[] }) {
  return (
    <div className="space-y-2 px-5 pt-1 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      {conversation.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className="max-w-[80%] whitespace-pre-wrap rounded-xl px-3.5 py-2 text-sm leading-relaxed"
            style={
              m.role === 'user'
                ? { background: 'var(--color-primary)', color: '#fff', borderBottomRightRadius: '2px' }
                : { background: 'var(--bg-body)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderBottomLeftRadius: '2px' }
            }
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExpandableRow({
  summary,
  conversation,
  onDelete,
  deleting,
  deleteLabel,
}: {
  summary: React.ReactNode
  conversation: ChatMessage[] | null
  onDelete: () => void
  deleting: boolean
  deleteLabel: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasConversation = !!conversation && conversation.length > 0

  return (
    <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-2 pr-3">
        <button
          onClick={() => hasConversation && setExpanded((e) => !e)}
          className={`flex min-w-0 flex-1 flex-col gap-2 py-4 pl-5 text-left sm:flex-row sm:items-center sm:gap-4 ${hasConversation ? '' : 'cursor-default'}`}
        >
          {summary}
          {hasConversation && (
            <ChevronDown
              size={16}
              className="shrink-0 transition-transform"
              style={{ color: 'var(--text-faint)', transform: expanded ? 'rotate(180deg)' : undefined }}
            />
          )}
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="shrink-0 rounded-lg p-2 disabled:opacity-40"
          style={{ color: 'var(--text-faint)' }}
          aria-label={deleteLabel}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {expanded && conversation && <Transcript conversation={conversation} />}
    </div>
  )
}

function LeadRow({ lead, onDelete, deleting }: { lead: ChatLead; onDelete: (id: string) => void; deleting: boolean }) {
  const isWhatsapp = lead.status === 'whatsapp'
  return (
    <ExpandableRow
      conversation={lead.conversation}
      onDelete={() => onDelete(lead.id)}
      deleting={deleting}
      deleteLabel="Talebi sil"
      summary={
        <div className="flex flex-1 flex-wrap items-center gap-4">
          {isWhatsapp ? (
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              <Send size={13} /> WhatsApp&apos;a geçti
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium" style={{ color: '#d97706' }}>
              <Clock size={13} /> WhatsApp&apos;a geçmedi
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <MessageCircle size={14} style={{ color: 'var(--text-faint)' }} />
            {lead.messageCount} mesaj
          </span>
          {lead.rating != null && <Stars value={lead.rating} size={13} />}
          <span className="text-xs sm:ml-auto" style={{ color: 'var(--text-faint)' }}>{formatDateTime(lead.updatedAt)}</span>
        </div>
      }
    />
  )
}

function RatingRow({ rating, onDelete, deleting }: { rating: ChatRating; onDelete: (id: string) => void; deleting: boolean }) {
  return (
    <ExpandableRow
      conversation={rating.conversation}
      onDelete={() => onDelete(rating.id)}
      deleting={deleting}
      deleteLabel="Değerlendirmeyi sil"
      summary={
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <Stars value={rating.rating} />
          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <MessageCircle size={14} style={{ color: 'var(--text-faint)' }} />
            {rating.messageCount} mesaj
          </span>
          <span className="text-xs sm:ml-auto" style={{ color: 'var(--text-faint)' }}>{formatDateTime(rating.createdAt)}</span>
        </div>
      }
    />
  )
}

function percent(part: number | undefined, whole: number | undefined): string {
  if (!whole) return '—'
  return `%${Math.round(((part ?? 0) / whole) * 100)}`
}

function FunnelSection() {
  const [days, setDays] = useState<7 | 30>(30)
  const [funnel, setFunnel] = useState<ChatFunnel | null>(null)

  useEffect(() => {
    let ignore = false
    getChatFunnel(days).then((data) => { if (!ignore) setFunnel(data) }).catch(() => {})
    return () => { ignore = true }
  }, [days])

  const steps = [
    { label: 'Chat Açılma', value: funnel?.opened ?? 0, rate: null as string | null },
    { label: 'Mesaj Yazan', value: funnel?.messaged ?? 0, rate: percent(funnel?.messaged, funnel?.opened) },
    { label: "WhatsApp'a Geçen", value: funnel?.whatsapp ?? 0, rate: percent(funnel?.whatsapp, funnel?.messaged) },
    { label: 'Değerlendiren', value: funnel?.rated ?? 0, rate: percent(funnel?.rated, funnel?.messaged) },
  ]

  return (
    <div className="mb-6 rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={13} style={{ color: 'var(--text-faint)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Dönüşüm Hunisi</h3>
        </div>
        <AdminTabs items={[{ id: 7, label: '7 Gün' }, { id: 30, label: '30 Gün' }]} value={days} onChange={(id) => setDays(id as 7 | 30)} size="xs" />
      </div>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex min-w-0 flex-1 items-center">
            {i > 0 && <ChevronRight size={18} className="mx-1 shrink-0" style={{ color: 'var(--border-subtle)' }} />}
            <div className="flex-1 text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>{step.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.label}</p>
              {step.rate !== null && <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-faint)' }}>dönüşüm {step.rate}</p>}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px]" style={{ color: 'var(--text-faint)' }}>
        Açılma sayacı özelliğin yayına alındığı tarihten itibaren toplanır.
      </p>
    </div>
  )
}

function LeadsSection({
  leadData,
  onDelete,
  deletingId,
  onPageChange,
  status,
  fromDay,
  toDay,
  onStatusChange,
  onDatesChange,
}: {
  leadData: ChatLeadAdminListResponse | null
  onDelete: (id: string) => void
  deletingId: string | null
  onPageChange: (page: number) => void
  status: string
  fromDay: string
  toDay: string
  onStatusChange: (id: string | number) => void
  onDatesChange: (from: string, to: string) => void
}) {
  const stats = leadData?.stats ?? { total: 0, active: 0, whatsapp: 0 }
  const leads = leadData?.leads ?? []

  if (stats.total === 0) {
    return (
      <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
        <Users size={36} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
        <p>Henüz potansiyel talep yok.</p>
        <p className="mt-1 text-xs">Ziyaretçi chatbot&apos;ta 2+ mesaj yazınca burada görünür.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <AdminStatCard label="Toplam Talep" value={stats.total} icon={Users} />
        <AdminStatCard label="WhatsApp'a Geçen" value={stats.whatsapp} icon={Send} />
        <AdminStatCard label="Kaçan (Geçmeyen)" value={stats.active} icon={Clock} />
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminTabs items={LEAD_STATUS_TABS} value={status} onChange={onStatusChange} size="sm" wrap />
        <AdminDateRange from={fromDay} to={toDay} onChange={onDatesChange} />
      </div>
      {leads.length === 0 ? (
        <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
          <p>Filtreyle eşleşen talep yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <LeadRow key={l.id} lead={l} onDelete={onDelete} deleting={deletingId === l.id} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <AdminPager page={leadData?.page ?? 1} pageCount={leadData?.pageCount ?? 1} onChange={onPageChange} />
      </div>
    </>
  )
}

function RatingsSection({
  ratingData,
  onDelete,
  deletingId,
  onPageChange,
}: {
  ratingData: ChatRatingAdminListResponse | null
  onDelete: (id: string) => void
  deletingId: string | null
  onPageChange: (page: number) => void
}) {
  const stats = ratingData?.stats ?? { total: 0, average: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  const ratings = ratingData?.ratings ?? []
  const maxCount = Math.max(1, ...Object.values(stats.counts))

  if (stats.total === 0) {
    return (
      <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
        <ThumbsUp size={36} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
        <p>Henüz değerlendirme yok.</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
            {stats.average.toFixed(1).replace('.', ',')}
          </p>
          <Stars value={Math.round(stats.average)} size={18} />
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>ortalama puan</p>
        </div>
        <div className="space-y-2 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-3 text-right text-xs" style={{ color: 'var(--text-muted)' }}>{star}</span>
              <Star size={12} className="shrink-0" style={{ color: 'var(--color-accent)' }} fill="currentColor" />
              <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-body)' }}>
                <div className="h-full rounded-full" style={{ width: `${(stats.counts[star] / maxCount) * 100}%`, background: 'var(--color-primary)' }} />
              </div>
              <span className="w-8 text-xs" style={{ color: 'var(--text-faint)' }}>{stats.counts[star]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {ratings.map((r) => (
          <RatingRow key={r.id} rating={r} onDelete={onDelete} deleting={deletingId === r.id} />
        ))}
      </div>
      <div className="mt-6">
        <AdminPager page={ratingData?.page ?? 1} pageCount={ratingData?.pageCount ?? 1} onChange={onPageChange} />
      </div>
    </>
  )
}

export default function ChatbotPage() {
  const [tab, setTab] = useState<'leads' | 'ratings'>('leads')

  const [leadData, setLeadData] = useState<ChatLeadAdminListResponse | null>(null)
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [leadDeletingId, setLeadDeletingId] = useState<string | null>(null)
  const [leadPage, setLeadPage] = useState(1)
  const [leadStatus, setLeadStatus] = useState('all')
  const [leadFromDay, setLeadFromDay] = useState('')
  const [leadToDay, setLeadToDay] = useState('')
  const [leadRefreshTick, setLeadRefreshTick] = useState(0)
  const leadFetch = useLatestFetch()

  const [ratingData, setRatingData] = useState<ChatRatingAdminListResponse | null>(null)
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [ratingDeletingId, setRatingDeletingId] = useState<string | null>(null)
  const [ratingPage, setRatingPage] = useState(1)
  const [ratingRefreshTick, setRatingRefreshTick] = useState(0)
  const ratingFetch = useLatestFetch()

  const { showToast } = useToast()
  const confirm = useConfirm()
  const loading = leadsLoading || ratingsLoading

  useEffect(() => {
    const seq = leadFetch.next()
    getChatLeadAdminList({
      page: leadPage,
      status: leadStatus === 'all' ? undefined : (leadStatus as ChatLeadStatus),
      ...dayRangeToIso(leadFromDay, leadToDay),
    })
      .then((result) => {
        if (!leadFetch.isCurrent(seq)) return
        applyPagedResult(result.leads, result, setLeadPage, setLeadData)
      })
      .finally(() => {
        if (!leadFetch.isCurrent(seq)) return
        setLeadsLoading(false)
        setLeadDeletingId(null)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadPage, leadStatus, leadFromDay, leadToDay, leadRefreshTick])

  useEffect(() => {
    const seq = ratingFetch.next()
    getChatRatingAdminList(ratingPage)
      .then((result) => {
        if (!ratingFetch.isCurrent(seq)) return
        applyPagedResult(result.ratings, result, setRatingPage, setRatingData)
      })
      .finally(() => {
        if (!ratingFetch.isCurrent(seq)) return
        setRatingsLoading(false)
        setRatingDeletingId(null)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingPage, ratingRefreshTick])

  function changeLeadStatus(next: string | number) {
    setLeadStatus(String(next))
    setLeadPage(1)
  }

  function changeLeadDates(nextFrom: string, nextTo: string) {
    setLeadFromDay(nextFrom)
    setLeadToDay(nextTo)
    setLeadPage(1)
  }

  async function handleDeleteLead(id: string) {
    const ok = await confirm({ title: 'Talebi sil', message: 'Bu talebi silmek istediğinize emin misiniz?', destructive: true })
    if (!ok) return
    setLeadDeletingId(id)
    try {
      await deleteChatLead(id)
      setLeadRefreshTick((t) => t + 1)
      showToast('success', 'Talep silindi.')
    } catch {
      showToast('error', 'Silinemedi.')
      setLeadDeletingId(null)
    }
  }

  async function handleDeleteRating(id: string) {
    const ok = await confirm({ title: 'Değerlendirmeyi sil', message: 'Bu değerlendirmeyi silmek istediğinize emin misiniz?', destructive: true })
    if (!ok) return
    setRatingDeletingId(id)
    try {
      await deleteChatRating(id)
      setRatingRefreshTick((t) => t + 1)
      showToast('success', 'Değerlendirme silindi.')
    } catch {
      showToast('error', 'Silinemedi.')
      setRatingDeletingId(null)
    }
  }

  if (loading) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Chatbot</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {leadData?.stats.total ?? 0} talep · {ratingData?.stats.total ?? 0} değerlendirme
          </p>
        </div>
        <AdminTabs
          items={[
            { id: 'leads', label: 'Potansiyel Talepler' },
            { id: 'ratings', label: 'Değerlendirmeler' },
          ]}
          value={tab}
          onChange={(id) => setTab(id as 'leads' | 'ratings')}
        />
      </div>

      <FunnelSection />

      {tab === 'leads' ? (
        <LeadsSection
          leadData={leadData}
          onDelete={handleDeleteLead}
          deletingId={leadDeletingId}
          onPageChange={setLeadPage}
          status={leadStatus}
          fromDay={leadFromDay}
          toDay={leadToDay}
          onStatusChange={changeLeadStatus}
          onDatesChange={changeLeadDates}
        />
      ) : (
        <RatingsSection
          ratingData={ratingData}
          onDelete={handleDeleteRating}
          deletingId={ratingDeletingId}
          onPageChange={setRatingPage}
        />
      )}
    </div>
  )
}
