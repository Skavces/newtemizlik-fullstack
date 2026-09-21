import type { LucideIcon } from 'lucide-react'
import type { UmamiMetric } from '@/types/api'

interface MetricBarsProps {
  title: string
  icon: LucideIcon
  items: UmamiMetric[]
  emptyText: string
  max?: number
}

// "En Çok Görüntülenen Sayfalar" / "Trafik Kaynakları" / cihaz-tarayıcı-işletim
// sistemi-ülke kartlarının hepsinde tekrarlanan oransal bar listesi.
export default function MetricBars({ title, icon: Icon, items, emptyText, max = 8 }: MetricBarsProps) {
  const rows = items.slice(0, max)
  const top = rows[0]?.y ?? 0

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="mb-4 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
        <Icon size={14} />
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm" style={{ color: 'var(--text-faint)' }}>{emptyText}</p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((row, i) => (
            <div key={`${row.x}-${i}`} className="relative overflow-hidden rounded-lg" style={{ background: 'var(--bg-alt)' }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${top > 0 ? (row.y / top) * 100 : 0}%`,
                  background: 'var(--color-primary)',
                  opacity: 0.15,
                }}
              />
              <div className="relative flex items-center justify-between gap-3 px-3 py-1.5 text-sm">
                <span className="min-w-0 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {row.x || 'Doğrudan'}
                </span>
                <span className="shrink-0 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {row.y.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
