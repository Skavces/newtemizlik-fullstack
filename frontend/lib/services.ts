// Sitedeki TÜM hizmetlerin tek kaynağı. Navbar, Footer, ana sayfa Services
// bölümü, /hizmetlerimiz, kurumsal, sitemap, Organization JSON-LD ve
// (P7'den itibaren) hizmetlerimiz/[slug] şablonu buradan beslenir.
//
// Yeni hizmet eklerken ŞUNLAR DA güncellenmeli (testler hatırlatır):
// - backend/src/common/service-slugs.json  → teklif formu doğrulaması (parity testi)
// - backend/src/chat/chat-prompts.ts       → chatbot kataloğu (prompt kapsama testi)
// - lib/redirects.mjs                       → legacyIds varsa eski URL yönlendirmesi

export type ServiceCategory = 'ges' | 'temizlik'

export interface ServiceEntry {
  // URL: /hizmetlerimiz/<slug>. ≤30 karakter (backend varchar sınırları).
  slug: string
  category: ServiceCategory
  // Kanonik görünen ad = sayfanın H1'i; kartlar ve menü bunu kullanır.
  name: string
  // Dar alanlar (footer) için kısa ad; yoksa name kullanılır.
  shortName?: string
  // JSON-LD'de kullanılan, bağlamdan bağımsız açıklayıcı ad (ör. "GES Panel Temizliği").
  schemaName?: string
  // Kart açıklaması, 1-2 cümle.
  summary: string
  // public/ altındaki görsel yolu ('/' ile başlar).
  image: string
  imageAlt: string
  // Eski .com.tr sitesindeki /hizmet/<id> numaraları — 301 haritası buradan üretilir.
  legacyIds?: number[]
  // Ana sayfa ve footer'da öne çıkanlar.
  featured?: boolean
  // false iken hiçbir listede/sitemap'te görünmez ve sayfası üretilmez.
  published: boolean
  // true: app/(site)/hizmetlerimiz/<slug>/page.tsx elle yazılmış özel sayfa;
  // false: hizmetlerimiz/[slug] şablonundan üretilir.
  customPage: boolean
}

export const SERVICE_CATEGORIES: Record<ServiceCategory, { label: string; anchor: string }> = {
  ges: { label: 'GES Hizmetleri', anchor: 'ges' },
  temizlik: { label: 'Temizlik Hizmetleri', anchor: 'temizlik' },
}

