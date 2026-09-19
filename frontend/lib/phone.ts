// Backend'in kanonik formatını ("905XXXXXXXXX", bkz. CreateQuoteRequestDto'nun
// @Transform'u) okunur yerel forma çevirir: "905543796004" -> "0554 379 60 04".
// Contact.tsx'teki formatTurkishPhone TERSİ işi yapar (kullanıcı girdisini
// yazarken +90 formunda maskeler) — ikisi karıştırılmamalı.
export function formatStoredPhone(phone: string | null): string {
  if (!phone || phone.length !== 12) return phone ?? ''
  const local = '0' + phone.slice(2)
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 9)} ${local.slice(9, 11)}`
}
