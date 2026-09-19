import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdminPagerProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
  disabled?: boolean
}

export default function AdminPager({ page, pageCount, onChange, disabled = false }: AdminPagerProps) {
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30"
        style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft size={15} />
      </button>
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {page} / {pageCount}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= pageCount}
        className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30"
        style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}