export const SERVICES: readonly ServiceEntry[] = [
  // ── GES ──────────────────────────────────────────────────────────────
  {
    slug: 'panel-temizlik',
    category: 'ges',
    name: 'Panel Temizlik Hizmeti',
    shortName: 'Panel Temizlik',
    schemaName: 'GES Panel Temizliği',
    summary:
      'Özel ekipmanlar ve uygun temizlik yöntemleri kullanarak güneş panellerinin yüzey temizliğini gerçekleştiriyoruz. Düzenli temizlik, panel veriminin korunmasına ve üretim kayıplarının azaltılmasına yardımcı olur.',
    image: '/endustriyel-gunes-paneli-yikama.webp',
    imageAlt: 'GES sahasında profesyonel güneş paneli temizlik çalışması',
    legacyIds: [21],
    featured: true,
    published: true,
    customPage: true,
  },
  {
    slug: 'panel-bakim',
    category: 'ges',
    name: 'Panel Bakım & Onarım İzleme',
    shortName: 'Bakım & Onarım',
    schemaName: 'GES Panel Bakımı',
    summary:
      'Santral üretim verilerini inceleyerek performans düşüşlerini tespit ediyoruz. Planlı bakım ve kontroller ile sistemin düzenli ve verimli çalışmasına destek oluyoruz.',
    image: '/soma-gunes-enerjisi-santrali-uzman-bakim.webp',
    imageAlt: 'Güneş enerjisi santralinde bakım ve performans kontrol çalışması',
    featured: true,
    published: true,
    customPage: true,
  },
  {
    slug: 'robot-satisi',
    category: 'ges',
    name: 'Temizlik Robot & Makina Satışı',
    shortName: 'Robot & Makina Satışı',
    schemaName: 'Otonom Temizlik Robotu Satışı',
    summary:
      'Büyük ölçekli güneş enerji santralleri için panel temizlik robotları sunuyoruz. Otomatik temizlik sistemleri ile bakım süreçleri hızlanır ve iş gücü ihtiyacı azalır.',
    image: '/soma-ges-otonom-temizlik-robotu.webp',
    imageAlt: 'GES sahasında kullanılan panel temizlik robotu',
    featured: true,
    published: true,
    customPage: true,
  },
  {
    slug: 'ot-temizligi',
    category: 'ges',
    name: 'Ot Temizliği',
    schemaName: 'GES Sahası Ot Temizliği',
    summary:
      'GES sahalarında panel altı ve aralarında oluşan ot ve bitki örtüsünü düzenli olarak temizliyoruz. Gölgelenmeyi, yangın riskini ve haşere üremesini önleyerek saha güvenliğini koruyoruz.',
    image: '/gesottemizligi.webp',
    imageAlt: 'GES sahasında ot temizliği çalışması',
    featured: true,
    published: true,
    customPage: true,
  },

  // ── Temizlik (P7'de gruplar halinde yayına alınır) ────────────────────
  // G1 — bireysel
  { slug: 'ev-temizligi', category: 'temizlik', name: 'Ev Temizliği', summary: "Soma'da odalar, mutfak, banyo, cam ve balkon temizliği. Kapsamı evinize ve önceliklerinize göre birlikte belirliyoruz.", image: '/hizmetler/ev-temizligi.webp', imageAlt: "Soma'da bir evde temizlik yapan ekip", legacyIds: [5], featured: true, published: true, customPage: false },
  { slug: 'villa-temizligi', category: 'temizlik', name: 'Villa Temizliği', summary: 'Çok katlı ve geniş evlerde merdiven, geniş cam ve farklı zemin türlerini kat kat plan yaparak temizliyoruz.', image: '/hizmetler/villa-temizligi.webp', imageAlt: "Soma'da çok katlı bir villada temizlik çalışması", legacyIds: [8], published: true, customPage: false },
  { slug: 'koltuk-yikama', category: 'temizlik', name: 'Yerinde Koltuk Yıkama', shortName: 'Koltuk Yıkama', summary: 'Koltuk takımınızı taşımadan, bulunduğu yerde kumaşına uygun yöntemle yıkıyoruz.', image: '/hizmetler/koltuk-yikama.webp', imageAlt: 'Evde yerinde koltuk yıkama çalışması', legacyIds: [9], featured: true, published: true, customPage: false },
  { slug: 'apartman-site-temizligi', category: 'temizlik', name: 'Apartman ve Site Temizliği', summary: 'Merdiven, asansör, giriş ve ortak alanların temizliğini yönetimle belirlenen programa bağlıyoruz.', image: '/hizmetler/apartman-site-temizligi.webp', imageAlt: 'Apartman merdiveni ve ortak alan temizliği', legacyIds: [7], featured: true, published: true, customPage: false },
  { slug: 'insaat-sonrasi-temizlik', category: 'temizlik', name: 'İnşaat Sonrası Temizlik', summary: 'İnşaat ve tadilat sonrası ince toz, boya ve harç kalıntılarını temizleyip mekânı kullanıma hazırlıyoruz.', image: '/hizmetler/insaat-sonrasi-temizlik.webp', imageAlt: 'İnşaat sonrası boya ve toz temizliği yapılan yeni daire', legacyIds: [11], featured: true, published: true, customPage: false },
  // G2 — iş yeri ve ticari
  { slug: 'ofis-is-yeri-temizligi', category: 'temizlik', name: 'Ofis ve İş Yeri Temizliği', shortName: 'Ofis & İş Yeri Temizliği', summary: 'Masa, zemin, tuvalet ve çay ocağı temizliğini mesainizi bölmeyen bir programa bağlıyoruz.', image: '/hizmetler/ofis-is-yeri-temizligi.webp', imageAlt: 'Ofiste masa ve zemin temizliği yapan ekip', legacyIds: [6], featured: true, published: true, customPage: false },
  { slug: 'magaza-temizligi', category: 'temizlik', name: 'Mağaza Temizliği', summary: 'Vitrin, giriş, satış alanı, kabin ve kasa çevresini açılış saatinize göre temizliyoruz.', image: '/hizmetler/magaza-temizligi.webp', imageAlt: 'Mağaza vitrini ve satış alanı temizliği', legacyIds: [16], published: true, customPage: false },
  { slug: 'banka-temizligi', category: 'temizlik', name: 'Banka Temizliği', summary: 'Gişe önü, bekleme alanı ve ofisleri şubenin güvenlik kurallarına uyarak temizliyoruz.', image: '/hizmetler/banka-temizligi.webp', imageAlt: 'Banka şubesi bekleme alanında temizlik çalışması', legacyIds: [13], published: true, customPage: false },
  { slug: 'avm-temizligi', category: 'temizlik', name: 'AVM Temizliği', summary: 'Koridor, tuvalet, yemek katı ve otopark temizliğini vardiyalı bir planla yürütüyoruz.', image: '/hizmetler/avm-temizligi.webp', imageAlt: 'Alışveriş merkezi koridorunda zemin temizliği', legacyIds: [15], published: true, customPage: false },
  // G3 — kurum ve sanayi
  { slug: 'fabrika-temizligi', category: 'temizlik', name: 'Fabrika Temizliği', summary: '', image: '', imageAlt: '', legacyIds: [12], featured: true, published: false, customPage: false },
  { slug: 'okul-temizligi', category: 'temizlik', name: 'Okul Temizliği', summary: '', image: '', imageAlt: '', legacyIds: [14], published: false, customPage: false },
  { slug: 'saglik-kurulusu-temizligi', category: 'temizlik', name: 'Sağlık Kuruluşu Temizliği', shortName: 'Sağlık Kuruluşu Temizliği', summary: '', image: '', imageAlt: '', legacyIds: [19], published: false, customPage: false },
  { slug: 'dis-cephe-cam-temizligi', category: 'temizlik', name: 'Dış Cephe Cam Temizliği', summary: '', image: '', imageAlt: '', legacyIds: [17], published: false, customPage: false },
]

export const PUBLISHED_SERVICES: readonly ServiceEntry[] = SERVICES.filter((s) => s.published)

export function servicePath(service: Pick<ServiceEntry, 'slug'>): string {
  return `/hizmetlerimiz/${service.slug}`
}

export function getServicesByCategory(category: ServiceCategory): ServiceEntry[] {
  return PUBLISHED_SERVICES.filter((s) => s.category === category)
}

export function getFeaturedServices(category: ServiceCategory): ServiceEntry[] {
  return getServicesByCategory(category).filter((s) => s.featured)
}

// Yalnızca yayındaki hizmetleri döndürür — yayında olmayan slug'ın sayfası yok.
export function getService(slug: string): ServiceEntry | undefined {
  return PUBLISHED_SERVICES.find((s) => s.slug === slug)
}

// Yayında olup olmamasından bağımsız kayıt (admin paneli eski/gizli hizmet
// slug'larını da adlandırabilsin diye).
export function findServiceAnyState(slug: string | null | undefined): ServiceEntry | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

// hizmetlerimiz/[slug] şablonunun üreteceği sayfalar.
export function getTemplateServices(): ServiceEntry[] {
  return PUBLISHED_SERVICES.filter((s) => !s.customPage)
}
