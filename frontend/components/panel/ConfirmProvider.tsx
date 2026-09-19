'use client'

// renel-enerji'deki 8 elle yazılmış confirm() çağrısının yerini alan tek
// onay diyaloğu (bkz. Faz 4 planı). useConfirm() bir Promise<boolean> döner —
// çağıran kod `if (await confirm(...))` şeklinde native confirm() ile aynı
// akışta kullanır.
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve })
    })
  }, [])

  function close(result: boolean) {
    pending?.resolve(result)
    setPending(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => close(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl p-6 shadow-xl"
            style={{ background: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              {pending.destructive && (
                <AlertTriangle size={20} style={{ color: '#e74c3c', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {pending.title}
                </h3>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {pending.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => close(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
              >
                {pending.cancelLabel ?? 'Vazgeç'}
              </button>
              <button
                onClick={() => close(true)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: pending.destructive ? '#e74c3c' : 'var(--color-primary)' }}
              >
                {pending.confirmLabel ?? 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm, bir <ConfirmProvider> içinde kullanılmalı')
  return ctx.confirm
}
