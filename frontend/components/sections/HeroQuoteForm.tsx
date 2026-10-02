'use client'

import { useState, type CSSProperties, type FormEvent, type InputEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
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

const labelStyle: CSSProperties = { display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }
const inputStyle: CSSProperties = { padding: '10px 13px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '16px' }

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function HeroQuoteForm() {
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
      panelAdeti: Number(data.get('panelAdeti')),
      suUlasimi: data.get('suUlasimi') === 'Evet',
      lokasyon: data.get('lokasyon'),
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
      trackEvent('generate_lead', { method: 'hero_form' })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="section-card p-5 sm:p-7" style={{ width: '100%' }}>
      <h3 className="section-heading" style={{ fontSize: '21px', marginBottom: '4px' }}>
        Ücretsiz Keşif Talep Et
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
        Formu doldurun, ekibimiz size en kısa sürede dönüş yapsın.
      </p>

      {status === 'success' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '28px 10px' }}>
          <CheckCircle2 style={{ width: '42px', height: '42px', color: 'var(--color-primary)' }} />
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
            Talebiniz alındı, en kısa sürede size dönüş yapacağız.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Honeypot — gerçek kullanıcılar bu alanı görmez/doldurmaz */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

          <div>
            <label style={labelStyle}>Ad Soyad *</label>
            <input
              type="text" name="adSoyad"
              className="form-input w-full outline-none transition-all duration-200"
              style={inputStyle}
              placeholder="Ad Soyad" maxLength={50} required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Telefon *</label>
              <input
                type="tel" name="telefon"
                className="form-input w-full outline-none transition-all duration-200"
                style={inputStyle}
                placeholder="+90 5XX XXX XX XX" defaultValue="+90 " maxLength={17}
                pattern="^(\+90|0)?\s*5[0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2}$"
                onInput={(e: InputEvent<HTMLInputElement>) => { e.currentTarget.value = formatTurkishPhone(e.currentTarget.value) }}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Panel Adeti *</label>
              <input
                type="number" name="panelAdeti" min="0" max="1000000"
                className="form-input w-full outline-none transition-all duration-200"
                style={inputStyle}
                placeholder="Örn: 1000" required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Lokasyon (İl / İlçe) *</label>
            <input
              type="text" name="lokasyon"
              className="form-input w-full outline-none transition-all duration-200"
              style={inputStyle}
              placeholder="Örn: Soma, Manisa" maxLength={160} required
            />
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: '8px' }}>Sahada Su Ulaşımı Var Mı? *</label>
            <div className="flex gap-6">
              {['Evet', 'Hayır'].map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="suUlasimi" value={val} style={{ accentColor: 'var(--color-primary)', width: '15px', height: '15px' }} required={val === 'Evet'} />
                  <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{val}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer" style={{ marginTop: '2px' }}>
            <input type="checkbox" name="kvkkConsent" style={{ accentColor: 'var(--color-primary)', width: '15px', height: '15px', marginTop: '2px' }} required />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <a
                href="/kvkk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-brand"
                style={{ textDecoration: 'underline', color: 'inherit' }}
                onClick={(e) => e.stopPropagation()}
              >
                KVKK aydınlatma metnini
              </a>{' '}
              okudum, kişisel verilerimin işlenmesini onaylıyorum. *
            </span>
          </label>

          {status === 'error' && (
            <p style={{ fontSize: '12.5px', color: '#e74c3c' }}>
              Bir hata oluştu, lütfen tekrar deneyin veya bizi telefonla arayın.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="cta-button w-full justify-center mt-1 cursor-pointer"
            style={{ border: 'none', opacity: status === 'submitting' ? 0.7 : 1 }}
          >
            {status === 'submitting' ? 'Gönderiliyor...' : 'Ücretsiz Keşif Talep Et'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  )
}
