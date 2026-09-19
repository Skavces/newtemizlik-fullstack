'use client'

import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import { X, Send } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const PHONE = '905304738793'

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50)
  }, [open])

  function closePopup() {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 220)
  }

  function handleSend() {
    if (!message.trim()) return
    trackEvent('generate_lead', { method: 'whatsapp' })
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message.trim())}`, '_blank')
    closePopup()
    setMessage('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Chat popup */}
      {open && (
        <div
          style={{
            width: '300px',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            animation: closing
              ? 'wa-popup-out 0.2s cubic-bezier(0.4, 0, 1, 1) both'
              : 'wa-popup-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          {/* Header */}
          <div style={{ background: '#1aad50', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <WaIcon size={20} />
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px', margin: 0 }}>New Temizlik</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>WhatsApp ile yazın</p>
              </div>
            </div>
            <button
              onClick={closePopup}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '4px', display: 'flex' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat bubble */}
          <div style={{ padding: '16px', background: '#e5ddd5' }}>
            <div style={{ background: '#fff', borderRadius: '8px 8px 8px 0', padding: '10px 14px', display: 'inline-block', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '13.5px', color: '#111', margin: 0, lineHeight: 1.5 }}>
                Merhaba! Size nasıl yardımcı olabiliriz? ✨
              </p>
              <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0', textAlign: 'right' }}>10:00</p>
            </div>
          </div>

          {/* Input area */}
          <div style={{ padding: '12px', display: 'flex', gap: '8px', alignItems: 'flex-end', borderTop: '1px solid var(--border-subtle)' }}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              rows={2}
              className="wa-textarea"
              style={{
                flex: 1,
                resize: 'none',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '9px 14px',
                fontSize: '13.5px',
                color: 'var(--text-primary)',
                background: 'var(--bg-body)',
                outline: 'none',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                background: message.trim() ? '#1aad50' : 'var(--border-subtle)',
                color: '#fff', cursor: message.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => {
          if (open) { closePopup() } else { setOpen(true); trackEvent('whatsapp_open') }
        }}
        className="wa-trigger flex items-center gap-3 cursor-pointer"
        style={{
          background: '#1aad50',
          border: 'none',
          borderRadius: '9999px',
          padding: '12px 20px 12px 14px',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(26,173,80,0.25)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        }}
        aria-label="WhatsApp ile iletişim"
      >
        <WaIcon size={24} />
        <span style={{ fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Size nasıl yardımcı olabiliriz?
        </span>
      </button>
    </div>
  )
}

function WaIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
