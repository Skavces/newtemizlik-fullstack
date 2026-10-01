import { describe, expect, it } from 'vitest'
import { formatStoredPhone } from './phone'

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
