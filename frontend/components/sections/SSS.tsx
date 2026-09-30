import type { Faq } from '@/types/api'
import SectionHeader from '@/components/ui/SectionHeader'
import FaqAccordion from '@/components/ui/FaqAccordion'

// faqs artık backend'den geliyor (GET /api/faq?scope=...) — sayfa (server
// component) veriyi çekip prop olarak geçer, accordion state'i FaqAccordion'da.
export default function SSS({ faqs }: { faqs: Faq[] }) {
  return (
    <section
      id="sss"
      className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28"
      style={{ background: 'var(--bg-alt)' }}
    >

      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">

        <div className="text-center mb-14">
          <SectionHeader
            eyebrow="S.S.S"
            title="Sıkça Sorulan Sorular"
            lead="Aklınıza takılan soruların cevaplarını burada bulabilirsiniz."
          />
        </div>

        <FaqAccordion faqs={faqs} />

      </div>
    </section>
  )
}
