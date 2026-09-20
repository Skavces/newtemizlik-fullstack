'use client'

import { useState, type FormEvent, type InputEvent } from 'react'
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { API_URL } from '@/lib/apiClient'

// "+90 5XX XXX XX XX" formatına zorlar; +90'ı silmeye çalışırsa geri ekler.
function formatTurkishPhone(rawValue: string) {
  let value = rawValue.replace(/[^\d+]/g, '')
  if (value.startsWith('90')) value = '+' + value
  if (!value.startsWith('+90')) value = '+90' + value.replace(/^\+?0?/, '')
  const match = value.match(/^(\+90)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
  if (!match) return value
  return match[1] + ' ' + match[2] + (match[3] ? ' ' + match[3] : '') + (match[4] ? ' ' + match[4] : '') + (match[5] ? ' ' + match[5] : '')
}

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
  { icon: MapPin, label: 'Adres', value: 'Atatürk Mah. İzgin Sk. No:4 Soma/Manisa', color: '#7FBF3A' },
  { icon: Phone, label: 'Telefon', value: '+90 530 473 87 93', href: 'tel:+905304738793', event: 'phone_click', params: { location: 'contact_section' }, color: '#1F6EC7' },
  { icon: Mail, label: 'E-posta', value: 'info@newtemizlik.com.tr', href: 'mailto:info@newtemizlik.com.tr', color: '#7FBF3A' },
  { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt – Cmt: 09:00 – 18:00', color: '#1F6EC7' },
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot doluysa sessizce başarılıymış gibi davran (bot'a bilgi verme)
    if (data.get('website')) {
      setStatus('success')
      return
    }

    const payload = {
      adSoyad: data.get('adSoyad'),
      telefon: data.get('telefon'),
      ePosta: data.get('ePosta') || undefined,
      panelAdeti: Number(data.get('panelAdeti')),
      sahaMegavati: Number(data.get('sahaMegavati')),
      suUlasimi: data.get('suUlasimi') === 'Evet',
      kvkkConsent: data.get('kvkkConsent') === 'on',
    }

    setStatus('submitting')
    try {
      const res = await fetch(`${API_URL}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`quote -> ${res.status}`)
      trackEvent('generate_lead', { method: 'contact_form' })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="iletisim"
      className="scroll-mt-16 md:scroll-mt-20 py-20 md:py-28"
      style={{ background: 'var(--bg-body)' }}
    >

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="text-center mb-14">
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7FBF3A', display: 'block', marginBottom: '10px' }}>
            İletişim
          </span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
            Bize Ulaşın
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.7 }}>
            Projeleriniz ve detaylı bilgi için iletişim kanallarımızdan bize ulaşabilirsiniz.
          </p>
          <div style={{ width: '50px', height: '3px', background: '#7FBF3A', margin: '16px auto 0' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-7 mb-10">

          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="section-card p-6 flex items-center gap-4"
                style={{ flex: 1, borderBottom: `3px solid ${item.color}` }}
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

          {/* Form */}
          <div className="section-card p-5 sm:p-8">
            <h3 className="section-heading" style={{ fontSize: '26px', marginBottom: '24px' }}>
              Mesaj Gönderin
            </h3>

            {status === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', padding: '40px 10px' }}>
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#7FBF3A' }} />
                <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Talebiniz alındı, en kısa sürede size dönüş yapacağız.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Honeypot — gerçek kullanıcılar bu alanı görmez/doldurmaz */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Ad Soyad *
                    </label>
                    <input
                      type="text" name="adSoyad"
                      className="form-input w-full outline-none transition-all duration-200"
                      style={{ padding: '11px 14px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                      placeholder="Ad Soyad" maxLength={50} required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Telefon *
                    </label>
                    <input
                      type="tel" name="telefon"
                      className="form-input w-full outline-none transition-all duration-200"
                      style={{ padding: '11px 14px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                      placeholder="+90 5XX XXX XX XX" defaultValue="+90 " maxLength={17}
                      pattern="^(\+90|0)?\s*5[0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2}$"
                      onInput={(e: InputEvent<HTMLInputElement>) => { e.currentTarget.value = formatTurkishPhone(e.currentTarget.value) }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    E-posta
                  </label>
                  <input
                    type="email" name="ePosta"
                    className="form-input w-full outline-none transition-all duration-200"
                    style={{ padding: '11px 14px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                    placeholder="ornek@mail.com" maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Panel Adeti *
                    </label>
                    <input
                      type="number" name="panelAdeti" min="0" max="1000"
                      className="form-input w-full outline-none transition-all duration-200"
                      style={{ padding: '11px 14px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                      placeholder="Örn: 1000" required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Saha (MW) *
                    </label>
                    <input
                      type="number" name="sahaMegavati" min="0" max="1000" step="0.01"
                      className="form-input w-full outline-none transition-all duration-200"
                      style={{ padding: '11px 14px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px' }}
                      placeholder="Örn: 2.5" required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    Sahada Su Ulaşımı Var Mı? *
                  </label>
                  <div className="flex gap-6">
                    {['Evet', 'Hayır'].map((val) => (
                      <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="radio" name="suUlasimi" value={val} style={{ accentColor: '#7FBF3A', width: '16px', height: '16px' }} required={val === 'Evet'} />
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer" style={{ marginTop: '4px' }}>
                  <input type="checkbox" name="kvkkConsent" style={{ accentColor: '#7FBF3A', width: '16px', height: '16px', marginTop: '2px' }} required />
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    KVKK aydınlatma metnini okudum, kişisel verilerimin işlenmesini onaylıyorum. *
                  </span>
                </label>

                {status === 'error' && (
                  <p style={{ fontSize: '13px', color: '#e74c3c' }}>
                    Bir hata oluştu, lütfen tekrar deneyin veya bizi telefonla arayın.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="cta-button w-full flex items-center justify-center gap-2.5 mt-2 transition-all duration-200 cursor-pointer"
                  style={{ padding: '14px 28px', background: '#7FBF3A', color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', border: 'none', borderRadius: '9999px', boxShadow: '0 4px 20px rgba(127,191,58,0.3)', opacity: status === 'submitting' ? 0.7 : 1 }}
                >
                  {status === 'submitting' ? 'Gönderiliyor...' : 'Gönder'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
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
