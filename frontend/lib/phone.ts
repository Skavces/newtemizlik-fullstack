const PHONE_PREFIX = '+90 '

// Girdiden ulusal numaranın rakamlarını çıkarır: "+90"/"90" ülke kodu ve
// baştaki "0" (yerel çevirme alışkanlığı) atılır, en fazla 10 rakam.
// Türkiye cep numaraları 5 ile başladığı için baştaki "90" her zaman ülke kodudur.
function nationalDigits(value: string): string {
  let rest = value.trimStart()
  // "+" ile başlıyorsa önek (kısmen silinmiş olsa bile: "+9 555") atılır
  if (rest.startsWith('+')) rest = rest.replace(/^\+9?0?/, '')
  let digits = rest.replace(/\D/g, '')
  if (digits.startsWith('90')) digits = digits.slice(2)
  return digits.replace(/^0+/, '').slice(0, 10)
}

function groupNational(digits: string): string {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(' ')
}

// Kullanıcı yazarken telefon alanını "+90 5XX XXX XX XX" formuna zorlar;
// +90'ı silmeye çalışırsa geri ekler. (formatStoredPhone'un TERSİ yönü.)
export function formatPhoneInput(rawValue: string): string {
  return PHONE_PREFIX + groupNational(nationalDigits(rawValue))
}

// Formatlanmış değer + imlecin yeni konumu. İmleç, formatlamadan önce
// arkasında kalan ULUSAL rakam sayısına göre yerleştirilir — "+90" önekinin ve
// atılan baştaki "0"ın rakamları sayılmaz. (Önceki sürüm bunları da sayıyordu:
// boş alana "0555…" yazılınca imleç kayıyor ve rakamlar karışıyordu.)
export function formatPhoneWithCaret(rawValue: string, caret: number): { value: string; caret: number } {
  const national = nationalDigits(rawValue)
  const value = PHONE_PREFIX + groupNational(national)
  // İmlecin SAĞINDAKİ rakamlar önek/baştaki-0 temizliğinden etkilenmez; soldaki
  // ulusal rakam sayısı = toplam − sağdakiler.
  const digitsAfterCaret = rawValue.slice(caret).replace(/\D/g, '').length
  const nationalBefore = Math.max(0, Math.min(national.length, national.length - digitsAfterCaret))
  if (nationalBefore === 0) return { value, caret: PHONE_PREFIX.length }
  let seen = 0
  for (let i = PHONE_PREFIX.length; i < value.length; i++) {
    if (/\d/.test(value[i]) && ++seen === nationalBefore) return { value, caret: i + 1 }
  }
  return { value, caret: value.length }
}

// Backend'in kanonik formatını ("905XXXXXXXXX", bkz. CreateQuoteRequestDto'nun
// @Transform'u) okunur yerel forma çevirir: "905543796004" -> "0554 379 60 04".
// formatPhoneInput TERSİ işi yapar (kullanıcı girdisini yazarken +90 formunda
// maskeler) — ikisi karıştırılmamalı.
export function formatStoredPhone(phone: string | null): string {
  if (!phone || phone.length !== 12) return phone ?? ''
  const local = '0' + phone.slice(2)
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 9)} ${local.slice(9, 11)}`
}
