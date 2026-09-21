import { NestExpressApplication } from '@nestjs/platform-express'
import request from 'supertest'
import { E2E_ADMIN_PASSWORD, E2E_ADMIN_USERNAME } from './setup-e2e'
import { createE2eApp, extractAdminCookie, flushTestRedis, resetAdminConfig } from './e2e-utils'

// /api/dash/* guard'lı, ama asıl amacı setup-e2e.ts'in bilerek boş bıraktığı
// UMAMI_URL/UMAMI_WEBSITE_ID ile servisin nasıl davrandığını doğrulamak:
// Umami'ye hiç gitmeden 200 + boş gövde dönmeli, asla 500 değil (analytics.service.ts'in
// `if (!this.websiteId) return null/[]` kısa devresi — bkz. Faz 5 planı).
describe('Analytics dash routes (e2e)', () => {
  let app: NestExpressApplication
  let server: ReturnType<NestExpressApplication['getHttpServer']>
  let cookie: string

  const startAt = Date.parse('2026-01-01T00:00:00.000Z')
  const endAt = Date.parse('2026-01-08T00:00:00.000Z')

  beforeAll(async () => {
    app = await createE2eApp()
    server = app.getHttpServer()
    await resetAdminConfig(app)
    await flushTestRedis(app)

    const login = await request(server)
      .post('/api/auth/login')
      .send({ username: E2E_ADMIN_USERNAME, password: E2E_ADMIN_PASSWORD })
      .expect(201)
    cookie = extractAdminCookie(login.headers['set-cookie'])
  })

  afterAll(async () => {
    await app.close()
  })

  describe('auth guard', () => {
    it.each([
      ['stats'],
      ['pageviews'],
      ['pages'],
      ['metrics'],
    ])('GET /api/dash/%s returns 401 without a cookie', async (route) => {
      await request(server).get(`/api/dash/${route}`).expect(401)
    })
  })

  describe('validation', () => {
    it('rejects missing startAt/endAt', async () => {
      await request(server).get('/api/dash/stats').set('Cookie', cookie).expect(400)
    })

    it('rejects non-numeric startAt/endAt', async () => {
      await request(server)
        .get('/api/dash/stats?startAt=abc&endAt=def')
        .set('Cookie', cookie)
        .expect(400)
    })

    it('rejects an invalid pageviews unit', async () => {
      await request(server)
        .get(`/api/dash/pageviews?startAt=${startAt}&endAt=${endAt}&unit=fortnight`)
        .set('Cookie', cookie)
        .expect(400)
    })

    it('rejects a missing/invalid metrics type', async () => {
      await request(server)
        .get(`/api/dash/metrics?startAt=${startAt}&endAt=${endAt}`)
        .set('Cookie', cookie)
        .expect(400)
      await request(server)
        .get(`/api/dash/metrics?startAt=${startAt}&endAt=${endAt}&type=weather`)
        .set('Cookie', cookie)
        .expect(400)
    })
  })

  // UMAMI_WEBSITE_ID e2e'de boş (setup-e2e.ts) — servis Umami'ye hiç gitmeden
  // kısa devre yapar. Bu, panelin "Umami henüz bağlanmadı" boş durumunun
  // sözleşmesi: backend her koşulda 200 döner, asla 500 değil.
  describe('graceful degradation when Umami is not configured', () => {
    it('GET /api/dash/stats returns 200 with an empty object', async () => {
      const res = await request(server)
        .get(`/api/dash/stats?startAt=${startAt}&endAt=${endAt}`)
        .set('Cookie', cookie)
        .expect(200)
      expect(res.body).toEqual({})
    })

    it('GET /api/dash/pageviews returns 200 with an empty object', async () => {
      const res = await request(server)
        .get(`/api/dash/pageviews?startAt=${startAt}&endAt=${endAt}&unit=day`)
        .set('Cookie', cookie)
        .expect(200)
      expect(res.body).toEqual({})
    })

    it('GET /api/dash/pages returns 200 with an empty array', async () => {
      const res = await request(server)
        .get(`/api/dash/pages?startAt=${startAt}&endAt=${endAt}`)
        .set('Cookie', cookie)
        .expect(200)
      expect(res.body).toEqual([])
    })

    it('GET /api/dash/metrics returns 200 with an empty array', async () => {
      const res = await request(server)
        .get(`/api/dash/metrics?startAt=${startAt}&endAt=${endAt}&type=browser`)
        .set('Cookie', cookie)
        .expect(200)
      expect(res.body).toEqual([])
    })
  })
})
