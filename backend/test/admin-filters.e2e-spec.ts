import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { E2E_ADMIN_PASSWORD, E2E_ADMIN_USERNAME } from './setup-e2e'
import { createE2eApp, extractAdminCookie, flushTestRedis, resetAdminConfig } from './e2e-utils'
import { AppLog } from '../src/logs/entities/app-log.entity'
import { QuoteRequest } from '../src/quote/entities/quote-request.entity'

// 4.9 admin liste filtreleri: tarih penceresi ve status filtresi gerçek
// Postgres'te doğru alt kümeyi döndürmeli; geçersiz tarih 400'lemeli.
describe('Admin list filters (e2e)', () => {
  let app: NestExpressApplication
  let server: ReturnType<NestExpressApplication['getHttpServer']>
  let cookie: string
  let ds: DataSource

  const JUNE = new Date('2026-06-10T12:00:00.000Z')
  const JULY = new Date('2026-07-10T12:00:00.000Z')
  const WINDOW = 'from=2026-07-01T00:00:00.000Z&to=2026-07-31T23:59:59.999Z'

  const QUOTE_PHONES = {
    juneNew: '905000000001',
    julyNew: '905000000002',
    julyContacted: '905000000003',
  }

  beforeAll(async () => {
    app = await createE2eApp()
    server = app.getHttpServer()
    ds = app.get(DataSource)
    await resetAdminConfig(app)
    await flushTestRedis(app)

    const login = await request(server)
      .post('/api/auth/login')
      .send({ username: E2E_ADMIN_USERNAME, password: E2E_ADMIN_PASSWORD })
      .expect(201)
    cookie = extractAdminCookie(login.headers['set-cookie'])

    // createdAt açıkça verilir: @CreateDateColumn yalnızca değer yoksa doldurur
    const logs = ds.getRepository(AppLog)
    await logs.save([
      logs.create({ level: 'error', context: 'E2eFilterSeed', message: 'haziran hatası', createdAt: JUNE }),
      logs.create({ level: 'warn', context: 'E2eFilterSeed', message: 'temmuz uyarısı', createdAt: JULY }),
    ])

    const quotes = ds.getRepository(QuoteRequest)
    await quotes.save([
      quotes.create({
        adSoyad: 'E2E Haziran Yeni', telefon: QUOTE_PHONES.juneNew, panelAdeti: 100, sahaMegavati: 1,
        suUlasimi: true, kvkkConsent: true, consentAt: JUNE, status: 'new', createdAt: JUNE,
      }),
      quotes.create({
        adSoyad: 'E2E Temmuz Yeni', telefon: QUOTE_PHONES.julyNew, panelAdeti: 200, sahaMegavati: 2,
        suUlasimi: true, kvkkConsent: true, consentAt: JULY, status: 'new', createdAt: JULY,
      }),
      quotes.create({
        adSoyad: 'E2E Temmuz Arandı', telefon: QUOTE_PHONES.julyContacted, panelAdeti: 300, sahaMegavati: 3,
        suUlasimi: false, kvkkConsent: true, consentAt: JULY, status: 'contacted', createdAt: JULY,
      }),
    ])
  })

  afterAll(async () => {
    await ds.getRepository(AppLog).delete({ context: 'E2eFilterSeed' })
    for (const telefon of Object.values(QUOTE_PHONES)) {
      await ds.getRepository(QuoteRequest).delete({ telefon })
    }
    await app.close()
  })

  describe('GET /api/logs/admin/all', () => {
    it('tarih penceresi yalnızca penceredeki kayıtları döndürür', async () => {
      const res = await request(server)
        .get(`/api/logs/admin/all?${WINDOW}`)
        .set('Cookie', cookie)
        .expect(200)
      const messages = (res.body.logs as AppLog[]).map(l => l.message)
      expect(messages).toContain('temmuz uyarısı')
      expect(messages).not.toContain('haziran hatası')
    })

    it('tarih ve level filtreleri birlikte çalışır', async () => {
      const res = await request(server)
        .get(`/api/logs/admin/all?level=error&${WINDOW}`)
        .set('Cookie', cookie)
        .expect(200)
      const seeded = (res.body.logs as AppLog[]).filter(l => l.context === 'E2eFilterSeed')
      expect(seeded).toHaveLength(0) // penceredeki tek seed kaydı warn
    })

    it('geçersiz tarih 400 döner', async () => {
      await request(server)
        .get('/api/logs/admin/all?from=dun')
        .set('Cookie', cookie)
        .expect(400)
    })
  })

  describe('GET /api/quote/admin/all', () => {
    it('status filtresi yalnızca o statüdeki talepleri döndürür', async () => {
      const res = await request(server)
        .get('/api/quote/admin/all?status=contacted')
        .set('Cookie', cookie)
        .expect(200)
      const phones = (res.body.requests as QuoteRequest[]).map(r => r.telefon)
      expect(phones).toContain(QUOTE_PHONES.julyContacted)
      expect(phones).not.toContain(QUOTE_PHONES.juneNew)
      expect(phones).not.toContain(QUOTE_PHONES.julyNew)
    })

    it('tarih penceresi createdAt üzerinden filtreler, stats global kalır', async () => {
      const res = await request(server)
        .get(`/api/quote/admin/all?${WINDOW}`)
        .set('Cookie', cookie)
        .expect(200)
      const phones = (res.body.requests as QuoteRequest[]).map(r => r.telefon)
      expect(phones).toContain(QUOTE_PHONES.julyNew)
      expect(phones).toContain(QUOTE_PHONES.julyContacted)
      expect(phones).not.toContain(QUOTE_PHONES.juneNew)
      expect(res.body.stats.total).toBeGreaterThanOrEqual(3)
    })

    it('status ve tarih birlikte uygulanır', async () => {
      const res = await request(server)
        .get(`/api/quote/admin/all?status=new&${WINDOW}`)
        .set('Cookie', cookie)
        .expect(200)
      const phones = (res.body.requests as QuoteRequest[]).map(r => r.telefon)
      expect(phones).toEqual([QUOTE_PHONES.julyNew])
    })

    it('ters aralık 400 döner', async () => {
      await request(server)
        .get('/api/quote/admin/all?from=2026-07-31T00:00:00.000Z&to=2026-07-01T00:00:00.000Z')
        .set('Cookie', cookie)
        .expect(400)
    })
  })
})
