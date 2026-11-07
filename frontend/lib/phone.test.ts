import { describe, expect, it } from 'vitest'
import { formatPhoneInput, formatPhoneWithCaret, formatStoredPhone } from './phone'

describe('formatPhoneInput', () => {
  it('çıplak numarayı +90 ile gruplar', () => {
    expect(formatPhoneInput('5543796004')).toBe('+90 554 379 60 04')
  })

  it('başındaki 0\'ı atar', () => {
    expect(formatPhoneInput('05543796004')).toBe('+90 554 379 60 04')
  })

  it('90 ile başlayan girdiyi +90\'a çevirir', () => {
    expect(formatPhoneInput('905543796004')).toBe('+90 554 379 60 04')
  })

  it('kısmi girdide grup boşluklarını yalnızca dolu gruplar için ekler', () => {
    expect(formatPhoneInput('+90 55')).toBe('+90 55')
    expect(formatPhoneInput('+90 5543')).toBe('+90 554 3')
  })

  it('+90 silinmeye çalışılırsa geri ekler', () => {
    expect(formatPhoneInput('')).toBe('+90 ')
  })

  it('+90 sonrasına yazılan baştaki 0\'ı atar', () => {
    expect(formatPhoneInput('+90 0555')).toBe('+90 555')
  })

  it('10 rakamdan fazlasını keser', () => {
    expect(formatPhoneInput('+90 555 123 45 678')).toBe('+90 555 123 45 67')
  })
})

// Tarayıcıdaki onInput'u taklit eder: her tuşta imleç konumuna karakter eklenir,
// sonra formatlanıp imleç yeniden konumlanır.
function typeInto(start: { value: string; caret: number }, keys: string) {
  let state = start
  for (const key of keys) {
    const raw = state.value.slice(0, state.caret) + key + state.value.slice(state.caret)
    state = formatPhoneWithCaret(raw, state.caret + 1)
  }
  return state
}

describe('formatPhoneWithCaret (yazma simülasyonu)', () => {
  it('varsayılan "+90 " sonrasına 0 ile başlayan numara yazılınca doğru sonuç (regresyon)', () => {
    expect(typeInto({ value: '+90 ', caret: 4 }, '05551234567').value).toBe('+90 555 123 45 67')
  })

  it('tüm metin seçiliyken (boş alan) 0 ile yazılınca rakamlar karışmaz (regresyon)', () => {
    expect(typeInto({ value: '', caret: 0 }, '05551234567').value).toBe('+90 555 123 45 67')
  })

  it('0 olmadan yazılınca da doğru', () => {
    expect(typeInto({ value: '+90 ', caret: 4 }, '5551234567').value).toBe('+90 555 123 45 67')
  })

  it('numaranın ortasına rakam eklenince imleç eklenen rakamın arkasında kalır', () => {
    // "+90 555 123 4" içinde "555"ten sonra (konum 7) "9" eklenir
    const state = formatPhoneWithCaret('+90 5559 123 4', 8)
    expect(state.value).toBe('+90 555 912 34')
    expect(state.caret).toBe(9)
  })

  it('imleç önek içindeyken önekin sonuna konur', () => {
    expect(formatPhoneWithCaret('+9 555', 2)).toEqual({ value: '+90 555', caret: 4 })
  })
})

describe('formatStoredPhone', () => {
  it('kanonik 905XXXXXXXXX formunu yerel gösterime çevirir', () => {
    expect(formatStoredPhone('905543796004')).toBe('0554 379 60 04')
  })

  it('null girdide boş string döner', () => {
    expect(formatStoredPhone(null)).toBe('')
  })

  it('beklenmeyen uzunlukta girdiyi olduğu gibi döner', () => {
    expect(formatStoredPhone('12345')).toBe('12345')
  })

  // Fonksiyon "90" önekini doğrulamadan kör slice yapıyor — bu, kaynağın bir
  // quirk'ü (backend zaten kanonik formu garanti ediyor), testin değil. Burada
  // davranış belgeleniyor ki ileride sessizce değişirse fark edilsin.
  it('12 karakterli ama 90 ile başlamayan girdiyi de kör biçimde formatlar', () => {
    expect(formatStoredPhone('123456789012')).toBe('0345 678 90 12')
  })
})
