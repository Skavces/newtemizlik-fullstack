interface AdminTabItem {
  id: string | number
  label: string
}

interface AdminTabsProps {
  items: AdminTabItem[]
  value: string | number
  onChange: (id: string | number) => void
  size?: 'md' | 'sm' | 'xs'
  wrap?: boolean
}

const PADDING: Record<NonNullable<AdminTabsProps['size']>, string> = {
  md: '8px 16px',
  sm: '6px 12px',
  xs: '5px 10px',
}

const FONT_SIZE: Record<NonNullable<AdminTabsProps['size']>, string> = {
  md: '14px',
  sm: '13px',
  xs: '12px',
}

export default function AdminTabs({ items, value, onChange, size = 'md', wrap = false }: AdminTabsProps) {
  return (
    <div className={`flex gap-2 ${wrap ? 'flex-wrap' : ''}`}>
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`panel-tab rounded-full font-medium transition-colors ${active ? 'panel-tab--active' : ''}`}
            style={{
              padding: PADDING[size],
              fontSize: FONT_SIZE[size],
              background: active ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'var(--bg-card)',
              color: active ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${active ? 'transparent' : 'var(--border-subtle)'}`,
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
