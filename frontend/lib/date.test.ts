import { describe, expect, it } from 'vitest'
import { dayRangeToEpoch, dayRangeToIso, formatDate, formatDateTime } from './date'

describe('dayRangeToIso', () => {
  it('yerel gün başlangıcını ve sonunu ISO olarak döner', () => {
    const { from, to } = dayRangeToIso('2026-07-01', '2026-07-15')
    expect(new Date(from!)).toEqual(new Date('2026-07-01T00:00:00'))
    expect(new Date(to!)).toEqual(new Date('2026-07-15T23:59:59.999'))
  })

  it('tek uç verilebilir', () => {
    expect(dayRangeToIso('2026-07-01', '')).not.toHaveProperty('to')
    expect(dayRangeToIso('', '2026-07-15')).not.toHaveProperty('from')
  })

  it('boş girdide boş nesne döner', () => {
    expect(dayRangeToIso('', '')).toEqual({})
    expect(dayRangeToIso(undefined, undefined)).toEqual({})
  })

  it('geçersiz girdi sessizce atlanır', () => {
    expect(dayRangeToIso('dun', 'yarin')).toEqual({})
  })

  it('karışık girdide yalnızca geçerli uç dönüp geçersiz olan atlanır', () => {
    const result = dayRangeToIso('2026-07-01', 'yarin')
    expect(new Date(result.from!)).toEqual(new Date('2026-07-01T00:00:00'))
    expect(result).not.toHaveProperty('to')
  })
})

describe('dayRangeToEpoch', () => {
  it('yerel gün sınırlarını ms epoch olarak döner', () => {
    const { startAt, endAt } = dayRangeToEpoch('2026-07-01', '2026-07-15')
    expect(startAt).toBe(new Date('2026-07-01T00:00:00').getTime())
    expect(endAt).toBe(new Date('2026-07-15T23:59:59.999').getTime())
  })

  it('boş girdide boş nesne döner', () => {
    expect(dayRangeToEpoch('', '')).toEqual({})
  })
})

describe('formatDate', () => {
  it('gün ay(uzun) yıl olarak döner', () => {
    expect(formatDate(new Date(2026, 6, 1).toISOString())).toBe('01 Temmuz 2026')
  })
})

describe('formatDateTime', () => {
  it('gün/ay(kısa)/yıl saat:dakika olarak döner', () => {
    expect(formatDateTime(new Date(2026, 6, 1, 14, 5).toISOString())).toBe('01 Tem 2026 14:05')
  })

  it('formatDate ile aynı değeri üretmez (saat içerir, ay kısaltılır)', () => {
    expect(formatDateTime(new Date(2026, 0, 5, 9, 0).toISOString())).toBe('05 Oca 2026 09:00')
  })
})
