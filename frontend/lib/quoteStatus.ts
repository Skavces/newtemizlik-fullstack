import { Clock, PhoneCall, Trophy, XCircle, type LucideIcon } from 'lucide-react'
import type { QuoteStatus } from '@/types/api'

// teklif-talepleri/page.tsx ve dashboard'daki "Son Teklif Talepleri" widget'ı
// aynı durum renk/etiket/ikon setini paylaşır.
export const STATUS_META: Record<QuoteStatus, { label: string; icon: LucideIcon; color: string }> = {
  new: { label: 'Yeni', icon: Clock, color: '#d97706' },
  contacted: { label: 'İletişime Geçildi', icon: PhoneCall, color: '#2563eb' },
  won: { label: 'Kazanıldı', icon: Trophy, color: 'var(--color-primary)' },
  lost: { label: 'Kaybedildi', icon: XCircle, color: 'var(--text-faint)' },
}
