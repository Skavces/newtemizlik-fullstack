'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { Faq } from '@/types/api'

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={faq.id ?? index}
            className="section-card overflow-hidden"
            style={{ borderBottomColor: isOpen ? 'var(--color-primary)' : 'transparent', cursor: 'pointer' }}
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
                  background: isOpen ? 'var(--color-primary)' : 'rgba(127,191,58,0.1)',
                  color: isOpen ? '#fff' : 'var(--color-primary)',
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
  )
}
