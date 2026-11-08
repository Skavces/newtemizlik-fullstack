import { SERVICE_CATALOG } from '../../common/service-catalog'
import { JUDGE_SYSTEM_PROMPT, SUMMARY_PROMPT, SYSTEM_PROMPT } from '../chat-prompts'

describe('chat-prompts', () => {
  // Eklenen hizmetin chatbot'a da yazılmasını zorunlu kılar: bot, kataloğunda
  // olmayan hizmeti soran müşteriyi konu dışı sayıp reddeder.
  it.each(SERVICE_CATALOG.map(s => [s.name]))('SYSTEM_PROMPT "%s" hizmetini içerir', name => {
    expect(SYSTEM_PROMPT).toContain(name)
  })

  it('tek başına "temizlik" kelimesini panel temizliğine eşlemez', () => {
    expect(SYSTEM_PROMPT).toContain('tek başına "temizlik" kelimesi BELİRSİZDİR')
    expect(SYSTEM_PROMPT).not.toContain('"panel yıkama", "temizlik" panel temizliği')
  })

  it('ücretsiz keşif sözünü temizlik hizmetleri için yasaklar', () => {
    expect(SYSTEM_PROMPT).toContain('Temizlik hizmetlerinde ücretsiz keşif sözü VERMEYİN')
  })

  it('halı yıkamayı WhatsApp\'a yönlendirmeden reddeder', () => {
    expect(SYSTEM_PROMPT).toContain('Halı yıkama hizmetimiz YOKTUR')
    expect(SYSTEM_PROMPT).not.toContain('(halı, perde')
  })

  it('WhatsApp özeti iki hattın bilgi satırını da tanımlar', () => {
    expect(SUMMARY_PROMPT).toContain('Saha bilgisi:')
    expect(SUMMARY_PROMPT).toContain('Mekân bilgisi:')
  })

  it('dil denetçisi temizlik hattının terimlerini Türkçe sayar', () => {
    expect(JUDGE_SYSTEM_PROMPT).toContain('AVM')
    expect(JUDGE_SYSTEM_PROMPT).toContain('m²')
  })
})
