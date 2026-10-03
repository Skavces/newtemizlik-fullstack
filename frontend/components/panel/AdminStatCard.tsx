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
      className="panel-stat-card flex items-center gap-3 rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <Icon size={dense ? 20 : 22} className="shrink-0" style={{ color: 'var(--color-secondary-dark)' }} />
      <div>
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
            {value}
          </p>
          {hasChange && change !== 0 && (
            <span
              className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold"
              style={{
                color: positive ? 'var(--color-primary-dark)' : '#e74c3c',
                background: positive ? 'rgba(127, 191, 58, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              }}
            >
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
