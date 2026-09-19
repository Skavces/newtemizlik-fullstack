'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { Faq } from '@/types/api'

// faqs artık backend'den geliyor (GET /api/faq?scope=...) — sayfa (server
// component) veriyi çekip prop olarak geçer, bu bileşen sadece accordion state'ini yönetir.
export default function SSS({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="sss"
      className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28"
      style={{ background: 'var(--bg-alt)' }}
    >

      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-14">
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
            S.S.S
          </span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
            Sıkça Sorulan Sorular
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.7 }}>
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
          </p>
          <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.id ?? index}
                className="section-card overflow-hidden"
                style={{ borderBottom: isOpen ? '4px solid #7FBF3A' : '4px solid transparent', cursor: 'pointer' }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between p-4 sm:p-6 select-none">
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '20px', lineHeight: 1.45, fontFamily: "'Poppins', sans-serif" }}>
                    {faq.question}
                  </h3>
                  <div
                    className="shrink-0 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                    style={{
                      borderRadius: '50%',
                      background: isOpen ? '#7FBF3A' : 'rgba(127,191,58,0.1)',
                      color: isOpen ? '#fff' : '#7FBF3A',
                    }}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? '600px' : '0' }}
                >
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', padding: '16px 16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
