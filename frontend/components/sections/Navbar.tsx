'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, ChevronDown, ChevronRight } from 'lucide-react'
import { useTheme } from '@/context/useTheme'

interface NavChild {
  label: string
  path: string
}

interface NavLink {
  label: string
  path: string
  children?: NavChild[]
}

const navLinks: NavLink[] = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Kurumsal', path: '/kurumsal' },
  {
    label: 'Hizmetlerimiz',
    path: '/hizmetlerimiz',
    children: [
      { label: 'Panel Temizlik Hizmeti', path: '/hizmetlerimiz/panel-temizlik' },
      { label: 'Panel Bakım & Onarım İzleme', path: '/hizmetlerimiz/panel-bakim' },
      { label: 'Robot & Makina Satışı', path: '/hizmetlerimiz/robot-satisi' },
    ],
  },
  { label: 'Referanslarımız', path: '/referanslarimiz' },
  { label: 'Blog', path: '/blog' },
  { label: 'S.S.S', path: '/sss' },
  { label: 'İletişim', path: '/iletisim' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null) // label of open dropdown
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sayfa değişince dropdown/mobil menüyü kapat — render sırasında state
  // ayarlama (React'in "adjusting state during render" deseni), effect içinde
  // setState'i tetikleyip react-hooks/set-state-in-effect'i ihlal etmez
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setDropdown(null)
    setOpen(false)
  }

  const isSolid = !isHome || scrolled || open

  const textColor = isSolid ? 'var(--text-nav)' : 'rgba(255,255,255,0.9)'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        backgroundColor: isSolid ? 'var(--bg-nav)' : 'transparent',
        boxShadow: isSolid ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        borderBottom: isSolid ? '1px solid var(--border-subtle)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-28">

          {/* Logo */}
          <Link href="/" className="shrink-0 cursor-pointer bg-transparent border-none p-0">
            <img
              src="/logo.png"
              alt="New Temizlik Hizmetleri"
              className="h-20 md:h-28 w-auto object-contain"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7" ref={dropdownRef}>
            {navLinks.map((link) => {
              const hasChildren = (link.children?.length ?? 0) > 0
              const isOpen = dropdown === link.label

              return (
                <div key={link.label} style={{ position: 'relative' }}>
                  {hasChildren ? (
                    <button
                      className="hover-brand flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: textColor, fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setDropdown(isOpen ? null : link.label)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.path}
                      className="hover-brand flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: textColor, fontFamily: "'Poppins', sans-serif" }}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown panel */}
                  {hasChildren && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 16px)',
                        left: '50%',
                        minWidth: '280px',
                        background: 'var(--bg-nav)',
                        borderRadius: '10px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        opacity: isOpen ? 1 : 0,
                        pointerEvents: isOpen ? 'all' : 'none',
                        transform: isOpen
                          ? 'translateX(-50%) translateY(0)'
                          : 'translateX(-50%) translateY(-8px)',
                        transition: 'opacity 0.2s, transform 0.2s',
                      }}
                    >
                      {/* Üst link — Hizmetlerimiz genel sayfası */}
                      <Link
                        href={link.path}
                        className="hover-dropdown-top"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '14px 20px',
                          background: 'rgba(127,191,58,0.06)',
                          borderBottom: '1px solid var(--border-subtle)',
                          border: 'none', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#7FBF3A',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Tüm Hizmetlerimiz
                        <ChevronRight size={14} />
                      </Link>

                      {/* Alt sayfalar */}
                      {link.children?.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className="hover-dropdown-item"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            width: '100%', padding: '13px 20px',
                            background: 'transparent',
                            borderBottom: '1px solid var(--border-subtle)',
                            border: 'none', cursor: 'pointer',
                            fontSize: '13.5px', fontWeight: 500,
                            color: 'var(--text-nav)',
                            fontFamily: "'Poppins', sans-serif",
                            textAlign: 'left',
                            transition: 'background 0.15s, color 0.15s',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#7FBF3A', fontSize: '16px', lineHeight: 1 }}>»</span>
                            {child.label}
                          </span>
                          <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: theme toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{
                borderRadius: '50%',
                border: '1px solid',
                borderColor: isSolid ? 'var(--border-subtle)' : 'rgba(255,255,255,0.3)',
                background: 'transparent',
                color: isSolid ? 'var(--text-muted)' : 'rgba(255,255,255,0.8)',
              }}
              aria-label="Tema değiştir"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 cursor-pointer"
              style={{ color: isSolid ? 'var(--text-muted)' : '#ffffff', background: 'none', border: 'none' }}
              aria-label="Tema değiştir"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 cursor-pointer"
              style={{ color: isSolid ? 'var(--text-muted)' : '#ffffff', background: 'none', border: 'none' }}
              aria-label="Menü"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ backgroundColor: 'var(--bg-nav-mobile)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="px-5 py-5 flex flex-col gap-1">
          {navLinks.map((link) => {
            const hasChildren = (link.children?.length ?? 0) > 0
            const isExpanded = mobileExpanded === link.label

            return (
              <div key={link.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    href={link.path}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm font-medium transition-colors text-left cursor-pointer bg-transparent border-none flex-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : link.label)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-muted)' }}
                    >
                      <ChevronDown
                        size={16}
                        style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div style={{ paddingLeft: '14px', paddingBottom: '6px', borderLeft: '2px solid #7FBF3A', marginLeft: '8px', marginBottom: '4px' }}>
                    {link.children?.map((child) => (
                      <Link
                        key={child.path}
                        href={child.path}
                        onClick={() => setOpen(false)}
                        className="w-full py-2.5 text-sm text-left cursor-pointer bg-transparent border-none"
                        style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <span style={{ color: '#7FBF3A' }}>»</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
              </div>
            )
          })}

        </div>
      </div>
    </nav>
  )
}
