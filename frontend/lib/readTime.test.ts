import { describe, expect, it } from 'vitest'
import { estimateReadTime } from './readTime'

describe('estimateReadTime', () => {
  it('HTML etiketlerini atıp kelime sayısından dakika hesaplar', () => {
    const html = `<p>${'kelime '.repeat(400)}</p>`
    expect(estimateReadTime(html)).toBe(2)
  })

  it('boş içerikte bile en az 1 dakika döner', () => {
    expect(estimateReadTime('')).toBe(1)
    expect(estimateReadTime('<p></p>')).toBe(1)
  })

  it('Math.round yuvarlama sınırını doğru taraflara yuvarlar', () => {
    expect(estimateReadTime('kelime '.repeat(299))).toBe(1)
    expect(estimateReadTime('kelime '.repeat(300))).toBe(2)
  })

  // Etiketler boşlukla değil boş string'le değiştirilseydi sınırdaki iki kelime
  // "kelimekelime" olarak tek kelimeye birleşir, kelime sayısı 300 yerine 299
  // olurdu (round(299/200)=1) — bu test tam o yuvarlama sınırında, bitişik
  // etiketlerin kelimeleri birleştirmediğini doğruluyor.
  it('bitişik etiketler arasındaki kelimeleri birleştirmez', () => {
    const html = `${'kelime '.repeat(298)}<b>kelime</b><i>kelime</i>`
    expect(estimateReadTime(html)).toBe(2)
  })
})
