import { X } from 'lucide-react'

interface AdminDateRangeProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

// Değerler her zaman YYYY-MM-DD (native <input type="date"> formatı). ISO'ya
// çevirme (gün sınırlarını hesaplama) çağıranın işi — bkz. lib/date.ts
// dayRangeToIso. Backend'in beklediği from/to konvansiyonu bunu gerektiriyor.
export default function AdminDateRange({ from, to, onChange }: AdminDateRangeProps) {
  const hasValue = from || to

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        max={to || undefined}
        onChange={(e) => onChange(e.target.value, to)}
        className="rounded-lg px-3 py-1.5 text-sm"
        style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
      />
      <span style={{ color: 'var(--text-muted)' }}>–</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => onChange(from, e.target.value)}
        className="rounded-lg px-3 py-1.5 text-sm"
        style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
      />
      {hasValue && (
        <button
          onClick={() => onChange('', '')}
          aria-label="Tarih filtresini temizle"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
