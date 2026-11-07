'use client'

import { useId, useState, type CSSProperties, type FormEvent, type InputEvent } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { API_URL } from '@/lib/apiClient'
import { formatPhoneWithCaret } from '@/lib/phone'
import { getService, getServicesByCategory, SERVICE_CATEGORIES, type ServiceCategory } from '@/lib/services'

const labelStyle: CSSProperties = { display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.04em' }
const inputStyle: CSSProperties = { padding: '10px 13px', background: 'var(--bg-body)', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '16px' }

type Status = 'idle' | 'submitting' | 'success' | 'error'

// Formda seçilebilecek hizmetler: yalnızca yayındakiler, kategoriye göre gruplu.
// Boş kategori optgroup olarak hiç basılmaz.
const SERVICE_GROUPS = (Object.keys(SERVICE_CATEGORIES) as ServiceCategory[])
  .map((category) => ({ category, label: SERVICE_CATEGORIES[category].label, services: getServicesByCategory(category) }))
  .filter((g) => g.services.length > 0)

interface HeroQuoteFormProps {
  // Hizmet sayfalarında form o hizmet seçili açılır (kullanıcı değiştirebilir)
  defaultService?: string
}

export default function HeroQuoteForm({ defaultService }: HeroQuoteFormProps = {}) {
  const [status, setStatus] = useState<Status>('idle')
  const [serviceSlug, setServiceSlug] = useState<string>(getService(defaultService ?? '') ? defaultService! : '')
  const id = useId()
  const fieldId = (name: string) => `${id}-${name}`

  const category = getService(serviceSlug)?.category
  const asksWater = serviceSlug === 'panel-temizlik'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot doluysa sessizce başarılıymış gibi davran (bot'a bilgi verme)
    if (data.get('website')) {
      setStatus('success')
      return
    }

    // Yalnızca seçilen hizmetin kategorisine ait alanlar gönderilir; backend de
    // aynı kuralı uygular (bkz. backend CreateQuoteRequestDto).
    const metrekare = String(data.get('metrekare') ?? '').trim()
    const payload = {
      hizmet: serviceSlug,
      adSoyad: data.get('adSoyad'),
      telefon: data.get('telefon'),
      lokasyon: data.get('lokasyon'),
      kvkkConsent: data.get('kvkkConsent') === 'on',
      ...(category === 'ges' ? { panelAdeti: Number(data.get('panelAdeti')) } : {}),
      ...(asksWater ? { suUlasimi: data.get('suUlasimi') === 'Evet' } : {}),
      ...(category === 'temizlik' && metrekare ? { metrekare: Number(metrekare) } : {}),
    }

    setStatus('submitting')
    try {
      const res = await fetch(`${API_URL}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`quote -> ${res.status}`)
      trackEvent('generate_lead', { method: 'hero_form', service: serviceSlug, category })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative">
      {/* Karttan ayrık, mavi→yeşil marka degrade çerçeve — background+mask tekniği,
          border-image'in border-radius'u yok sayması sorununu aşar */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset: '-14px',
          borderRadius: '38px',
          padding: '2px',
          background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative p-5 sm:p-7" style={{ width: '100%', background: 'var(--bg-card)', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
        {/* h2: sayfanın h1'inden sonra gelen ilk başlık seviyesi (h3 başlık sırasını atlatıyordu) */}
        <h2 className="section-heading" style={{ fontSize: '21px', marginBottom: '4px' }}>
          Ücretsiz Keşif Talep Et
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
          Formu doldurun, ekibimiz size en kısa sürede dönüş yapsın.
        </p>

        {status === 'success' ? (
          <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '28px 10px' }}>
            <CheckCircle2 aria-hidden="true" style={{ width: '42px', height: '42px', color: 'var(--color-primary)' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
              Talebiniz alındı, en kısa sürede size dönüş yapacağız.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Honeypot — gerçek kullanıcılar bu alanı görmez/doldurmaz; yardımcı
                teknolojilerden de tamamen gizli (etiketsiz input denetimine takılmaz) */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor={fieldId('website')}>Web sitesi</label>
              <input id={fieldId('website')} type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor={fieldId('hizmet')} style={labelStyle}>Hizmet *</label>
              <div className="relative">
                <select
                  id={fieldId('hizmet')}
                  name="hizmet"
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                  className="form-input w-full outline-none transition-all duration-200 appearance-none cursor-pointer"
                  style={{ ...inputStyle, paddingRight: '36px', color: serviceSlug ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  required
                >
                  <option value="" disabled>Hizmet seçin</option>
                  {SERVICE_GROUPS.length === 1
                    ? SERVICE_GROUPS[0].services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)
                    : SERVICE_GROUPS.map((g) => (
                        <optgroup key={g.category} label={g.label}>
                          {g.services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                        </optgroup>
                      ))}
                </select>
                <ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label htmlFor={fieldId('adSoyad')} style={labelStyle}>Ad Soyad *</label>
              <input
                id={fieldId('adSoyad')} type="text" name="adSoyad" autoComplete="name"
                className="form-input w-full outline-none transition-all duration-200"
                style={inputStyle}
                placeholder="Ad Soyad" maxLength={50} required
              />
            </div>

            <div className={`grid grid-cols-1 gap-3 ${category ? 'sm:grid-cols-2' : ''}`}>
              <div>
                <label htmlFor={fieldId('telefon')} style={labelStyle}>Telefon *</label>
                <input
                  id={fieldId('telefon')} type="tel" name="telefon" autoComplete="tel"
                  className="form-input w-full outline-none transition-all duration-200"
                  style={inputStyle}
                  placeholder="+90 5XX XXX XX XX" defaultValue="+90 " maxLength={17}
                  pattern="^(\+90|0)?\s*5[0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2}$"
                  onInput={(e: InputEvent<HTMLInputElement>) => {
                    const input = e.currentTarget
                    const { value, caret } = formatPhoneWithCaret(input.value, input.selectionStart ?? input.value.length)
                    input.value = value
                    input.setSelectionRange(caret, caret)
                  }}
                  required
                />
              </div>

              {category === 'ges' && (
                <div>
                  <label htmlFor={fieldId('panelAdeti')} style={labelStyle}>Panel Adeti *</label>
                  <input
                    id={fieldId('panelAdeti')} type="number" name="panelAdeti" min="0" max="1000000" inputMode="numeric"
                    className="form-input w-full outline-none transition-all duration-200"
                    style={inputStyle}
                    placeholder="Örn: 1000" required
                  />
                </div>
              )}

              {category === 'temizlik' && (
                <div>
                  <label htmlFor={fieldId('metrekare')} style={labelStyle}>Yaklaşık Alan (m²)</label>
                  <input
                    id={fieldId('metrekare')} type="number" name="metrekare" min="1" max="1000000" inputMode="numeric"
                    className="form-input w-full outline-none transition-all duration-200"
                    style={inputStyle}
                    placeholder="Örn: 120"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor={fieldId('lokasyon')} style={labelStyle}>Lokasyon (İl / İlçe) *</label>
              <input
                id={fieldId('lokasyon')} type="text" name="lokasyon"
                className="form-input w-full outline-none transition-all duration-200"
                style={inputStyle}
                placeholder="Örn: Soma, Manisa" maxLength={160} required
              />
            </div>

            {asksWater && (
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ ...labelStyle, marginBottom: '8px' }}>Sahada Su Ulaşımı Var Mı? *</legend>
                <div className="flex gap-6">
                  {['Evet', 'Hayır'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="suUlasimi" value={val} style={{ accentColor: 'var(--color-primary)', width: '15px', height: '15px' }} required={val === 'Evet'} />
                      <span style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{val}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

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
              <p role="alert" style={{ fontSize: '12.5px', color: '#e74c3c' }}>
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
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
