'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bot, X, Send, Loader2, MessageCircle, Star, Droplets, Wrench, Cpu } from 'lucide-react'
import {
  sendChatMessage,
  generateWhatsappSummary,
  submitChatRating,
  trackChatOpen,
  type ChatMessage,
} from '@/lib/chatApi'
import { trackEvent } from '@/lib/analytics'

const WA_NUMBER = '905304738793'
const RATED_KEY = 'chatRated'

const GREETING =
  'Merhaba, New Temizlik Hizmetleri\'ne hoş geldiniz. Size en uygun hizmeti belirlemek için birkaç soru sormak istiyorum. Hangi konuda bilgi almak istersiniz?'

const QUICK_REPLIES = [
  {
    label: 'Panel Temizlik Hizmeti',
    desc: 'Saf su ile profesyonel panel yıkama',
    icon: Droplets,
    value: 'Panel temizlik hizmeti hakkında bilgi almak istiyorum.',
  },
  {
    label: 'Panel Bakım & Onarım İzleme',
    desc: 'Performans takibi ve arıza tespiti',
    icon: Wrench,
    value: 'Panel bakım ve onarım izleme hizmeti hakkında bilgi almak istiyorum.',
  },
  {
    label: 'Temizlik Robot & Makina Satışı',
    desc: 'Otonom panel temizlik robotları',
    icon: Cpu,
    value: 'Temizlik robotu ve makina satışı hakkında bilgi almak istiyorum.',
  },
]

// Sayfa yüklemesi başına tek açılma eventi (aynı konuşmanın aç/kapa'sı tekrar sayılmaz)
let openTracked = false

