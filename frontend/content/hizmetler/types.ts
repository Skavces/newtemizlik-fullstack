// Temizlik hizmet sayfalarının içerik tipi. Metinler statik ve versiyonlu; admin
// panelindeki SSS'lere bağlı değil. Kurallar content.test.ts'te denetlenir.

export interface TitledText {
  title: string
  text: string
}

export interface ServiceContent {
  slug: string
  // <title> (≤60) ve meta description (≤155)
  title: string
  description: string
  // PageHero başlığı. Eski sayfanın anahtar kelimesi burada ve title'da aynen geçer.
  h1: string
  // JSON-LD Service adı ve alternatif adları
  schemaName: string
  alternateNames: string[]
  eyebrow: string
  heading: string
  intro: string[]
  includesTitle: string
  includes: string[]
  includesNote: string
  processTitle: string
  process: TitledText[]
  notesTitle: string
  notes: TitledText[]
  // Firma iddiası taşımayan, hizmete özgü pratik bilgi.
  guideTitle: string
  guide: TitledText[]
  forWhomTitle: string
  forWhom: TitledText[]
  whyUsTitle: string
  whyUs: TitledText[]
  areaText: string
  faqs: { question: string; answer: string }[]
  // Yalnızca yayındaki hizmetlere bağlanır: aynı kategoriden 3, çapraz 1.
  related: { slug: string; desc: string }[]
  // Sahibin henüz onaylamadığı iddialar. Doluyken sayfa yayına çıkamaz (test kırılır).
  pendingClaims: string[]
}
