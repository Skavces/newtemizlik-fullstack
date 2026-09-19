import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { API_URL } from '@/lib/api'
import type { AuthMe } from '@/types/api'
import { ToastProvider } from '@/components/panel/ToastProvider'
import { ConfirmProvider } from '@/components/panel/ConfirmProvider'
import AdminShell from '@/components/panel/AdminShell'

// Gerçek oturum doğrulaması burada yapılır (proxy.ts yalnızca çerez varlığına
// bakan iyimser bir kontrol — bkz. Faz 4 planı, Next 16 Proxy dokümanı).
// Sunucu tarafı fetch'e çerez otomatik gitmez, elle forward edilir; admin_token
// httpOnly olduğu için tarayıcıda okunamaz, bu yüzden "giriş yapılmış mı"
// sorusunun tek cevabı bu istek.
async function getSessionUsername(): Promise<string | null> {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: `admin_token=${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as AuthMe
    return data.username
  } catch {
    return null
  }
}

export default async function ProtectedPanelLayout({ children }: { children: ReactNode }) {
  const username = await getSessionUsername()
  if (!username) redirect('/nt-panel/giris')

  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminShell username={username}>{children}</AdminShell>
      </ConfirmProvider>
    </ToastProvider>
  )
}
