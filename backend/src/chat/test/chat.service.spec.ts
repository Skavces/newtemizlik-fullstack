import { ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BUDGET_EXCEEDED_MESSAGE, ChatService } from '../chat.service'
import { JUDGE_SYSTEM_PROMPT, judgeUserMessage, RETRY_NUDGE } from '../chat-prompts'
import { LlmService } from '../../llm/llm.service'

type LlmPayload = { messages: { role: string; content: string }[] } & Record<string, unknown>

interface TestService {
  service: ChatService
  call: jest.Mock
  // Judge çağrıları payload'daki JUDGE_SYSTEM_PROMPT üzerinden ayırt edilir
  judgeCallCount: () => number
  // Sıradaki judge kararlarını kuyruğa ekler; null = ağ hatası. Kuyruk boşsa EVET.
  setJudgeVerdicts: (...verdicts: (string | null)[]) => void
}

function makeService(...replies: string[]): TestService {
  const config = { get: () => undefined }
  const genQueue = [...replies]
  const judgeQueue: (string | null)[] = []

  const isJudgePayload = (payload: LlmPayload): boolean =>
    payload.messages[0]?.content === JUDGE_SYSTEM_PROMPT

  const call = jest.fn((_keys: string[], payload: LlmPayload) => {
    if (isJudgePayload(payload)) {
      const verdict = judgeQueue.length ? judgeQueue.shift() : 'EVET'
      if (verdict == null) return Promise.resolve({ res: null, data: null })
      return Promise.resolve({
        res: { ok: true, status: 200 },
        data: { choices: [{ message: { content: verdict } }] },
      })
    }
    return Promise.resolve({
      res: { ok: true, status: 200 },
      data: { choices: [{ message: { content: genQueue.shift() } }] },
    })
  })

  const llm = { call, getKeys: jest.fn().mockReturnValue(['key1']) }
  return {
    service: new ChatService(
      config as unknown as ConfigService,
      llm as unknown as LlmService,
      // Varsayılan: bütçe sayacı hep izin verir; bütçe testleri withRedis ile ezer
      { incr: jest.fn().mockResolvedValue(1), expire: jest.fn() } as unknown as import('ioredis').Redis,
    ),
    call,
    judgeCallCount: () =>
      call.mock.calls.filter(args => isJudgePayload(args[1] as LlmPayload)).length,
    setJudgeVerdicts: (...verdicts: (string | null)[]) => judgeQueue.push(...verdicts),
  }
}

const MESSAGES = [{ role: 'user' as const, content: 'merhaba' }]

