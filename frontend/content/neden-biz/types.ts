// Ana sayfadaki WhyUs "Temizlik" sekmesinin kartlarına bağlanan /neden-biz/<slug>
// detay sayfalarının içerik tipi. Metinler statik ve versiyonlu; kurallar
// content.test.ts'te denetlenir. Yalnızca onaylı iddialar yazılır (bkz. testteki yasaklı ifadeler).

export interface NedenBizContent {
  /** URL parçası: /neden-biz/<slug>. GES sayfalarının statik klasörleriyle çakışmaz. */
  slug: string
  /** phone_click olayında `location: neden_biz_<trackKey>`. GES anahtarlarıyla çakışmaz. */
  trackKey: string
  /** <title>, markalı hâliyle ("... | New Temizlik") en çok 60 karakter. */
  title: string
  /** Meta description, en çok 155 karakter. */
  description: string
  /** PageHero başlığı (h1). */
  h1: string
  /** Breadcrumb ve JSON-LD BreadcrumbList son öğe etiketi: kısa, WhyUs kart başlığı (≤22 karakter). */
  crumb: string
  /** 1. bölüm SectionHeader başlığı. */
  heading: string
  /** 1. bölümdeki iki paragraf. */
  paragraphs: [string, string]
  /** Vurgu kutusu. */
  callout: { title: string; text: string }
  /** 4-6 madde. */
  bullets: string[]
  /** Hizmet kartları bölümünün başlığı. */
  servicesTitle: string
  /** Hizmet kartları bölümünün kısa girişi. */
  servicesLead?: string
  /** 3-4 yayındaki temizlik hizmetinin slug'ı (lib/services.ts). */
  services: string[]
  /**
   * 1. bölüm görseli ve OG görseli (public/ altındaki yol). Verilmezse ilk hizmetin görseli kullanılır;
   * ama o zaman aşağıdaki hizmet kartlarıyla aynı görsel tekrarlanır. width/height verilmezse 1200x750.
   */
  image?: { src: string; alt: string; width?: number; height?: number }
  /** Tam 4 soru. */
  faqs: { question: string; answer: string }[]
  /** Sayfa sonu CtaBand başlığı. */
  cta: { title: string }
}
