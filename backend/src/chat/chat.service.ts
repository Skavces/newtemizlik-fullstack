import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { LlmService, LLM_MODEL, LLM_FALLBACK_MODEL } from '../llm/llm.service'
import { REDIS_CLIENT } from '../redis/redis.module'
import { extractTlAmounts, hasNonLatinLeak, hasPriceLeak, isContaminated, sanitizeContent } from './chat-guards'
import {
  JUDGE_SYSTEM_PROMPT,
  judgeUserMessage,
  RETRY_NUDGE,
  SUMMARY_PROMPT,
  SYSTEM_PROMPT,
} from './chat-prompts'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Günlük LLM bütçesi: kötüye kullanım kotayı bitirip gerçek müşterinin
// chatbot'unu susturmasın diye chatbot yoluna devre kesici konur.
const DEFAULT_DAILY_LIMIT = 1000
const BUDGET_KEY_PREFIX = 'llm:daily:'
const BUDGET_KEY_TTL_SECONDS = 48 * 60 * 60

export const BUDGET_EXCEEDED_MESSAGE =
  'Şu anda yoğunluk nedeniyle yanıt veremiyorum. Aşağıdaki "WhatsApp\'tan Teklif Al" ' +
  'butonuna basarak talebinizi doğrudan bize iletebilirsiniz.'

export class LlmBudgetExceededError extends Error {
  constructor() {
    super('LLM günlük bütçesi aşıldı')
  }
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(
    private config: ConfigService,
    private llm: LlmService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  // true → istek bütçeye sığdı; false → günlük limit doldu.
  // Redis erişilemezse fail-open: chatbot bütçe yüzünden hiç susmasın.
  private async consumeDailyBudget(): Promise<boolean> {
    const limit = Number(this.config.get<string>('LLM_DAILY_LIMIT') ?? DEFAULT_DAILY_LIMIT)
    if (!Number.isFinite(limit) || limit <= 0) return true

    try {
      const key = `${BUDGET_KEY_PREFIX}${new Date().toISOString().slice(0, 10)}`
      const count = await this.redis.incr(key)
      if (count === 1) await this.redis.expire(key, BUDGET_KEY_TTL_SECONDS)
      if (count > limit) {
        // Log seline dönmesin: yalnızca eşiğin aşıldığı ilk istekte error bas
        if (count === limit + 1) this.logger.error(`LLM günlük bütçesi aşıldı (limit: ${limit})`)
        return false
      }
      return true
    } catch (err) {
      this.logger.warn(
        `Bütçe sayacı okunamadı, istek engellenmedi: ${err instanceof Error ? err.message : err}`,
      )
      return true
    }
  }

  // SYSTEM_PROMPT zaten "2-3 cümleyi geçme" diyor (~40-90 token), uzunluğu prompt
  // sınırlar. Tavan yalnızca gpt-oss'un gizli "reasoning" token'larına pay
  // bırakmak için yüksek: düşükte reasoning bütçeyi yiyip content'i boş bırakıyordu.
  private async callLlm(systemPrompt: string, messages: ChatMessage[], maxTokens = 800): Promise<string> {
    const keys = this.llm.getKeys()
    if (!keys.length) {
      this.logger.error('LLM_CHAT_KEYS tanımlı değil')
      throw new ServiceUnavailableException('Chatbot şu anda kullanılamıyor')
    }

    if (!(await this.consumeDailyBudget())) {
      throw new LlmBudgetExceededError()
    }

    const { res, data } = await this.llm.call(keys, {
      model: LLM_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages.slice(-12)],
      max_tokens: maxTokens,
      temperature: 0.3,
    })

    const content = data?.choices?.[0]?.message?.content
    if (!res?.ok || typeof content !== 'string' || !content.trim()) {
      this.logger.error(`LLM yanıtı kullanılamadı (durum: ${res?.status ?? 'ağ hatası'})`)
      throw new ServiceUnavailableException('Yanıt alınamadı, lütfen tekrar deneyin')
    }
    // Cevap geçmişe geri döneceği için modeli de sanitize et; ayraç vb. kalıntılar
    // sonraki isteklerde injection filtresine takılmasın
    return sanitizeContent(content)
  }

