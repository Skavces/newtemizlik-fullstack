import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Guard'ın reddettiği HER istek (JWT yok/bozuk/süresi dolmuş, blacklist'te,
  // tokenVersion uyuşmuyor, pre-auth token) oturumun kendisiyle ilgilidir —
  // controller/service'in changeCredentials/confirmSetup/remove2FA gibi
  // uçlarda ayrıca fırlattığı "yanlış şifre/TOTP" 401'lerinden yapısal olarak
  // farklıdır: bunlar guard'ı GEÇMİŞ bir istekte oluşur. Panel tarafı
  // (lib/panelApi.ts) ikisini birbirinden ayırmak zorunda; ayırt edici tek
  // sinyal bu "code" alanı — mesaj metnine güvenmek kırılgan olurdu.
  handleRequest<TUser = unknown>(err: unknown, user: TUser | false | null | undefined): TUser {
    if (err || !user) {
      const message = err instanceof Error ? err.message : 'Oturum geçersiz veya süresi dolmuş'
      throw new UnauthorizedException({ message, code: 'SESSION_EXPIRED' })
    }
    return user
  }
}
