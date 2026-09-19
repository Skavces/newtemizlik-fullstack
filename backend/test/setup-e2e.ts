import * as bcrypt from 'bcrypt'

// jest-e2e.json setupFiles ile her spec'ten önce çalışır. Amaç: testlerin
// lokaldeki backend/.env'den TAM bağımsız koşması — process.env @nestjs/config'te
// .env dosyasının önüne geçer, bu yüzden uygulamanın okuduğu her değişken burada
// ya sabitlenir ya da bilinçli olarak boşlanır (dış servis çağrısı tetiklememek için).
//
// Altyapı: docker-compose.test.yml (postgres @5433, redis @6380, throwaway).

export const E2E_ADMIN_USERNAME = 'admin'
export const E2E_ADMIN_PASSWORD = 'e2e-Gizli-Sifre-123'

process.env.NODE_ENV = 'development'
process.env.PORT = '3999'

process.env.JWT_SECRET = 'e2e-jwt-secret'
process.env.JWT_EXPIRES_IN = '8h'
process.env.APP_ENCRYPTION_KEY = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
process.env.ADMIN_USERNAME = E2E_ADMIN_USERNAME
// Düşük round: test hızı için yeterli, güvenlik hedefi yok
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(E2E_ADMIN_PASSWORD, 4)

process.env.DB_HOST = 'localhost'
process.env.DB_PORT = '5433'
process.env.DB_USER = 'postgres'
process.env.DB_PASS = 'test'
process.env.DB_NAME = 'newtemizlik_test'
process.env.REDIS_URL = 'redis://localhost:6380'

process.env.FRONTEND_URL = 'http://localhost:3000'
process.env.UMAMI_PASS = 'e2e-umami-pass'
process.env.UMAMI_USER = 'admin'

// Boot'ta veya cron'da dış servis çağrısı tetikleyebilecek her şey kapalı
process.env.UMAMI_URL = ''
process.env.UMAMI_WEBSITE_ID = ''
process.env.SENTRY_DSN = ''
