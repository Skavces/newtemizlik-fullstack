'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  HelpCircle,
  Images,
  Inbox,
  ScrollText,
  ShieldCheck,
  Bot,
  Menu,
  X,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { logout } from '@/lib/panelApi'
import { useToast } from './ToastProvider'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  match: (pathname: string) => boolean
}

const NAV: NavItem[] = [
  { href: '/nt-panel', label: 'Ana Sayfa', icon: LayoutDashboard, match: (p) => p === '/nt-panel' },
  { href: '/nt-panel/analitik', label: 'Analitik', icon: BarChart3, match: (p) => p.startsWith('/nt-panel/analitik') },
  { href: '/nt-panel/blog', label: 'Blog', icon: FileText, match: (p) => p.startsWith('/nt-panel/blog') },
  { href: '/nt-panel/sss', label: 'S.S.S.', icon: HelpCircle, match: (p) => p.startsWith('/nt-panel/sss') },
  { href: '/nt-panel/referanslar', label: 'Referanslar', icon: Images, match: (p) => p.startsWith('/nt-panel/referanslar') },
  { href: '/nt-panel/teklif-talepleri', label: 'Teklif Talepleri', icon: Inbox, match: (p) => p.startsWith('/nt-panel/teklif-talepleri') },
  { href: '/nt-panel/chatbot', label: 'Chatbot', icon: Bot, match: (p) => p.startsWith('/nt-panel/chatbot') },
  { href: '/nt-panel/loglar', label: 'Loglar', icon: ScrollText, match: (p) => p.startsWith('/nt-panel/loglar') },
  { href: '/nt-panel/guvenlik', label: 'Güvenlik', icon: ShieldCheck, match: (p) => p.startsWith('/nt-panel/guvenlik') },
]

export default function AdminShell({ username, children }: { username: string; children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)
  // Ana sayfa (dashboard) tam genişlikte bir hero banner kullanıyor —
  // burada standart main padding'i uygulanmaz, sayfa kendi iç boşluğunu kendi verir.
  const isDashboard = pathname === '/nt-panel'

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // panelFetch zaten 401'i girişe yönlendiriyor; burada sessiz geçilir
    }
    router.push('/nt-panel/giris')
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row" style={{ background: 'var(--bg-alt)' }}>
      {/* Desktop sidebar */}
      <aside className="panel-sidebar hidden w-64 shrink-0 flex-col lg:flex" style={{ background: 'var(--bg-card)' }}>
        <div className="panel-sidebar-brand p-6">
          <Link href="/nt-panel" className="block">
            <Image src="/logo.png" alt="New Temizlik" width={1080} height={1015} priority className="h-auto w-full object-contain" />
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          {NAV.map((item) => {
            const active = item.match(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`panel-nav-link mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'panel-nav-link--active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-nav-link mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <ExternalLink size={16} />
            Siteyi Gör
          </a>
          <div className="mb-1 flex items-center gap-2.5 px-3 py-2">
            <span className="panel-user-avatar">{username.slice(0, 1).toUpperCase()}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="panel-nav-link flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
            style={{ color: '#e74c3c' }}
          >
            <LogOut size={16} />
            Çıkış
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header
        className="flex h-14 items-center justify-between px-4 lg:hidden"
        style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <Link href="/nt-panel" className="block">
          <Image src="/logo.png" alt="New Temizlik" width={1080} height={1015} priority className="h-9 w-auto object-contain" />
        </Link>
        <button onClick={() => setMobileOpen((v) => !v)} style={{ color: 'var(--text-muted)' }} aria-label="Menü">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {mobileOpen && (
        <nav className="flex flex-col p-3 lg:hidden" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
          {NAV.map((item) => {
            const active = item.match(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`panel-nav-link mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'panel-nav-link--active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={() => {
              setMobileOpen(false)
              handleLogout()
              showToast('success', 'Çıkış yapıldı')
            }}
            className="panel-nav-link mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
            style={{ color: '#e74c3c' }}
          >
            <LogOut size={16} />
            Çıkış ({username})
          </button>
        </nav>
      )}

      <div className="flex-1 overflow-auto" style={{ background: 'var(--bg-body)' }}>
        <main className={isDashboard ? '' : 'mx-auto max-w-6xl px-5 py-8 sm:px-8'}>{children}</main>
      </div>
    </div>
  )
}
