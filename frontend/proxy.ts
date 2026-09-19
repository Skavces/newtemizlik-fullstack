import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next 16'da Middleware "Proxy" olarak yeniden adlandırıldı (davranış aynı) —
// bkz. node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
// Bu yalnızca "iyimser" bir kontrol: httpOnly admin_token çerezinin VARLIĞINA
// bakar, backend'e sorgu atmaz (Proxy her prefetch'te de çalışır — DB/API
// çağrısı burada yasak). Gerçek doğrulama (imza geçerli mi, tokenVersion
// güncel mi, blacklist'te mi) app/nt-panel/(korumali)/layout.tsx'te
// GET /api/auth/me ile yapılır. Çerezsiz istek doğrudan girişe düşer;
// var-ama-geçersiz çerezle gelen istek buradan geçer, layout onu yakalar.
const LOGIN_PATH = '/nt-panel/giris'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith(LOGIN_PATH)) return NextResponse.next()

  const hasSession = request.cookies.has('admin_token')
  if (!hasSession) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/nt-panel/:path*',
}
