import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  dense?: boolean
  // Umami'nin {value, change} şeklinden — bkz. UmamiStat (types/api.ts).
  // Faz 5 öncesi hiçbir çağıran bunu geçmiyordu, opsiyonel olduğu için
  // mevcut kullanım yerleri etkilenmez.
  change?: number
}

export default function AdminStatCard({ label, value, icon: Icon, dense = false, change }: AdminStatCardProps) {
  const hasChange = change !== undefined && !isNaN(change)
  const positive = hasChange && change > 0

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--text-muted)' }}>
        <Icon size={dense ? 13 : 14} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
          {value}
        </p>
        {hasChange && change !== 0 && (
          <span
            className="flex items-center gap-0.5 text-xs font-semibold"
            style={{ color: positive ? 'var(--color-primary)' : '#e74c3c' }}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}
          </span>
        )}
      </div>
    </div>
  )
}
