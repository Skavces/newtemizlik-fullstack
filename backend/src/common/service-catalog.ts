// Backend'in bildiği hizmet kataloğu: teklif formu doğrulaması (hizmet slug'ı +
// kategoriye göre koşullu alanlar) ve chatbot prompt kapsama testi buradan okur.
//
// Kaynak frontend/lib/services.ts — iki paket birbirini import edemediği için
// liste burada da tutulur; frontend/lib/services.test.ts slug, kategori ve adın
// birebir aynı olduğunu doğrular (biri değişip diğeri unutulursa CI kırılır).
// Yayında olmayan hizmetler de buradadır: form zaten yalnızca yayındakileri
// gösterir, backend'in tümünü tanıması zararsızdır.

export type ServiceCategory = 'ges' | 'temizlik'

export interface ServiceCatalogEntry {
  slug: string
  category: ServiceCategory
  name: string
}

export const SERVICE_CATALOG: readonly ServiceCatalogEntry[] = [
  { slug: 'panel-temizlik', category: 'ges', name: 'Panel Temizlik Hizmeti' },
  { slug: 'panel-bakim', category: 'ges', name: 'Panel Bakım & Onarım İzleme' },
  { slug: 'robot-satisi', category: 'ges', name: 'Temizlik Robot & Makina Satışı' },
  { slug: 'ot-temizligi', category: 'ges', name: 'Ot Temizliği' },
  { slug: 'ev-temizligi', category: 'temizlik', name: 'Ev Temizliği' },
  { slug: 'villa-temizligi', category: 'temizlik', name: 'Villa Temizliği' },
  { slug: 'koltuk-yikama', category: 'temizlik', name: 'Yerinde Koltuk Yıkama' },
  { slug: 'apartman-site-temizligi', category: 'temizlik', name: 'Apartman ve Site Temizliği' },
  { slug: 'insaat-sonrasi-temizlik', category: 'temizlik', name: 'İnşaat Sonrası Temizlik' },
  { slug: 'ofis-is-yeri-temizligi', category: 'temizlik', name: 'Ofis ve İş Yeri Temizliği' },
  { slug: 'magaza-temizligi', category: 'temizlik', name: 'Mağaza Temizliği' },
  { slug: 'banka-temizligi', category: 'temizlik', name: 'Banka Temizliği' },
  { slug: 'avm-temizligi', category: 'temizlik', name: 'AVM Temizliği' },
  { slug: 'fabrika-temizligi', category: 'temizlik', name: 'Fabrika Temizliği' },
  { slug: 'okul-temizligi', category: 'temizlik', name: 'Okul Temizliği' },
  { slug: 'saglik-kurulusu-temizligi', category: 'temizlik', name: 'Sağlık Kuruluşu Temizliği' },
  { slug: 'dis-cephe-cam-temizligi', category: 'temizlik', name: 'Dış Cephe Cam Temizliği' },
]

export const SERVICE_SLUGS: string[] = SERVICE_CATALOG.map(s => s.slug)

export function serviceCategoryOf(slug: string | null | undefined): ServiceCategory | undefined {
  return SERVICE_CATALOG.find(s => s.slug === slug)?.category
}

export function slugsInCategory(category: ServiceCategory): string[] {
  return SERVICE_CATALOG.filter(s => s.category === category).map(s => s.slug)
}
