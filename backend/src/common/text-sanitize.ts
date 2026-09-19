// Serbest metin alanları (iletişim formu mesajı vb.) için genel amaçlı temizlik —
// kontrol karakterlerini ve prompt-injection/format-bozma amaçlı ayraçları süzer.
// Kaynak: renel-enerji backend/src/chat/chat-guards.ts sanitizeContent()
export function sanitizeContent(text: string): string {
  return text
    // null bytes and non-printable control chars (keep newline/tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // strip Llama/ChatML special tokens that survive printable-char filter
    .replace(/<\|[^|>]{1,30}\|>/g, '')
    // strip markdown separators used to fake prompt boundaries (###, ----, ====)
    .replace(/#{3,}|-{4,}|={4,}/g, '')
    // collapse excessive whitespace/newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
