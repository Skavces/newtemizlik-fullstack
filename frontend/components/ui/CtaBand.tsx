import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CtaBandProps {
  title?: string
  href: string
  label: string
  background?: string
}

export default function CtaBand({ title, href, label, background }: CtaBandProps) {
  return (
    <section style={{ padding: '20px 0 60px', background }}>
      <div className="flex flex-col items-center gap-5">
        {title && (
          <h3 className="section-heading text-center" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}>
            {title}
          </h3>
        )}
        <Link
          href={href}
          className="cta-button"
          style={{ padding: '14px 36px', fontSize: '15px' }}
        >
          {label} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