describe('ChatService — non-Turkish output guard', () => {
  it('returns LLM reply unchanged when Turkish', async () => {
    const { service, call, judgeCallCount } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    // temiz yol: 1 üretim + 1 judge
    expect(call).toHaveBeenCalledTimes(2)
    expect(judgeCallCount()).toBe(1)
  })

  it('regenerates once when reply leaks foreign words, then returns the clean retry', async () => {
    const { service, call, judgeCallCount } = makeService(
      'Sahanızda monthly kaç panel bulunuyor?',
      'Sahanızda kaç panel bulunuyor?',
    )
    await expect(service.chat(MESSAGES)).resolves.toBe('Sahanızda kaç panel bulunuyor?')
    // kirli ilk yanıtta judge atlanır: üretim + üretim + judge
    expect(call).toHaveBeenCalledTimes(3)
    expect(judgeCallCount()).toBe(1)
    // ilk üretim nudge'sız, retry düzeltici talimatla yapılır
    const systemOf = (i: number) => (call.mock.calls[i][1] as LlmPayload).messages[0].content
    expect(systemOf(0)).not.toContain(RETRY_NUDGE)
    expect(systemOf(1)).toContain(RETRY_NUDGE)
  })

  it('regenerates a second time when the retry also leaks, then returns the clean third attempt', async () => {
    const { service, call, judgeCallCount } = makeService(
      'Sahanızda monthly kaç panel bulunuyor?',
      'Saha büyüklüğünüz about kaç MW?',
      'Saha büyüklüğünüz kaç MW?',
    )
    await expect(service.chat(MESSAGES)).resolves.toBe('Saha büyüklüğünüz kaç MW?')
    // ilk iki yanıt deterministik kirli (judge atlanır), üçüncüde judge çağrılır
    expect(call).toHaveBeenCalledTimes(4)
    expect(judgeCallCount()).toBe(1)
  })

  it('falls back to fixed Turkish message when all attempts leak', async () => {
    const { service, call, judgeCallCount } = makeService(
      'Bilgi almak içinmonthly panel sayınız nedir?',
      'Saha büyüklüğünüz about kaç MW?',
      'Konum bilgisi için cost paylaşır mısınız?',
    )
    const reply = await service.chat(MESSAGES)
    expect(reply).toBe('Üzgünüm, yanıt oluşturulurken bir sorun yaşandı. Sorunuzu tekrar yazar mısınız?')
    // üç yanıt da deterministik kirli: judge hiç çağrılmaz
    expect(call).toHaveBeenCalledTimes(3)
    expect(judgeCallCount()).toBe(0)
  })

  it('replaces non-Latin chat reply with fixed Turkish message after all retries', async () => {
    const { service } = makeService(
      'Солнечная энергия очень выгодна для вашего дома',
      'Солнечная энергия очень выгодна для вашего дома',
      'Солнечная энергия очень выгодна для вашего дома',
    )
    const reply = await service.chat(MESSAGES)
    expect(reply).toBe('Üzgünüm, yanıt oluşturulurken bir sorun yaşandı. Sorunuzu tekrar yazar mısınız?')
  })

  it('throws 503 for non-Latin summary so frontend falls back to plain WhatsApp link', async () => {
    const { service, judgeCallCount } = makeService('Здравствуйте, я использовал систему консультаций')
    await expect(service.generateSummary(MESSAGES)).rejects.toThrow(ServiceUnavailableException)
    // alfabe kontrolü kısa devre yapar, judge'a gidilmez
    expect(judgeCallCount()).toBe(0)
  })
})

