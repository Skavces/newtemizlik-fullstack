import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// /nt-panel BİLEREK burada listelenmiyor: robots.txt kimlik doğrulaması
// olmadan herkese açık ve genellikle bir saldırganın kontrol ettiği ilk
// dosyadır — gerçek panelin yolunu /admin tuzağının hemen yanına yazmak
// "tuzağa düşme, gerçek panel şurada" tabelası asmakla aynı şey olurdu.
// /nt-panel indekslenmemesi zaten sayfa metadata'sıyla sağlanıyor (bkz.
// app/nt-panel/layout.tsx'teki robots: {index:false}) — robots.txt'e hiç
// ihtiyaç yok. /admin ise tuzak sayfa: burada disallow edilmesi tuzağın
// parçası (kurallara uyan botları uzaklaştırır, uymayan/kötü niyetli
// tarayıcıları ise tam olarak izlenen tuzağa çeker).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
