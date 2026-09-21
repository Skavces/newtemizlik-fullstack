'use client'

import { useState, type PointerEvent } from 'react'
import type { UmamiMetric } from '@/types/api'

interface AreaChartSeries {
  label: string
  color: string
  points: UmamiMetric[]
}

interface AreaChartProps {
  series: AreaChartSeries[]
  height?: number
  formatX?: (x: string) => string
}

// Bağımlılıksız SVG alan grafiği — panelin diğer tüm primitive'leri (Tabs,
// Pager, DateRange, StatCard) gibi elde yazıldı, recharts/chart.js eklenmedi
// (bkz. Faz 5 planı). Boş seri render edilmez, "veri yok" durumunu çağıran
// sayfa yönetir.
const VIEWPORT_WIDTH = 600
const TOP_PADDING = 12

export default function AreaChart({ series, height = 220, formatX }: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const length = Math.max(0, ...series.map((s) => s.points.length))
  if (length === 0) return null

  const maxY = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.y)))
  const stepX = length > 1 ? VIEWPORT_WIDTH / (length - 1) : VIEWPORT_WIDTH
  const usableHeight = height - TOP_PADDING

  function toCoords(points: UmamiMetric[]) {
    const coords = points.map((p, i) => ({
      x: i * stepX,
      y: TOP_PADDING + usableHeight - (p.y / maxY) * usableHeight,
    }))
    // Tek nokta (ör. "Bugün" aralığında henüz tek saatlik veri varken) bir
    // M komutuna indirgenir ve SVG hiçbir şey çizmez — genişliğe yayılmış
    // yatay bir çizgi/alan olarak göster.
    return coords.length === 1 ? [coords[0], { x: VIEWPORT_WIDTH, y: coords[0].y }] : coords
  }

  function areaPath(points: UmamiMetric[]) {
    const pts = toCoords(points)
    if (pts.length === 0) return ''
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    return `${line} L${pts[pts.length - 1].x},${height} L${pts[0].x},${height} Z`
  }

  function linePath(points: UmamiMetric[]) {
    return toCoords(points)
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' ')
  }

  function handlePointerMove(e: PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VIEWPORT_WIDTH
    const idx = Math.round(relX / stepX)
    setHoverIndex(Math.min(length - 1, Math.max(0, idx)))
  }

  const tickIndexes = length > 1 ? [0, Math.floor((length - 1) / 2), length - 1] : [0]
  const label = (x: string | undefined) => (x === undefined ? '' : formatX ? formatX(x) : x)
  const hoverX = hoverIndex === null ? null : (hoverIndex / Math.max(1, length - 1)) * 100

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${VIEWPORT_WIDTH} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <defs>
          {/* id, seri etiketiyle DEĞİL indeksle üretilir: Türkçe/boşluklu bir
              label ("Sayfa Görüntülenme") geçersiz bir HTML id üretir, url(#..)
              referansı çözülemez ve tarayıcı dolguyu siyaha düşürür (canlı
              doğrulamada yakalandı — bkz. Faz 5 planı). */}
          {series.map((s, i) => (
            <linearGradient key={i} id={`nt-area-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {series.map((s, i) => (
          <path key={`area-${i}`} d={areaPath(s.points)} fill={`url(#nt-area-grad-${i})`} stroke="none" />
        ))}
        {series.map((s, i) => (
          <path key={`line-${i}`} d={linePath(s.points)} fill="none" stroke={s.color} strokeWidth={2} />
        ))}
        {hoverIndex !== null && (
          <line
            x1={hoverIndex * stepX}
            x2={hoverIndex * stepX}
            y1={0}
            y2={height}
            stroke="var(--border-subtle)"
            strokeWidth={1}
          />
        )}
        <rect
          x={0}
          y={0}
          width={VIEWPORT_WIDTH}
          height={height}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hoverX !== null && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg"
          style={{
            left: `${hoverX}%`,
            top: 0,
            transform: `translate(${hoverX < 15 ? '0%' : hoverX > 85 ? '-100%' : '-50%'}, 0)`,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <p className="mb-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>
            {label(series[0]?.points[hoverIndex]?.x)}
          </p>
          {series.map((s) => (
            <p key={s.label} style={{ color: s.color }}>
              {s.label}: {(s.points[hoverIndex]?.y ?? 0).toLocaleString('tr-TR')}
            </p>
          ))}
        </div>
      )}

      <div className="mt-1 flex justify-between text-xs" style={{ color: 'var(--text-faint)' }}>
        {tickIndexes.map((i) => (
          <span key={i}>{label(series[0]?.points[i]?.x)}</span>
        ))}
      </div>
    </div>
  )
}
