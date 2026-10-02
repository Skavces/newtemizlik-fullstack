'use client'

import { MapPin, Phone, Mail, Clock, type LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import SectionHeader from '@/components/ui/SectionHeader'

interface ContactInfoItem {
  icon: LucideIcon
  label: string
  value: string
  color: string
  href?: string
  event?: string
  params?: Record<string, unknown>
}

const contactInfo: ContactInfoItem[] = [
  { icon: MapPin, label: 'Adres', value: 'Atatürk Mah. İzgin Sk. No:4 Soma/Manisa', color: 'var(--color-primary)' },
  { icon: Phone, label: 'Telefon', value: '+90 530 473 87 93', href: 'tel:+905304738793', event: 'phone_click', params: { location: 'contact_section' }, color: 'var(--color-secondary)' },
  { icon: Mail, label: 'E-posta', value: 'info@newtemizlik.com.tr', href: 'mailto:info@newtemizlik.com.tr', color: 'var(--color-primary)' },
  { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt – Cmt: 09:00 – 18:00', color: 'var(--color-secondary)' },
]

export default function Contact() {
  return (
    <section
      id="iletisim"
      className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28"
      style={{ background: 'var(--bg-body)' }}
    >

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-14">
          <SectionHeader
            eyebrow="İletişim"
            title="Bize Ulaşın"
            lead="Projeleriniz ve detaylı bilgi için iletişim kanallarımızdan bize ulaşabilirsiniz."
          />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {contactInfo.map((item, i) => (
            <div
              key={i}
              className="section-card p-6 flex items-center gap-4"
              style={{ borderBottom: `3px solid ${item.color}` }}
              >
              <div
                className="shrink-0 w-11 h-11 flex items-center justify-center"
                style={{ borderRadius: '10px', background: `${item.color}15` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '4px' }}>
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => item.event && trackEvent(item.event, item.params)}
                    className="hover-brand"
                    style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', lineHeight: 1.4 }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div
          className="overflow-hidden h-56 sm:h-72 md:h-96"
          style={{ borderRadius: '10px', boxShadow: 'var(--shadow-md)' }}
        >
          <iframe
            title="Soma, Manisa Harita"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5!2d27.6033488!3d39.1871673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b761223baac18d%3A0xec7d0d10a31330b9!2zQXRhdMO8cmssIMSwemdpbiBTay4gTm86NCwgNDU1MTAgU29tYS9NYW5pc2E!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
            width="100%" height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  )
}
