import { sanitizeRichHtml, stripHtml } from '../html-sanitize'

describe('sanitizeRichHtml', () => {
  it('temel biçimlendirme etiketlerini korur', () => {
    const html = '<p>Merhaba <strong>dünya</strong></p>'
    expect(sanitizeRichHtml(html)).toBe(html)
  })

  it('allowlist dışı etiketleri (script, iframe) söker', () => {
    expect(sanitizeRichHtml('<p>metin</p><script>alert(1)</script>')).toBe('<p>metin</p>')
    expect(sanitizeRichHtml('<iframe src="https://evil.com"></iframe><p>x</p>')).toBe('<p>x</p>')
  })

  it('allowlist dışı etiketleri (table) söker ama içerik metnini bırakır', () => {
    // sanitize-html'in varsayılan disallowedTagsMode ('discard') etiketi atar,
    // metnini korur — script/iframe'den farklı olarak table özel işlenmez.
    expect(sanitizeRichHtml('<table><tr><td>x</td></tr></table>')).toBe('x')
  })

  it('/uploads/ ile başlayan göreli img src\'sini korur', () => {
    const html = '<p>metin</p><img src="/uploads/foto-gunes-paneli-temizligi-123-4567.webp" alt="foto" />'
    expect(sanitizeRichHtml(html)).toBe(html)
  })

  it('https img src\'sini korur', () => {
    const html = '<img src="https://cdn.example.com/x.webp" alt="x" />'
    expect(sanitizeRichHtml(html)).toBe(html)
  })

  it('http (https olmayan) img src\'sini düşürür', () => {
    expect(sanitizeRichHtml('<p>a</p><img src="http://evil.com/x.png" alt="x"><p>b</p>')).toBe('<p>a</p><p>b</p>')
  })

  it('data: URI img src\'sini düşürür', () => {
    expect(sanitizeRichHtml('<img src="data:image/png;base64,AAAA" alt="x">')).toBe('')
  })

  it('/uploads/ dışı göreli img src\'sini düşürür', () => {
    expect(sanitizeRichHtml('<img src="/etc/passwd" alt="x">')).toBe('')
  })

  it('img üzerindeki izinsiz attribute\'ları (onerror, srcset, style) söker ama img\'i korur', () => {
    const html = '<img src="/uploads/x.webp" alt="x" width="600" height="400" onerror="alert(1)" srcset="/uploads/y.webp 2x" style="position:fixed">'
    expect(sanitizeRichHtml(html)).toBe('<img src="/uploads/x.webp" alt="x" width="600" height="400" />')
  })

  it('link\'lere rel="noopener noreferrer" ekler', () => {
    expect(sanitizeRichHtml('<a href="https://example.com">link</a>')).toBe(
      '<a href="https://example.com" rel="noopener noreferrer">link</a>',
    )
  })

  it('javascript: şemalı linkleri düşürür', () => {
    expect(sanitizeRichHtml('<a href="javascript:alert(1)">tıkla</a>')).toBe('<a rel="noopener noreferrer">tıkla</a>')
  })

  it('izinsiz bir özellik içeren style değerini tamamen söker', () => {
    // sanitize-html bir style bildirimindeki tek bir izinsiz özellik yüzünden
    // (burada position) tüm style attribute'unu düşürüyor — color:red izinli
    // olsa bile birlikte gidiyor. Bu, dokunmadığımız mevcut davranış.
    expect(sanitizeRichHtml('<p style="position:fixed;color:red">x</p>')).toBe('<p>x</p>')
  })

  it('yalnızca izinli özellikler içeren style değerini korur', () => {
    // color yalnızca hex/rgb() kabul eder ('red' gibi anahtar kelimeler değil)
    expect(sanitizeRichHtml('<p style="color:#ff0000">x</p>')).toBe('<p style="color:#ff0000">x</p>')
  })
})

describe('stripHtml', () => {
  it('tüm etiketleri söküp düz metin bırakır', () => {
    expect(stripHtml('<p>Merhaba <strong>dünya</strong></p>')).toBe('Merhaba dünya')
  })

  it('baştaki/sondaki boşlukları kırpar', () => {
    expect(stripHtml('  <p>metin</p>  ')).toBe('metin')
  })
})
