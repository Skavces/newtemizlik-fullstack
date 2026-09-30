import sanitizeHtml from 'sanitize-html'

// Blog içeriği için allowlist — frontend'deki tiptap editörünün (RichTextEditor.tsx)
// üretebildiği çıktıyla birebir: StarterKit (h2-h3, h1 editörde kapalı — sayfa
// zaten kendi H1'ini basıyor), Underline, TextStyle+Color,
// FontFamily, TextAlign, Link, Image (bkz. Faz 4 planı, gövde görseli desteği).
// Editöre yeni extension eklenirse burası da güncellenmeli, yoksa meşru içerik
// yazma anında budanır. Render tarafındaki DOMPurify (BlogArticleLayout) ikinci
// savunma katmanı olarak kalır.
const UPLOAD_IMG_SRC = /^\/uploads\/[^\s"'<>]+$/
const HTTPS_IMG_SRC = /^https:\/\/[^\s"'<>]+$/

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr',
    'h2', 'h3',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'a', 'span',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    p: ['style'],
    h2: ['style'],
    h3: ['style'],
    span: ['style'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/],
      'font-family': [/^[\w\s,'"-]+$/],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
  // img.src'yi kendi upload'larımızla (/uploads/...) veya https ile sınırlar —
  // sanitize-html'in allowedSchemes'i şema doğrular ama yol biçimini denetlemez;
  // burada onaylanmayan her img (data:, http:, javascript:, srcset kaçışı vb.)
  // tamamen düşürülür.
  exclusiveFilter: (frame) => {
    if (frame.tag !== 'img') return false
    const src = frame.attribs.src || ''
    return !(UPLOAD_IMG_SRC.test(src) || HTTPS_IMG_SRC.test(src))
  },
}

export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS)
}

// Düz metin alanları (örn. excerpt) için: tüm tag'leri söker
export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim()
}
