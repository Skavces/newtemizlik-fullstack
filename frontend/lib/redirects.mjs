// Eski newtemizlik.com.tr (PHP) adreslerinden yeni sayfalara 301 haritası.
// next.config.mjs bunu import eder; redirects.test.ts aynı veriyi Next'in kendi
// path-to-regexp'iyle sınar ve lib/__fixtures__/legacy-urls.json'daki her eski
// adresin beklenen hedefe tek atlamada gittiğini doğrular.
//
// Kurallar:
// - Hepsi statusCode 301. `permanent: true` 308 döndürür, kullanma.
// - Hedef her zaman son adres olmalı (zincir yok); hedefi değişen sayfada bu
//   dosyayı güncelle, eski kuralı silme.
// - Next ilk eşleşen kuralı uygular: özel kurallar genel yedeklerden önce gelir.
// - Next istekteki query'yi hedefe taşır. `/?language=tr` gibi adresler bu yüzden
//   yönlendirilmiyor; ana sayfanın canonical'ı onları `/`'e toplar.

/**
 * Eski /hizmet/<id>/<slug> → yeni /hizmetlerimiz/<slug>.
 * lib/services.ts'teki legacyIds ile aynı olmalı (redirects.test.ts denetler).
 * 20 sitemap'te yoktu ama Search Console'da dizinli ve tıklama alıyor (2026-11-10).
 */
export const LEGACY_SERVICE_IDS = {
  5: 'ev-temizligi',
  6: 'ofis-is-yeri-temizligi',
  7: 'apartman-site-temizligi',
  8: 'villa-temizligi',
  9: 'koltuk-yikama',
  11: 'insaat-sonrasi-temizlik',
  12: 'fabrika-temizligi',
  13: 'banka-temizligi',
  14: 'okul-temizligi',
  15: 'avm-temizligi',
  16: 'magaza-temizligi',
  17: 'dis-cephe-cam-temizligi',
  19: 'saglik-kurulusu-temizligi',
  20: 'panel-temizlik',
  21: 'panel-temizlik',
}

/** Eski /blog/<id>/<slug> → yeni /blog/<slug>. Taşınan yazılar eski slug'ı korur. */
export const LEGACY_BLOG_IDS = {
  11: '/blog/somada-ev-temizligi-profesyonel-hizmetin-farki',
  12: '/blog/soma-is-yeri-temizliginde-profesyonellik-neden-onemli',
  // 13 eski sitede de 404'tü (slug'daki ’ yüzünden) ve dizinde değil.
  13: '/blog',
}

/** Taşınan blog yazılarının slug'ları; backend migration'ı bunları ekler. */
export const MIGRATED_BLOG_SLUGS = Object.values(LEGACY_BLOG_IDS)
  .filter((p) => p !== '/blog')
  .map((p) => p.replace('/blog/', ''))

/** [kaynak, hedef] — sıra önemli, genel yedekler en sonda. */
export const STATIC_REDIRECTS = [
  ['/index.html', '/'],
  ['/index.php', '/'],
  ['/hizmetler', '/hizmetlerimiz'],
  ['/hizmetler/:page(\\d+)', '/hizmetlerimiz'],
  ['/bloglar', '/blog'],
  ['/bloglar/:page(\\d+)', '/blog'],
  ['/rss.xml', '/blog'],
  ['/galeri/5/:rest*', '/hizmetlerimiz/panel-temizlik'],
  ['/galeri/6/:rest*', '/hizmetlerimiz/dis-cephe-cam-temizligi'],
  ['/galeri/:rest*', '/referanslarimiz'],
  ['/foto-galeri/:rest*', '/referanslarimiz'],
  ['/video-galeri/:rest*', '/referanslarimiz'],
  ['/projeler', '/referanslarimiz'],
  ['/markalar', '/referanslarimiz'],
  ['/hesap-numaralarimiz', '/iletisim'],
  ['/teklif-formu', '/iletisim'],
  ['/insan-kaynaklari', '/iletisim'],
  ['/ekibimiz', '/kurumsal'],
  ['/e-katalog', '/hizmetlerimiz'],
  ['/sayfa/gizlilik-sozlesmesi', '/kvkk'],
  ['/sayfa/:rest*', '/'],
  ['/urunara', '/'],
  // Yeni sitede /kurumsal'ın alt sayfası yok; hakkimizda ve eski göreli link
  // artıkları (/kurumsal/sss vb.) buraya toplanır. Alt sayfa eklenirse daralt.
  ['/kurumsal/:rest+', '/kurumsal'],
]

export function legacyRedirects() {
  const rules = []
  for (const [id, slug] of Object.entries(LEGACY_SERVICE_IDS)) {
    rules.push([`/hizmet/${id}/:rest*`, `/hizmetlerimiz/${slug}`])
  }
  rules.push(['/hizmet/:rest*', '/hizmetlerimiz'])
  for (const [id, dest] of Object.entries(LEGACY_BLOG_IDS)) {
    rules.push([`/blog/${id}/:rest*`, dest])
  }
  // Sayısal eski blog ID'leri; yeni slug'lar hiçbir zaman yalnız rakam değil.
  rules.push(['/blog/:id(\\d+)/:rest*', '/blog'])
  rules.push(...STATIC_REDIRECTS)
  return rules.map(([source, destination]) => ({ source, destination, statusCode: 301 }))
}
