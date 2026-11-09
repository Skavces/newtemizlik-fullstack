'use client'

import { useState, useEffect, useRef, type FocusEvent, type PointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { getServicesByCategory, SERVICE_CATEGORIES, servicePath, type ServiceCategory } from '@/lib/services'

interface NavLink {
  label: string
  path: string
  hasServices?: boolean
}

const navLinks: NavLink[] = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Kurumsal', path: '/kurumsal' },
  { label: 'Hizmetlerimiz', path: '/hizmetlerimiz', hasServices: true },
  { label: 'Referanslarımız', path: '/referanslarimiz' },
  { label: 'Blog', path: '/blog' },
  { label: 'S.S.S', path: '/sss' },
  { label: 'İletişim', path: '/iletisim' },
]

// Yalnızca yayında hizmeti olan kategoriler görünür; P7'de bir grup yayına
// alındığında menü sütunu kendiliğinden eklenir.
const serviceGroups = (Object.keys(SERVICE_CATEGORIES) as ServiceCategory[])
  .map((category) => ({
    category,
    label: SERVICE_CATEGORIES[category].label,
    href: `/hizmetlerimiz#${SERVICE_CATEGORIES[category].anchor}`,
    services: getServicesByCategory(category),
    // 7+ hizmet tek sütunda 768px yüksekliğindeki ekrana sığmıyor.
    listColumns: getServicesByCategory(category).length > 6 ? 2 : 1,
  }))
  .filter((group) => group.services.length > 0)

