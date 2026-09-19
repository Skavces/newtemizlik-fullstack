import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { authenticator } from 'otplib'
import * as qrcode from 'qrcode'
import { AdminConfigService } from './admin-config.service'
import { AdminConfig } from './admin-config.entity'
import type { JwtPayload } from './jwt-payload'
import Redis from 'ioredis'
import { REDIS_CLIENT } from '../redis/redis.module'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cfg: ConfigService,
    private adminConfigService: AdminConfigService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  // Health check için: Redis erişilemezse throw eder
  async pingRedis(): Promise<void> {
    await this.redis.ping()
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    const val = await this.redis.get(`blacklist:${jti}`)
    return val !== null
  }

  async blacklistToken(jti: string, exp: number): Promise<void> {
    const ttl = Math.max(exp - Math.floor(Date.now() / 1000), 1)
    await this.redis.set(`blacklist:${jti}`, '1', 'EX', ttl)
  }

  // Returns the loaded config so callers can reuse it without a second DB hit.
  private async validateCredentials(username: string, password: string): Promise<AdminConfig> {
    const config = await this.adminConfigService.getConfig()
    const effectiveUsername = config.username ?? this.cfg.get<string>('ADMIN_USERNAME') ?? ''
    const effectiveHash = config.passwordHash ?? this.cfg.get<string>('ADMIN_PASSWORD_HASH') ?? ''

    if (!effectiveUsername || !effectiveHash) {
      throw new Error('Admin kimlik bilgileri yapılandırılmamış')
    }

    const usernameMatch = username === effectiveUsername
    // Always run bcrypt regardless of username match to prevent timing-based enumeration
    const passwordMatch = await bcrypt.compare(password, effectiveHash)
    if (!usernameMatch || !passwordMatch) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı')
    }

    return config
  }

  // 5 farklı endpoint aynı TOTP-doğrula-ve-tekrar-kullanımı-engelle mantığını
  // paylaşıyor; tek yerden yönetiliyor ki key formatı/TTL değişince hepsi
  // birlikte güncellensin. Mesajlar çağıran tarafa göre değişebildiğinden parametre.
  private async verifyAndConsumeOtp(
    secret: string,
    code: string,
    usedMessage: string,
    invalidMessage: string,
  ): Promise<void> {
    const otpKey = `otp:${code}-${Math.floor(Date.now() / 30000)}`
    if (await this.redis.get(otpKey)) {
      throw new UnauthorizedException(usedMessage)
    }
    if (!authenticator.verify({ token: code, secret })) {
      throw new UnauthorizedException(invalidMessage)
    }
    await this.redis.set(otpKey, '1', 'EX', 60)
  }

  async login(username: string, password: string, rememberMe = false) {
    const config = await this.validateCredentials(username, password)
    const bypass = this.cfg.get('TOTP_BYPASS') === '1'
    if (bypass && this.cfg.get('NODE_ENV') === 'production') {
      throw new Error('TOTP_BYPASS production ortamında kullanılamaz!')
    }

    if (config.totpSecret && !bypass) {
      const preAuthToken = this.jwtService.sign(
        { username, sub: 'admin', role: 'pre-auth', rememberMe, jti: crypto.randomUUID() },
        { expiresIn: '5m' },
      )
      return { requires2fa: true, preAuthToken }
    }

    const jti = crypto.randomUUID()
    const expiresIn = rememberMe ? '30d' : this.cfg.get('JWT_EXPIRES_IN', '8h')
    return {
      access_token: this.jwtService.sign(
        { username, sub: 'admin', jti, ver: config.tokenVersion ?? 0 },
        { expiresIn },
      ),
      rememberMe,
    }
  }

  async changeCredentials(
    currentPassword: string,
    totpCode: string | undefined,
    jwtUsername: string,
    newUsername?: string,
    newPassword?: string,
  ): Promise<void> {
    if (!newUsername && !newPassword) {
      throw new UnauthorizedException('En az bir alan değiştirilmeli')
    }

    const config = await this.adminConfigService.getConfig()
    const effectiveUsername = config.username ?? this.cfg.get<string>('ADMIN_USERNAME') ?? ''
    const effectiveHash = config.passwordHash ?? this.cfg.get<string>('ADMIN_PASSWORD_HASH') ?? ''

    if (jwtUsername !== effectiveUsername) {
      throw new UnauthorizedException('Kimlik doğrulaması başarısız')
    }

    const passwordValid = await bcrypt.compare(currentPassword, effectiveHash)
    if (!passwordValid) {
      throw new UnauthorizedException('Mevcut şifre hatalı')
    }

    if (config.totpSecret) {
      if (!totpCode) {
        throw new UnauthorizedException('2FA kodu gerekli')
      }
      await this.verifyAndConsumeOtp(config.totpSecret, totpCode, 'Bu 2FA kodu daha önce kullanıldı', 'Geçersiz 2FA kodu')
    }

    // Kimlik doğrulama değil girdi hatası — 401 frontend'de "oturum düştü"
    // gibi yorumlanabilir, 400 doğru semantik
    if (newUsername && newUsername === effectiveUsername) {
      throw new BadRequestException('Yeni kullanıcı adı mevcut ile aynı olamaz')
    }

    if (newUsername) {
      await this.adminConfigService.setUsername(newUsername)
    }

    if (newPassword) {
      const hash = await bcrypt.hash(newPassword, 12)
      await this.adminConfigService.setPasswordHash(hash)
    }

    // Diğer cihazlardaki (örn. 30 günlük rememberMe) oturumlar da düşsün
    await this.adminConfigService.incrementTokenVersion()
  }

  async verify2FA(preAuthToken: string, code: string) {
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(preAuthToken)
    } catch {
      throw new UnauthorizedException('Oturum süresi doldu, tekrar giriş yapın')
    }

    if (payload.role !== 'pre-auth') {
      throw new UnauthorizedException('Geçersiz token')
    }

    if (payload.jti && await this.isTokenBlacklisted(payload.jti)) {
      throw new UnauthorizedException('Bu token daha önce kullanıldı')
    }

    const config = await this.adminConfigService.getConfig()
    if (!config.totpSecret) {
      throw new UnauthorizedException('2FA kurulu değil')
    }

    await this.verifyAndConsumeOtp(config.totpSecret, code, 'Kod daha önce kullanıldı', 'Geçersiz doğrulama kodu')

    if (payload.jti) await this.blacklistToken(payload.jti, payload.exp)

    const rememberMe = !!payload.rememberMe
    const jti = crypto.randomUUID()
    const expiresIn = rememberMe ? '30d' : this.cfg.get('JWT_EXPIRES_IN', '8h')
    return {
      access_token: this.jwtService.sign(
        { username: payload.username, sub: 'admin', jti, ver: config.tokenVersion ?? 0 },
        { expiresIn },
      ),
      rememberMe,
    }
  }

  async generateSetupSecret(): Promise<{ secret: string; qrCodeUrl: string }> {
    const adminUsername = this.cfg.get<string>('ADMIN_USERNAME') || 'admin'
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(adminUsername, 'New Temizlik Admin', secret)
    const qrCodeUrl = await qrcode.toDataURL(otpauth)
    return { secret, qrCodeUrl }
  }

  async confirmSetup(secret: string, code: string, currentCode?: string): Promise<{ ok: boolean }> {
    const config = await this.adminConfigService.getConfig()
    if (config.totpSecret) {
      if (!currentCode) throw new UnauthorizedException('Mevcut TOTP kodu gerekli')
      await this.verifyAndConsumeOtp(config.totpSecret, currentCode, 'Mevcut TOTP kodu daha önce kullanıldı', 'Mevcut TOTP kodu yanlış')
    }

    await this.verifyAndConsumeOtp(secret, code, 'Bu 2FA kodu daha önce kullanıldı', 'Geçersiz doğrulama kodu, tekrar deneyin')
    await this.adminConfigService.setTotpSecret(secret)
    return { ok: true }
  }

  async remove2FA(code: string, currentPassword: string): Promise<{ ok: boolean }> {
    const config = await this.adminConfigService.getConfig()
    if (!config.totpSecret) {
      throw new UnauthorizedException('2FA kurulu değil')
    }

    const effectiveHash = config.passwordHash ?? this.cfg.get<string>('ADMIN_PASSWORD_HASH') ?? ''
    const passwordValid = await bcrypt.compare(currentPassword, effectiveHash)
    if (!passwordValid) {
      throw new UnauthorizedException('Mevcut şifre hatalı')
    }

    await this.verifyAndConsumeOtp(config.totpSecret, code, 'Bu 2FA kodu daha önce kullanıldı', 'Geçersiz doğrulama kodu')
    await this.adminConfigService.removeTotpSecret()
    return { ok: true }
  }

  async get2FAStatus(): Promise<{ enabled: boolean }> {
    const config = await this.adminConfigService.getConfig()
    return { enabled: !!config.totpSecret }
  }
}
