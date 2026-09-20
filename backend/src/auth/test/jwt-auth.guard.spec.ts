import { UnauthorizedException } from '@nestjs/common'
import { JwtAuthGuard } from '../jwt-auth.guard'

// Panel tarafı (frontend/lib/panelApi.ts) guard'ın reddettiği isteklerle
// (oturum geçersiz/süresi dolmuş) servisin fırlattığı iş-kuralı 401'lerini
// (yanlış şifre/TOTP) `code: 'SESSION_EXPIRED'` alanına bakarak ayırıyor —
// bu test o sözleşmenin bozulmadığını doğrular.
describe('JwtAuthGuard.handleRequest', () => {
  const guard = new JwtAuthGuard()

  it('user yoksa (token geçersiz/süresi dolmuş) code: SESSION_EXPIRED taşıyan bir UnauthorizedException fırlatır', () => {
    expect(() => guard.handleRequest(null, false)).toThrow(UnauthorizedException)
    try {
      guard.handleRequest(null, false)
      fail('fırlatmalıydı')
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedException)
      expect((err as UnauthorizedException).getResponse()).toMatchObject({ code: 'SESSION_EXPIRED' })
    }
  })

  it('passport-jwt/strategy bir hata verdiyse mesajı korur ama yine de code: SESSION_EXPIRED ekler', () => {
    try {
      guard.handleRequest(new Error('Oturum sonlandırılmış'), false)
      fail('fırlatmalıydı')
    } catch (err) {
      expect((err as UnauthorizedException).getResponse()).toMatchObject({
        message: 'Oturum sonlandırılmış',
        code: 'SESSION_EXPIRED',
      })
    }
  })

  it('geçerli bir user varsa olduğu gibi döner', () => {
    const user = { userId: '1', username: 'admin' }
    expect(guard.handleRequest(null, user)).toBe(user)
  })
})
