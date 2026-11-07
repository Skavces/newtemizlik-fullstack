import { Equals, IsBoolean, IsEmail, IsEmpty, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateIf } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { SERVICE_SLUGS, serviceCategoryOf } from '../../common/service-catalog'

// hizmet gönderilmeyen istek = hizmet alanından önceki (yalnızca GES) form
// sözleşmesi; deploy anında sayfayı eski sürümle açık tutan ziyaretçiler de
// böylece 400 almaz. Bu durumda panelAdeti + suUlasimi eskisi gibi zorunludur.
export function isGesRequest(o: { hizmet?: string }): boolean {
  return !o.hizmet || serviceCategoryOf(o.hizmet) === 'ges'
}

// Su erişimi yalnızca panel temizliğinde (ve eski formda) zorunlu sorulur
export function requiresWaterAccess(o: { hizmet?: string }): boolean {
  return !o.hizmet || o.hizmet === 'panel-temizlik'
}

export function isCleaningRequest(o: { hizmet?: string }): boolean {
  return serviceCategoryOf(o.hizmet) === 'temizlik'
}

export class CreateQuoteRequestDto {
  @IsOptional()
  @IsIn(SERVICE_SLUGS, { message: 'Geçerli bir hizmet seçin' })
  hizmet?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  adSoyad: string

  // Rakam dışı her karakter atılır; başındaki tek "0" (yerel çevirme) düşürülür ve
  // "90" ülke kodu yoksa eklenir — hem "0554 379 60 04" hem "554 379 60 04" hem
  // "905543796004" girdisi aynı kanonik forma ("905XXXXXXXXX") normalize edilir
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.slice(1)
    if (!digits.startsWith('90')) digits = `90${digits}`
    return digits
  })
  @Matches(/^905\d{9}$/, { message: 'Geçerli bir cep telefonu numarası girin' })
  telefon: string

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  ePosta?: string

  // GES taleplerinde zorunlu; temizlik talebinde gelirse doğrulanmaz ve
  // QuoteService tarafından kaydedilmez
  @ValidateIf(isGesRequest)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000000)
  panelAdeti?: number

  // Temizlik taleplerinde opsiyonel yaklaşık alan; GES'te yok sayılır
  @ValidateIf((o: CreateQuoteRequestDto) => isCleaningRequest(o) && o.metrekare !== undefined && o.metrekare !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000000)
  metrekare?: number

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  sahaMegavati?: number

  // Panel temizliğinde zorunlu; diğer GES hizmetlerinde gönderilirse boolean
  // olmalı; temizlik talebinde yok sayılır
  @ValidateIf((o: CreateQuoteRequestDto) => requiresWaterAccess(o) || (isGesRequest(o) && o.suUlasimi !== undefined))
  @IsBoolean()
  suUlasimi?: boolean

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  lokasyon: string

  @Equals(true, { message: 'KVKK aydınlatma metnini onaylamanız gerekiyor' })
  kvkkConsent: boolean

  // Honeypot: gerçek kullanıcılar bu alanı görmez/doldurmaz. forbidNonWhitelisted
  // açık olduğu için DTO'da tanımlı olmalı; dolu gelirse validasyon 400 döner.
  @IsOptional()
  @IsEmpty()
  website?: string
}
