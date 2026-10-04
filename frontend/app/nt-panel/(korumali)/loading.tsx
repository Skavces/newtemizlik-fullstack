import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin" size={28} style={{ color: 'var(--color-primary)' }} />
    </div>
  )
}
