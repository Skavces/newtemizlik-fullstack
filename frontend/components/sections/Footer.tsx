import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail, type LucideIcon } from 'lucide-react'
import TrackedLink from '@/components/ui/TrackedLink'

interface FooterLinkGroup {
  title: string
  links: { label: string; path: string }[]
}

interface ContactItem {
  icon: LucideIcon
  text: string
  href?: string
  trackEvent?: string
  trackParams?: Record<string, unknown>
}

interface SocialItem {
  icon: LucideIcon
  href: string
  label: string
}

const footerLinks: FooterLinkGroup[] = [
  {
    title: 'Hizmetler',
    links: [
      { label: 'Panel Temizlik', path: '/hizmetlerimiz/panel-temizlik' },
      { label: 'Bakım & Onarım', path: '/hizmetlerimiz/panel-bakim' },
      { label: 'Robot & Makina Satışı', path: '/hizmetlerimiz/robot-satisi' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', path: '/kurumsal' },
      { label: 'Referanslarımız', path: '/referanslarimiz' },
      { label: 'Blog', path: '/blog' },
      { label: 'S.S.S', path: '/sss' },
      { label: 'İletişim', path: '/iletisim' },
    ],
  },
]

const contactItems: ContactItem[] = [
  { icon: MapPin, text: 'Atatürk Mah. İzgin Sk. No:4 Soma/Manisa' },
  { icon: Phone, text: '+90 530 473 87 93', href: 'tel:+905304738793', trackEvent: 'phone_click', trackParams: { location: 'footer' } },
  { icon: Mail, text: 'info@newtemizlik.com.tr', href: 'mailto:info@newtemizlik.com.tr' },
]

const socials: SocialItem[] = [
  { icon: Facebook, href: 'https://www.facebook.com/people/New-Temizlik-Hizmetleri/61564445445368/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/new_temizlikhizmetleri/', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#12141a' }}>

      {/* Top green bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #7FBF3A, #5a9e1e)' }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/logo.png"
              alt="New Temizlik Hizmetleri"
              className="h-16 w-auto object-contain mb-5"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
              Profesyonel temizlik ve bakım çözümleri ile endüstriyel alanda güvenilir iş ortağınız.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="hover-social w-9 h-9 flex items-center justify-center transition-all duration-200"
                  style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', marginBottom: '18px', textTransform: 'uppercase' }}>
                {group.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.path}
                      className="hover-brand"
                      style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em', color: '#ffffff', marginBottom: '18px', textTransform: 'uppercase' }}>
              İletişim
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#7FBF3A' }} />
                  {item.href && item.trackEvent ? (
                    <TrackedLink
                      href={item.href}
                      event={item.trackEvent}
                      params={item.trackParams}
                      className="hover-brand"
                      style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                    >
                      {item.text}
                    </TrackedLink>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      className="hover-brand"
                      style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} New Temizlik Hizmetleri. Tüm hakları saklıdır.
          </p>
          <a
            href="https://selimkavaklicesme.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-brand"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Tasarım & Kodlama: Selim Kavaklıçeşme
          </a>
        </div>
      </div>
    </footer>
  )
}
