import type { LucideIcon } from 'lucide-react'

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  dense?: boolean
}

export default function AdminStatCard({ label, value, icon: Icon, dense = false }: AdminStatCardProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--text-muted)' }}>
        <Icon size={dense ? 13 : 14} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'Rajdhani', sans-serif" }}>
        {value}
      </p>
    </div>
  )
}
