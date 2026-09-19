'use client'

// renel-enerji'deki 9+ elle yazılmış alert() çağrısının yerini alan tek toast
// sistemi (bkz. Faz 4 planı). Context değeri ayrı export edilmiyor (tek bu
// dosyada tüketiliyor) — ThemeContext'teki fast-refresh ayrımına burada gerek
// yok çünkü yalnızca bir hook (useToast) dışa açılıyor, component değil.
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

type ToastKind = 'success' | 'error'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  showToast: (kind: ToastKind, message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 rounded-lg px-4 py-3 shadow-lg"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${t.kind === 'error' ? '#e74c3c40' : 'var(--border-subtle)'}`,
              minWidth: '260px',
              maxWidth: '380px',
            }}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 size={18} style={{ color: '#7FBF3A', flexShrink: 0 }} />
            ) : (
              <XCircle size={18} style={{ color: '#e74c3c', flexShrink: 0 }} />
            )}
            <p className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Kapat"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast, bir <ToastProvider> içinde kullanılmalı')
  return ctx
}