// Değerlendirme overlay'inin `rate` (interaktif) ve `thanks` (read-only) görünümlerinin
// paylaştığı yıldız render mantığı — sadece boyut ve etkileşim davranışı farklı.
function StarRow({
  size,
  filledUpTo,
  onRate,
  onHover,
}: {
  size: number
  filledUpTo: number
  onRate?: (star: number) => void
  onHover?: (star: number) => void
}) {
  const interactive = !!onRate
  return (
    <div className={interactive ? 'flex gap-2' : 'flex gap-1.5'} onMouseLeave={interactive ? () => onHover?.(0) : undefined}>
      {[1, 2, 3, 4, 5].map(star => {
        const icon = (
          <Star
            size={size}
            style={{ color: star <= filledUpTo ? 'var(--color-accent)' : 'var(--border-subtle)' }}
            fill={star <= filledUpTo ? 'currentColor' : 'none'}
          />
        )
        if (!interactive) return <span key={star}>{icon}</span>
        return (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => onHover?.(star)}
            className="p-1 transition-transform hover:scale-115"
            aria-label={`${star} yıldız`}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}

export default function ChatWidget() {
  // Sayfa yüklemesi başına bir kez: konuşma geçmişinin Redis'teki anahtarı
  const [sessionId] = useState(() => crypto.randomUUID())
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [ratingView, setRatingView] = useState<false | 'rate' | 'thanks'>(false)
  const [hoverStar, setHoverStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  // Mobilde buton 3sn etiketli açılır, sonra ikon-only daireye küçülür
  // (renel-enerji'deki .fab-expanded deseni) — masaüstünde her zaman etiketli kalır
  const [fabExpanded, setFabExpanded] = useState(true)

  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeAnimTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pendingRatingRef = useRef(false)

  // Panel'i kapanış animasyonuyla kapatır; unmount'ta ya da hızlı ard arda
  // tetiklenmelerde zamanlayıcı sızıntısı olmasın diye önceki her seferinde temizlenir.
  function closePanel() {
    clearTimeout(closeAnimTimerRef.current)
    setClosing(true)
    closeAnimTimerRef.current = setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 220)
  }

  const userMessageCount = useMemo(() => messages.filter(m => m.role === 'user').length, [messages])
  const lastAssistant = useMemo(() => [...messages].reverse().find(m => m.role === 'assistant'), [messages])
  const showWhatsapp = !!lastAssistant && lastAssistant.content !== GREETING && /whatsapp/i.test(lastAssistant.content)

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!open) return
    // Panel açılırken sayfa da en üste alınır — mobilde tam ekran overlay
    // sayfanın kaydırılmış bir noktasının üzerine açılmasın diye.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // Panel her açılışta baştan mount olur (bkz. render'daki `open || closing` şartı) —
    // uzun bir geçmişte önce en son mesaja anında atla, sonra input'a odaklan; smooth
    // scroll yukarıdaki effect'e bırakılırsa yeniden açılışta göze batan bir kaydırma olur.
    // İlk açılışta (henüz sadece karşılama mesajı varken) en alta değil en üste
    // kaydırılır — karşılama mesajının avatarı/ilk satırı kırpılmasın diye.
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messages.length > 1 ? messagesRef.current.scrollHeight : 0
    }
    inputRef.current?.focus()
    if (!openTracked) {
      openTracked = true
      trackChatOpen()
    }
    // Bilinçli: yalnızca panel AÇILDIĞI andaki mesaj sayısına bakılmalı,
    // sonraki mesaj değişimlerinde tekrar koşmamalı
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => () => {
    clearTimeout(closeTimerRef.current)
    clearTimeout(closeAnimTimerRef.current)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setFabExpanded(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Panel mobilde tam ekran açılıyor (sm altı, bkz. render'daki fixed inset-0
  // sm:static) — o genişlikte arkadaki sayfanın scroll etmesini engelle.
  // Masaüstünde panel yüzen bir kutu olduğu için body kilitlenmiyor.
  useEffect(() => {
    if (!open) return
    if (!window.matchMedia('(max-width: 639px)').matches) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [open])

  // WhatsApp'a geçiş görüşmenin doğal sonu — kullanıcı sekmeye GERÇEKTEN
  // döndüğünde değerlendirme sor
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === 'visible' && pendingRatingRef.current) {
        pendingRatingRef.current = false
        if (!sessionStorage.getItem(RATED_KEY)) setRatingView('rate')
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      // Geçmiş sunucuda sessionId ile tutulur; yalnızca yeni mesaj gönderilir
      const { reply } = await sendChatMessage(trimmed, sessionId)
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: 'Üzgünüz, şu anda yanıt veremiyoruz. Lütfen doğrudan iletişime geçin: +90 530 473 87 93',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function handleWhatsapp() {
    // Pencere `await`'ten SONRA açılırsa tarayıcı bunu kullanıcı eylemine bağlı
    // saymayıp sessizce engelleyebiliyor — boş pencereyi tıklamaya senkron tepki
    // olarak hemen açıp özet hazır olunca yönlendiriyoruz.
    const win = window.open('', '_blank')
    if (win) win.opener = null

    setSummaryLoading(true)
    try {
      const { text } = await generateWhatsappSummary(sessionId)
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
      if (win) win.location.href = url
      else window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      const url = `https://wa.me/${WA_NUMBER}`
      if (win) win.location.href = url
      else window.open(url, '_blank', 'noopener,noreferrer')
    } finally {
      setSummaryLoading(false)
      trackEvent('generate_lead', { method: 'chatbot' })
      pendingRatingRef.current = true
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  function requestClose() {
    const alreadyRated = sessionStorage.getItem(RATED_KEY)
    if (!ratingView && !alreadyRated && userMessageCount >= 2) {
      setRatingView('rate')
      return
    }
    closePanel()
  }

  function handleRate(star: number) {
    setSelectedStar(star)
    setRatingView('thanks')
    sessionStorage.setItem(RATED_KEY, '1')
    submitChatRating(star, sessionId).catch(() => {})
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(closePanel, 1200)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {(open || closing) && (
        <>
          <div
            className="fixed inset-0 sm:hidden"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)',
              animation: closing
                ? 'backdrop-exit 0.2s cubic-bezier(0.4, 0, 1, 1) both'
                : 'backdrop-enter 0.28s ease both',
            }}
            onClick={requestClose}
          />

          <div
            className="fixed inset-0 sm:static flex flex-col overflow-hidden sm:w-96 sm:h-[520px] sm:rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-lg)',
              animation: closing
                ? 'chatbot-exit 0.2s cubic-bezier(0.4, 0, 1, 1) both'
                : 'chatbot-enter 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#fff' }}
              >
                <Image src="/newtemizliklogo.svg" alt="New Temizlik" width={32} height={31} style={{ objectFit: 'contain' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">New Temizlik Danışmanı</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Size en uygun hizmeti belirleyelim</p>
              </div>
              <button
                onClick={requestClose}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Değerlendirme overlay */}
            {ratingView && (
              <div
                className="absolute inset-0 top-[72px] z-10 flex flex-col items-center justify-center gap-5 px-8 text-center"
                style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)', animation: 'backdrop-enter 0.2s ease both' }}
              >
                <div key={ratingView} className="flex flex-col items-center gap-5 animate-[message-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                  {ratingView === 'rate' ? (
                    <>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Görüşmemizi değerlendirir misiniz?</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Danışmanımızı geliştirmemize yardımcı olur</p>
                      </div>
                      <StarRow size={30} filledUpTo={hoverStar} onRate={handleRate} onHover={setHoverStar} />
                      <button
                        onClick={closePanel}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-faint)' }}
                      >
                        Şimdi değil
                      </button>
                    </>
                  ) : (
                    <>
                      <StarRow size={26} filledUpTo={selectedStar} />
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Teşekkür ederiz!</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{
                background: `linear-gradient(rgba(244,245,247,0.78), rgba(244,245,247,0.78)), var(--bg-body) url('/aichatwallpaper.webp') repeat`,
                backgroundSize: '420px auto',
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end origin-bottom-right' : 'justify-start origin-bottom-left'} animate-[message-in_0.25s_ease-out_both]`}
                >
                  {m.role === 'assistant' && (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                      style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}
                    >
                      <Image src="/newtemizliklogo.svg" alt="New Temizlik" width={28} height={27} style={{ objectFit: 'contain' }} />
                    </div>
                  )}
                  <div
                    className="max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      m.role === 'user'
                        ? { background: 'var(--color-primary)', color: '#fff', borderRadius: '16px 16px 4px 16px' }
                        : { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', borderRadius: '16px 16px 16px 4px' }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Hızlı seçim kartları */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-col gap-2">
                  {QUICK_REPLIES.map((qr, i) => {
                    const Icon = qr.icon
                    return (
                      <button
                        key={qr.label}
                        onClick={() => send(qr.value)}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition-colors duration-200 hover:border-[var(--color-primary)] hover:bg-[rgba(127,191,58,0.06)] animate-[message-in_0.25s_ease-out_both]"
                        style={{ animationDelay: `${120 + i * 60}ms` }}
                      >
                        <Icon size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{qr.label}</p>
                          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{qr.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {loading && (
                <div className="flex justify-start origin-bottom-left animate-[message-in_0.25s_ease-out_both]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
                    style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}
                  >
                    <Image src="/newtemizliklogo.svg" alt="New Temizlik" width={28} height={27} style={{ objectFit: 'contain' }} />
                  </div>
                  <div
                    className="px-4 py-3"
                    style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)', borderRadius: '16px 16px 16px 4px' }}
                  >
                    <div className="flex items-center gap-1 h-4" role="status" aria-label="Yazıyor">
                      {[0, 150, 300].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full animate-[typing-bounce_1.2s_ease-in-out_infinite]"
                          style={{ background: 'var(--text-faint)', animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp butonu */}
            {showWhatsapp && (
              <div className="px-4 pt-3 shrink-0" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={handleWhatsapp}
                  disabled={summaryLoading}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-2.5 transition-colors"
                  style={{ background: '#25D366', borderRadius: '10px', opacity: summaryLoading ? 0.6 : 1, border: 'none', cursor: summaryLoading ? 'default' : 'pointer' }}
                >
                  {summaryLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                  {summaryLoading ? 'Hazırlanıyor...' : "WhatsApp'tan Teklif Al"}
                </button>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pt-3 pb-2 shrink-0" style={{ background: 'var(--bg-card)' }}>
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Mesajınızı yazın..."
                  rows={1}
                  className="flex-1 resize-none outline-none transition-colors max-h-24 leading-relaxed"
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', fontSize: '16px', color: 'var(--text-primary)', background: 'var(--bg-body)' }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 flex items-center justify-center shrink-0 text-white transition-[background-color,scale] duration-150 enabled:active:scale-90"
                  style={{ background: !input.trim() || loading ? 'var(--border-subtle)' : 'var(--color-primary)', borderRadius: '10px', border: 'none', cursor: !input.trim() || loading ? 'default' : 'pointer' }}
                  aria-label="Gönder"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-center mt-1.5" style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                Görüşme kayıtları hizmet kalitesi için saklanır —{' '}
                <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="hover-brand" style={{ textDecoration: 'underline', color: 'inherit' }}>
                  KVKK Aydınlatma Metni
                </Link>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="chat-fab-ring" style={{ borderRadius: '9999px', padding: '3px' }}>
        <button
          onClick={() => (open ? requestClose() : setOpen(true))}
          className={`chat-fab ${fabExpanded ? 'chat-fab-expanded' : ''} flex items-center justify-center cursor-pointer transition-transform hover:scale-105`}
          style={{
            height: '50px',
            borderRadius: '9999px',
            border: 'none',
            background: 'var(--color-primary-dark)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(106,170,46,0.4)',
            ...(open ? { width: '50px', paddingInline: 0 } : {}),
          }}
          aria-label={open ? 'Sohbeti kapat' : 'Size nasıl yardımcı olabiliriz?'}
        >
          {open ? (
            <X size={22} />
          ) : (
            <>
              <Bot size={20} style={{ flexShrink: 0 }} />
              <span className="chat-fab-label" style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Size nasıl yardımcı olabiliriz?
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