  // LLM judge: heuristiklerin göremediği Latin alfabeli sızıntıları ucuz bir
  // çağrıyla yakalar. Judge erişilemez/anlaşılmaz ise fail-open — bütçe
  // sayacıyla aynı felsefe: dil saflığı uğruna chatbot susturulmaz.
  private async isTurkishByJudge(text: string): Promise<boolean> {
    const { res, data } = await this.llm.call(this.llm.getKeys(), {
      model: LLM_FALLBACK_MODEL,
      messages: [
        { role: 'system', content: JUDGE_SYSTEM_PROMPT },
        { role: 'user', content: judgeUserMessage(text) },
      ],
      max_tokens: 200, // reasoning token'ları dahil; 8'de karar hiç üretilemiyordu
      temperature: 0,
    })

    const verdict = data?.choices?.[0]?.message?.content
    if (!res?.ok || typeof verdict !== 'string' || !verdict.trim()) {
      this.logger.warn(`Dil denetçisine ulaşılamadı, yanıt kabul edildi (durum: ${res?.status ?? 'ağ hatası'})`)
      return true
    }
    // Karar metnin herhangi bir yerinde aranır ("Karar: HAYIR" gibi süslemeler
    // startsWith'i kaçırıyordu); HAYIR öncelikli — yanlış HAYIR en kötü bir fazladan
    // yeniden üretim tetikler, yanlış EVET ise sızıntıyı denetimsiz geçirir
    const normalized = verdict.trim().toUpperCase()
    if (normalized.includes('HAYIR')) return false
    if (!normalized.includes('EVET')) {
      this.logger.warn(`Dil denetçisi beklenmedik yanıt verdi, kabul edildi: "${verdict.slice(0, 40)}"`)
    }
    return true
  }

  // Deterministik guard'lar (ucuz) önce; onlar temiz derse son söz judge'ın.
  // allowedAmounts: kullanıcının kendi mesajlarında geçen TL tutarları (ör.
  // faturasını tekrarlaması) hasPriceLeak'te sızıntı sayılmaz.
  private async isLeaky(text: string, allowedAmounts: readonly number[]): Promise<boolean> {
    if (isContaminated(text)) return true
    if (hasPriceLeak(text, allowedAmounts)) return true
    return !(await this.isTurkishByJudge(text))
  }

  // Kullanıcıya göstermeden en fazla bu kadar üretim denenir; hepsi sızarsa sabit
  // mesaja düşülür.
  private static readonly MAX_CHAT_ATTEMPTS = 3

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const allowedAmounts = extractTlAmounts(
        messages.filter(m => m.role === 'user').map(m => m.content).join(' '),
      )

      for (let attempt = 1; attempt <= ChatService.MAX_CHAT_ATTEMPTS; attempt++) {
        // İlk deneme düz sistem promptuyla, sonrakiler düzeltici talimatla yapılır
        // (kör tekrar aynı sızıntıyı yeniden üretebiliyor)
        const systemPrompt = attempt === 1 ? SYSTEM_PROMPT : `${SYSTEM_PROMPT}\n\n${RETRY_NUDGE}`
        const reply = await this.callLlm(systemPrompt, messages)
        if (!(await this.isLeaky(reply, allowedAmounts))) return reply

        const isLastAttempt = attempt === ChatService.MAX_CHAT_ATTEMPTS
        this.logger.warn(
          isLastAttempt
            ? `${attempt}. denemede de sızıntı, sabit mesaja düşürüldü: "${reply.slice(0, 120)}"`
            : `Yabancı dil sızıntısı (deneme ${attempt}/${ChatService.MAX_CHAT_ATTEMPTS}), yanıt yeniden üretiliyor: "${reply.slice(0, 120)}"`,
        )
      }
      return 'Üzgünüm, yanıt oluşturulurken bir sorun yaşandı. Sorunuzu tekrar yazar mısınız?'
    } catch (err) {
      // Bütçe dolduğunda hata yerine normal cevap gibi sabit mesaj dön;
      // frontend'de WhatsApp butonu görünür kalır
      if (err instanceof LlmBudgetExceededError) return BUDGET_EXCEEDED_MESSAGE
      throw err
    }
  }

  async generateSummary(messages: ChatMessage[]): Promise<string> {
    let text: string
    try {
      text = await this.callLlm(SUMMARY_PROMPT, messages, 300)
    } catch (err) {
      // Frontend 503'te düz wa.me linkine düşüyor; bütçe aşımında da aynı yol
      if (err instanceof LlmBudgetExceededError) {
        throw new ServiceUnavailableException('Özet oluşturulamadı')
      }
      throw err
    }
    // Özet bilinçli olarak foreign-word ön-filtresine girmez (şablon markalı terim
    // içerir); alfabe kontrolü + judge yeterli
    if (hasNonLatinLeak(text) || !(await this.isTurkishByJudge(text))) {
      // Frontend hata durumunda düz wa.me linkine düşüyor; bozuk özeti mesaj yapma
      this.logger.warn(`Türkçe olmayan özet reddedildi: "${text.slice(0, 120)}"`)
      throw new ServiceUnavailableException('Özet oluşturulamadı')
    }
    return text
  }
}
