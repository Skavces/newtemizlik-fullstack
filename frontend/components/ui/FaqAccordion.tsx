'use client'

import { useId, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { Faq } from '@/types/api'

// Backend'den gelen Faq[] ya da sayfaya gömülü statik {question, answer} dizisi.
export type FaqAccordionItem = Pick<Faq, 'question' | 'answer'> & { id?: string }

export default function FaqAccordion({ faqs }: { faqs: FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-${index}`
        return (
          <div
            key={faq.id ?? index}
            className="section-card overflow-hidden"
            style={{ borderBottomColor: isOpen ? 'var(--color-primary)' : 'transparent' }}
          >
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-4 sm:p-6 select-none text-left cursor-pointer"
              >
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '20px', lineHeight: 1.45, fontFamily: "'Poppins', sans-serif" }}>
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                  style={{
                    borderRadius: '50%',
                    background: isOpen ? 'var(--color-primary)' : 'rgba(127,191,58,0.1)',
                    color: isOpen ? '#fff' : 'var(--color-primary)',
                  }}
                >
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>
            </h3>

            {/* Kapalıyken de DOM'da: yanıtlar arama motoruna görünür kalsın, ekran okuyucu okumasın. */}
            <div
              id={panelId}
              aria-hidden={!isOpen}
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