describe('ChatService — LLM dil denetçisi (judge)', () => {
  it('regenerates when the judge rejects a heuristically clean reply', async () => {
    const { service, call, setJudgeVerdicts } = makeService(
      'Selamlar, size nasıl yardımcı olabilirim acaba efendim?',
      'Hangi ilçede panel temizliği yaptırmak istiyorsunuz?',
    )
    setJudgeVerdicts('HAYIR', 'EVET')
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    // üretim + judge(HAYIR) + üretim + judge(EVET)
    expect(call).toHaveBeenCalledTimes(4)
  })

  it('falls back to the fixed message when the judge rejects all attempts', async () => {
    const { service, call, setJudgeVerdicts } = makeService('İlk yanıt', 'İkinci yanıt', 'Üçüncü yanıt')
    setJudgeVerdicts('HAYIR', 'HAYIR', 'HAYIR')
    const reply = await service.chat(MESSAGES)
    expect(reply).toBe('Üzgünüm, yanıt oluşturulurken bir sorun yaşandı. Sorunuzu tekrar yazar mısınız?')
    // üç üretim + üç judge
    expect(call).toHaveBeenCalledTimes(6)
  })

  it('fails open when the judge is unreachable', async () => {
    const { service, setJudgeVerdicts } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    setJudgeVerdicts(null) // ağ hatası
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
  })

  it('fails open on an unexpected judge verdict', async () => {
    const { service, setJudgeVerdicts } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    setJudgeVerdicts('BELKİ')
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
  })

  it('wraps the evaluated text in the METİN/KARAR template for the judge', async () => {
    const { service, call } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    await service.chat(MESSAGES)
    const judgeCall = call.mock.calls.find(
      args => (args[1] as LlmPayload).messages[0]?.content === JUDGE_SYSTEM_PROMPT,
    )
    expect((judgeCall?.[1] as LlmPayload).messages[1].content).toBe(
      judgeUserMessage('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?'),
    )
  })

  it('rejects when HAYIR is embedded in a decorated verdict ("Karar: HAYIR")', async () => {
    const { service, setJudgeVerdicts } = makeService('İlk yanıt', 'Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    setJudgeVerdicts('Karar: HAYIR', 'EVET')
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
  })

  it('fails open when the judge echoes the text instead of answering (canlı 2026-07-17)', async () => {
    const { service, setJudgeVerdicts } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    setJudgeVerdicts('Panel temizliği')
    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
  })

  it('rejects a summary when the judge says HAYIR', async () => {
    const { service, setJudgeVerdicts } = makeService('Merhaba, teklif almak istiyorum.')
    setJudgeVerdicts('HAYIR')
    await expect(service.generateSummary(MESSAGES)).rejects.toThrow(ServiceUnavailableException)
  })

  it('returns the summary when the judge approves', async () => {
    const { service, judgeCallCount } = makeService('Merhaba, teklif almak istiyorum.')
    await expect(service.generateSummary(MESSAGES)).resolves.toBe('Merhaba, teklif almak istiyorum.')
    expect(judgeCallCount()).toBe(1)
  })
})

describe('ChatService — LLM günlük bütçe devre kesici', () => {
  function withRedis(
    service: ChatService,
    incrResult: number | Error,
  ): { incr: jest.Mock; expire: jest.Mock } {
    const incr =
      incrResult instanceof Error
        ? jest.fn().mockRejectedValue(incrResult)
        : jest.fn().mockResolvedValue(incrResult)
    const redis = { incr, expire: jest.fn().mockResolvedValue(1) }
    ;(service as unknown as { redis: unknown }).redis = redis
    return redis
  }

  it('returns the fixed message without calling LLM when the daily budget is exceeded', async () => {
    const { service, call } = makeService('kullanılmayacak yanıt')
    withRedis(service, 1001) // varsayılan limit 1000

    await expect(service.chat(MESSAGES)).resolves.toBe(BUDGET_EXCEEDED_MESSAGE)
    expect(call).not.toHaveBeenCalled()
  })

  it('allows the request and sets a TTL on the first increment of the day', async () => {
    const { service, judgeCallCount } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    const redis = withRedis(service, 1)

    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    expect(redis.incr).toHaveBeenCalledWith(expect.stringMatching(/^llm:daily:\d{4}-\d{2}-\d{2}$/))
    expect(redis.expire).toHaveBeenCalledTimes(1)
    // judge bütçe sayacını TÜKETMEZ: 1 üretim + 1 judge'a rağmen incr 1 kez çağrılır
    expect(judgeCallCount()).toBe(1)
    expect(redis.incr).toHaveBeenCalledTimes(1)
  })

  it('fails open when Redis is unreachable', async () => {
    const { service } = makeService('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
    withRedis(service, new Error('connection refused'))

    await expect(service.chat(MESSAGES)).resolves.toBe('Hangi ilçede panel temizliği yaptırmak istiyorsunuz?')
  })

  it('throws 503 for summary when the budget is exceeded (frontend falls back to wa.me)', async () => {
    const { service, call } = makeService('kullanılmayacak özet')
    withRedis(service, 1001)

    await expect(service.generateSummary(MESSAGES)).rejects.toThrow(ServiceUnavailableException)
    expect(call).not.toHaveBeenCalled()
  })
})

describe('ChatService — fiyat sorulduğunda rakam üretmez', () => {
  it('never calls a pricing-extraction endpoint and lets the price-leak guard trigger a retry if the model invents an amount', async () => {
    const { service, call, judgeCallCount } = makeService(
      'Yaklaşık 250.000 TL tutar.',
      'Saha keşfi sonrası proje bazlı bir teklif hazırlıyoruz, panel adedinizi öğrenebilir miyim?',
    )
    const priceMessage = [{ role: 'user' as const, content: 'fiyatınız ne kadar?' }]
    const reply = await service.chat(priceMessage)
    expect(reply).toBe('Saha keşfi sonrası proje bazlı bir teklif hazırlıyoruz, panel adedinizi öğrenebilir miyim?')
    // ilk yanıt fiyat sızıntısı guard'ına takılır (judge'a gitmeden retry), ikinci
    // yanıt temiz: üretim + üretim + judge — bu projede pricing-extraction hiç yok
    expect(call).toHaveBeenCalledTimes(3)
    expect(judgeCallCount()).toBe(1)
  })
})
