import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { fetchWithTimeout } from '../common/fetch-with-timeout'

// "LlmService" hangi sağlayıcıyı kullandığımızdan bağımsız kalır — sağlayıcı
// değişirse yalnızca bu dosyadaki URL/model/auth biçimi değişir, sınıf adı ve
// tüm çağıranlar aynı kalır (renel-enerji'de Groq -> OpenRouter geçişinde
// doğrulanmış bir tasarım kararı).
//
// Sağlayıcı: Groq'un OpenAI-uyumlu ucu (Bearer auth, aynı istek/cevap biçimi).
// Gemini'den geçiş nedeni: Groq model başına belgeli, org bazlı sabit limitler
// veriyor (OpenRouter'daki paylaşımlı havuzdan kaynaklanan öngörülemeyen 429'lar
// yok). LLM_CHAT_KEYS artık Groq anahtarlarını taşır. gpt-oss modelleri de
// Gemini 3.x gibi gizli "reasoning" token bütçesi tüketiyor (bkz. call()'daki
// reasoning_effort). Model değişirse LlmHealthService günlük sağlık kontrolüyle
// doğrular — bu key'in kataloğunda llama-3.x modelleri artık yok, sadece gpt-oss
// ve Preview statüsündeki qwen3.8-27b (prod için önerilmiyor) mevcut.
export const LLM_MODEL = 'openai/gpt-oss-120b'
export const LLM_FALLBACK_MODEL = 'openai/gpt-oss-20b'
export const LLM_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const REQUEST_TIMEOUT_MS = 15000

// OpenAI-uyumlu chat completions cevabından kullanılan alanlar. `error`:
// OpenRouter, sağlayıcı aşırı yüklendiğinde HTTP 200 ile birlikte gövdede hata
// döndürebiliyor (bkz. call()) — yalnızca res.ok'a bakmak bunu kaçırır.
export interface LlmResponse {
  choices?: { message?: { content?: string } }[]
  error?: { message?: string; code?: number | string }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name)

  constructor(private config: ConfigService) {}

  // Virgüllü anahtar listesi (LLM_CHAT_KEYS), sıra = deneme önceliği.
  getKeys(): string[] {
    return (this.config.get<string>('LLM_CHAT_KEYS') ?? '')
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)
  }

  private async request(key: string, payload: object): Promise<Response | null> {
    try {
      return await fetchWithTimeout(LLM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        // gpt-oss "reasoning" alanı max_tokens'tan pay yiyor; effort'u en düşükte
        // tutuyoruz yoksa content boş dönebiliyor (Groq'ta yalnızca low/medium/high
        // geçerli, Gemini'deki 'minimal' 400 döndürüyor).
        body: JSON.stringify({ reasoning_effort: 'low', ...payload }),
      }, REQUEST_TIMEOUT_MS)
    } catch (err) {
      this.logger.warn(`LLM isteği başarısız: ${err instanceof Error ? err.message : err}`)
      return null
    }
  }

  async call(
    keys: string[],
    payload: { model: string } & Record<string, unknown>,
  ): Promise<{ res: Response | null; data: LlmResponse | null }> {
    // Sırasıyla: elimizdeki anahtarların hepsi birincil modelle denenir (429/5xx
    // için — her anahtarın kotası ayrı); tek anahtar varsa aynı anahtar bir kez
    // daha denenir (geçici ağ hatalarına karşı). Son çare: yedek model.
    const primaryKeys = keys.length > 1 ? keys : [...keys, ...keys]
    const attempts = [
      ...primaryKeys.map((key, i) => ({ key, model: payload.model, delayMs: i === 0 ? 0 : 500 })),
      { key: keys[0], model: LLM_FALLBACK_MODEL, delayMs: 1000 },
    ]

    let res: Response | null = null
    let lastStatus: number | string = 'ağ hatası'
    for (const attempt of attempts) {
      if (attempt.delayMs) await sleep(attempt.delayMs)
      res = await this.request(attempt.key, { ...payload, model: attempt.model })
      if (res?.ok) {
        const data: LlmResponse = await res.json()
        if (!data.error) return { res, data }
        lastStatus = `200 (gövdede hata: ${data.error.message ?? data.error.code ?? '?'})`
        this.logger.warn(`LLM ${attempt.model} yanıtı: ${lastStatus}`)
        continue
      }
      lastStatus = res?.status ?? 'ağ hatası'
      const body = res ? (await res.text().catch(() => '')).slice(0, 300) : ''
      this.logger.warn(
        `LLM ${attempt.model} yanıtı: ${res ? res.status : 'ağ hatası/zaman aşımı'}${body ? ` — ${body}` : ''}`,
      )
    }

    this.logger.error(`LLM tüm denemelerde başarısız (son durum: ${lastStatus})`)
    return { res, data: null }
  }

  // Tek deneme, fallback zinciri YOK (call()'un aksine). Sağlık kontrolü tam
  // olarak hangi modelin çalıştığını görmek istiyor; call()'daki otomatik
  // model değişimi bunu maskeler (bkz. llm-health.service.ts).
  async ping(key: string, model: string): Promise<boolean> {
    const res = await this.request(key, { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 5 })
    if (!res?.ok) return false
    const data: LlmResponse = await res.json()
    return !data.error
  }
}
