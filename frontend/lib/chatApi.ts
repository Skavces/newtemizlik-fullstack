'use client'

// Chatbot widget'ının backend'e konuştuğu istemci taraflı fetch sarmalayıcısı.
// lib/api.ts'ten (sunucu taraflı, ISR cache'li) kasıtlı olarak ayrı — burada
// istekler tarayıcıdan, cache'siz ve konuşma başına atılır. lib/apiClient.ts'teki
// API_URL kullanılır (NEXT_PUBLIC_API_URL).
import { API_URL } from './apiClient'
import type { ChatMessage } from '@/types/api'

// Backend'in en kötü durum retry zincirini (3 üretim denemesi x model/anahtar
// fallback'i) karşılayacak kadar uzun.
const TIMEOUT_MS = 60000

async function post(path: string, body: object): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

// Konuşma geçmişi sunucuda (sessionId anahtarıyla, Redis'te) tutulur; istemci
// yalnızca yeni kullanıcı mesajını gönderir.
export async function sendChatMessage(message: string, sessionId: string): Promise<{ reply: string }> {
  const res = await post('/chat', { message, sessionId })
  if (!res.ok) throw new Error('Yanıt alınamadı')
  return res.json()
}

export async function generateWhatsappSummary(sessionId: string): Promise<{ text: string }> {
  const res = await post('/chat/summary', { sessionId })
  if (!res.ok) throw new Error('Özet oluşturulamadı')
  return res.json()
}

export async function submitChatRating(rating: number, sessionId: string): Promise<void> {
  const res = await post('/chat/rating', { rating, sessionId })
  if (!res.ok) throw new Error('Değerlendirme gönderilemedi')
}

// Huni sayacı; hata sessizce yutulur, istatistik kaybı sohbet akışını etkilememeli
export function trackChatOpen(): void {
  fetch(`${API_URL}/chat/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'open' }),
  }).catch(() => {})
}

export type { ChatMessage }