const megaColumnCount = serviceGroups.reduce((sum, group) => sum + group.listColumns, 0)
const MEGA_MENU_ID = 'hizmetler-mega-menu'
const MEGA_CLOSE_DELAY_MS = 150

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  // Tek kategori varken ara katman anlamsız: doğrudan açık başlar.
  const [mobileCategory, setMobileCategory] = useState<ServiceCategory | null>(
    serviceGroups.length === 1 ? serviceGroups[0].category : null,
  )
  const pathname = usePathname()
  const isHome = pathname === '/'
  const megaRef = useRef<HTMLDivElement>(null)
  const megaButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // Hover ile açılmış menüye tıklamak kapatmamalı, sabitlemeli: fare butona
  // gelince menü zaten açılıyor, tıklama toggle olsaydı anında kapanırdı.
  const openedByHoverRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menü dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Escape: menüyü kapat, odağı açan butona geri ver
  useEffect(() => {
    if (!megaOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMegaOpen(false)
      megaButtonRef.current?.focus()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [megaOpen])

  useEffect(() => () => clearTimeout(closeTimerRef.current), [])

  // Mobil menü açıkken arkadaki sayfanın scroll etmesini engelle
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [open])

  // Escape ile mobil menüyü kapat
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Sayfa değişince mega menü/mobil menüyü kapat — render sırasında state
  // ayarlama (React'in "adjusting state during render" deseni), effect içinde
  // setState'i tetikleyip react-hooks/set-state-in-effect'i ihlal etmez
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMegaOpen(false)
    setOpen(false)
  }

  // Dokunmatik ekranda hover yok; orada yalnızca tıklama açar.
  const handleMegaPointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    clearTimeout(closeTimerRef.current)
    if (!megaOpen) {
      openedByHoverRef.current = true
      setMegaOpen(true)
    }
  }

  const handleMegaPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !openedByHoverRef.current) return
    closeTimerRef.current = setTimeout(() => setMegaOpen(false), MEGA_CLOSE_DELAY_MS)
  }

  const handleMegaClick = () => {
    clearTimeout(closeTimerRef.current)
    if (megaOpen && openedByHoverRef.current) {
      openedByHoverRef.current = false
      return
    }
    openedByHoverRef.current = false
    setMegaOpen(!megaOpen)
  }

  // Odak Tab ile menünün dışına çıkınca kapat. relatedTarget null ise (panelin
  // boş bir yerine tıklama) kapatma.
  const handleMegaBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget
    if (next instanceof Node && !e.currentTarget.contains(next)) setMegaOpen(false)
  }

  const isInSection = (path: string) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
  const currentAttr = (path: string) => (pathname === path ? ('page' as const) : undefined)

  const isSolid = !isHome || scrolled || open

  const textColor = isSolid ? 'var(--text-nav)' : 'rgba(255,255,255,0.9)'

  return (
    <nav
      aria-label="Ana menü"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isSolid ? 'var(--bg-nav)' : 'transparent',
        boxShadow: isSolid ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        borderBottom: isSolid ? '1px solid var(--border-subtle)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="relative flex items-center justify-between h-20 md:h-28">

          {/* Logo */}
          <Link href="/" className="shrink-0 cursor-pointer bg-transparent border-none p-0">
            <Image
              src="/logo.png"
              alt="New Temizlik Hizmetleri"
              // Ekrandaki boyut (en fazla 112px yükseklik); 1080 verilince 1080/3840px indiriliyordu.
              width={120}
              height={113}
              loading="eager"
              className="h-20 md:h-28 w-auto object-contain"
            />
          </Link>

          {/* Desktop links — bar üzerinde mutlak ortalanır (sağ tarafta tema
              butonu kalmadığından artık logoya göre değil, barın kendisine
              göre ortalanması gerekiyor) */}
          <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const activeClass = isInSection(link.path) ? ' nav-link-active' : ''

              if (!link.hasServices) {
                return (
                  <Link
                    key={link.label}
                    href={link.path}
                    aria-current={currentAttr(link.path)}
                    className={`hover-brand nav-focus flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer bg-transparent border-none p-0${activeClass}`}
                    style={{ color: textColor, fontFamily: "'Poppins', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                )
              }

              return (
                <div
                  key={link.label}
                  ref={megaRef}
                  style={{ position: 'relative' }}
                  onPointerEnter={handleMegaPointerEnter}
                  onPointerLeave={handleMegaPointerLeave}
                  onBlur={handleMegaBlur}
                >
                  <button
                    ref={megaButtonRef}
                    type="button"
                    className={`hover-brand nav-focus flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer bg-transparent border-none p-0${activeClass}`}
                    style={{ color: textColor, fontFamily: "'Poppins', sans-serif" }}
                    aria-expanded={megaOpen}
                    aria-controls={MEGA_MENU_ID}
                    onClick={handleMegaClick}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s',
                        transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {/* Buton ile panel arasındaki boşlukta hover kopmasın */}
                  {megaOpen && (
                    <div aria-hidden="true" style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '16px' }} />
                  )}

                  <div
                    id={MEGA_MENU_ID}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 16px)',
                      left: '50%',
                      width: `${40 + 260 * megaColumnCount}px`,
                      maxWidth: 'calc(100vw - 32px)',
                      maxHeight: 'calc(100vh - 150px)',
                      overflowY: 'auto',
                      background: 'var(--bg-nav)',
                      borderRadius: '10px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-subtle)',
                      opacity: megaOpen ? 1 : 0,
                      // visibility: kapalı paneldeki linkler Tab sırasına girmesin
                      visibility: megaOpen ? 'visible' : 'hidden',
                      pointerEvents: megaOpen ? 'auto' : 'none',
                      transform: megaOpen
                        ? 'translateX(-50%) translateY(0)'
                        : 'translateX(-50%) translateY(-8px)',
                      transition: 'opacity 0.2s, transform 0.2s, visibility 0.2s',
                    }}
                  >
                    {/* Üst link — Hizmetlerimiz genel sayfası */}
                    <Link
                      href={link.path}
                      aria-current={currentAttr(link.path)}
                      onClick={() => setMegaOpen(false)}
                      className="hover-dropdown-top nav-focus-inset"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '14px 20px',
                        background: 'rgba(127,191,58,0.06)',
                        borderBottom: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '12px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--color-secondary)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Tüm Hizmetlerimiz
                      <ChevronRight size={14} />
                    </Link>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: serviceGroups.map((g) => `${g.listColumns}fr`).join(' '),
                      }}
                    >
                      {serviceGroups.map((group, index) => (
                        <div
                          key={group.category}
                          style={{
                            padding: '14px 8px 12px',
                            minWidth: 0,
                            borderLeft: index > 0 ? '1px solid var(--border-subtle)' : 'none',
                          }}
                        >
                          <Link
                            href={group.href}
                            onClick={() => setMegaOpen(false)}
                            className="hover-brand nav-focus-inset"
                            style={{
                              display: 'block', padding: '4px 12px 10px',
                              fontSize: '12px', fontWeight: 700,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: 'var(--color-secondary)',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {group.label}
                          </Link>
                          <ul
                            style={{
                              listStyle: 'none', margin: 0, padding: 0,
                              display: 'grid',
                              gridTemplateColumns: `repeat(${group.listColumns}, minmax(0, 1fr))`,
                            }}
                          >
                            {group.services.map((service) => {
                              const path = servicePath(service)
                              const isCurrent = pathname === path
                              return (
                                <li key={service.slug}>
                                  <Link
                                    href={path}
                                    aria-current={isCurrent ? 'page' : undefined}
                                    onClick={() => setMegaOpen(false)}
                                    className="hover-dropdown-item nav-focus-inset"
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                      padding: '9px 12px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '13.5px', fontWeight: isCurrent ? 600 : 500,
                                      color: isCurrent ? 'var(--color-secondary)' : 'var(--text-nav)',
                                      fontFamily: "'Poppins', sans-serif",
                                      transition: 'background 0.15s, color 0.15s',
                                    }}
                                  >
                                    <span aria-hidden="true" style={{ color: 'var(--color-primary)', fontSize: '16px', lineHeight: 1 }}>»</span>
                                    {service.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="nav-focus w-11 h-11 flex items-center justify-center cursor-pointer"
              style={{ color: isSolid ? 'var(--text-muted)' : '#ffffff', background: 'none', border: 'none' }}
              aria-label="Menü"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer — 17 hizmetle ekrana sığmayabilir, kendi içinde kayar.
          Kapalıyken invisible: içindeki linkler Tab sırasına girmesin. */}
      <div
        className={`lg:hidden transition-all duration-300 ${open
          ? 'max-h-[calc(100dvh-5rem)] md:max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain opacity-100 visible'
          : 'max-h-0 overflow-hidden opacity-0 invisible'}`}
        style={{ backgroundColor: 'var(--bg-nav-mobile)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="px-5 py-5 flex flex-col gap-1">
          {navLinks.map((link) => {
            const inSection = isInSection(link.path)

            return (
              <div key={link.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    href={link.path}
                    aria-current={currentAttr(link.path)}
                    onClick={() => setOpen(false)}
                    className="nav-focus-inset py-3 text-sm transition-colors text-left cursor-pointer bg-transparent border-none flex-1"
                    style={{
                      color: inSection ? 'var(--color-secondary)' : 'var(--text-muted)',
                      fontWeight: inSection ? 600 : 500,
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.hasServices && (
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="nav-focus-inset w-11 h-11 flex items-center justify-center"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      aria-label={`${link.label} alt menüsü`}
                      aria-expanded={mobileServicesOpen}
                    >
                      <ChevronDown
                        size={16}
                        style={{ transition: 'transform 0.2s', transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  )}
                </div>

                {link.hasServices && mobileServicesOpen && (
                  <div style={{ paddingLeft: '14px', paddingBottom: '6px', borderLeft: '2px solid var(--color-primary)', marginLeft: '8px', marginBottom: '4px' }}>
                    {serviceGroups.map((group) => {
                      const isGroupOpen = mobileCategory === group.category
                      return (
                        <div key={group.category}>
                          <button
                            type="button"
                            onClick={() => setMobileCategory(isGroupOpen ? null : group.category)}
                            className="nav-focus-inset w-full min-h-11 flex items-center justify-between text-left"
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: '12px', fontWeight: 700,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: 'var(--color-secondary)',
                            }}
                            aria-expanded={isGroupOpen}
                          >
                            {group.label}
                            <span className="w-11 h-11 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                              <ChevronDown
                                size={14}
                                style={{ transition: 'transform 0.2s', transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              />
                            </span>
                          </button>
                          {isGroupOpen && group.services.map((service) => {
                            const path = servicePath(service)
                            const isCurrent = pathname === path
                            return (
                              <Link
                                key={service.slug}
                                href={path}
                                aria-current={isCurrent ? 'page' : undefined}
                                onClick={() => setOpen(false)}
                                className="nav-focus-inset w-full min-h-11 py-2.5 text-sm text-left cursor-pointer bg-transparent border-none"
                                style={{
                                  color: isCurrent ? 'var(--color-secondary)' : 'var(--text-muted)',
                                  fontWeight: isCurrent ? 600 : 400,
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                              >
                                <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>»</span>
                                {service.name}
                              </Link>
                            )
                          })}
                        </div>
                      )
                    })}
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
