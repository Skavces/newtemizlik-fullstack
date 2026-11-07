import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { E2E_ADMIN_PASSWORD, E2E_ADMIN_USERNAME } from './setup-e2e'
import { createE2eApp, extractAdminCookie, flushTestRedis, resetAdminConfig } from './e2e-utils'
import { QuoteRequest } from '../src/quote/entities/quote-request.entity'

// Teklif formu iki hatlı: hizmet slug'ına göre GES (panel adedi, su) veya
// temizlik (opsiyonel m²) alanları doğrulanır/kaydedilir. hizmet gönderilmeyen
// istek eski GES form sözleşmesiyle (panel + su zorunlu) kabul edilir.
const NAME = 'E2E Hizmet Testi'

const BASE = {
  adSoyad: NAME,
  telefon: '0555 111 22 33',
  lokasyon: 'Soma, Manisa',
  kvkkConsent: true,
}

describe('Quote requests per service (e2e)', () => {
  let app: NestExpressApplication
  let server: ReturnType<NestExpressApplication['getHttpServer']>
  let ds: DataSource

  const repo = () => ds.getRepository(QuoteRequest)

  beforeAll(async () => {
    app = await createE2eApp()
    server = app.getHttpServer()
    ds = app.get(DataSource)
    await resetAdminConfig(app)
  })

  // POST /quote dakikada 10 istekle sınırlı ve throttler sayacı bellek içinde,
  // istemci IP'sine göre (trust proxy=1 → X-Forwarded-For). Her istek ayrı bir
  // IP'den gelir ki senaryolar birbirinin kotasını yemesin; limitin kendisi
  // quote.e2e-spec.ts'te ayrıca test ediliyor.
  let ipCounter = 0
  const post = () => request(server).post('/api/quote').set('X-Forwarded-For', `10.77.0.${++ipCounter}`)

  afterAll(async () => {
    await repo().delete({ adSoyad: NAME })
    await app.close()
  })

  async function postOk(body: Record<string, unknown>): Promise<QuoteRequest> {
    const res = await post().send({ ...BASE, ...body }).expect(201)
    const saved = await repo().findOne({ where: { id: res.body.id } })
    if (!saved) throw new Error('kayıt bulunamadı')
    return saved
  }

  describe('eski GES formu (hizmet yok)', () => {
    it('panel + su ile kabul edilir, hizmet NULL kaydedilir', async () => {
      const saved = await postOk({ panelAdeti: 120, suUlasimi: true })
      expect(saved.hizmet).toBeNull()
      expect(saved.panelAdeti).toBe(120)
      expect(saved.suUlasimi).toBe(true)
    })

    it('panel adedi yoksa 400', async () => {
      await post().send({ ...BASE, suUlasimi: true }).expect(400)
    })

    it('su erişimi yoksa 400', async () => {
      await post().send({ ...BASE, panelAdeti: 10 }).expect(400)
    })
  })

  describe('GES hizmetleri', () => {
    it('panel-temizlik: panel + su ile kabul edilir', async () => {
      const saved = await postOk({ hizmet: 'panel-temizlik', panelAdeti: 500, suUlasimi: false })
      expect(saved.hizmet).toBe('panel-temizlik')
      expect(saved.panelAdeti).toBe(500)
      expect(saved.suUlasimi).toBe(false)
      expect(saved.metrekare).toBeNull()
    })

    it('panel-temizlik: su erişimi yoksa 400', async () => {
      await post().send({ ...BASE, hizmet: 'panel-temizlik', panelAdeti: 10 }).expect(400)
    })

    it('robot-satisi: su sorulmaz, panel adedi yeterli', async () => {
      const saved = await postOk({ hizmet: 'robot-satisi', panelAdeti: 2000 })
      expect(saved.hizmet).toBe('robot-satisi')
      expect(saved.suUlasimi).toBeNull()
    })

    it('ot-temizligi: panel adedi yoksa 400', async () => {
      await post().send({ ...BASE, hizmet: 'ot-temizligi' }).expect(400)
    })

    it('GES talebine gönderilen m² kaydedilmez', async () => {
      const saved = await postOk({ hizmet: 'panel-bakim', panelAdeti: 50, metrekare: 300 })
      expect(saved.metrekare).toBeNull()
    })
  })

  describe('temizlik hizmetleri', () => {
    it('m² olmadan kabul edilir; GES alanları boş kalır', async () => {
      const saved = await postOk({ hizmet: 'koltuk-yikama' })
      expect(saved.hizmet).toBe('koltuk-yikama')
      expect(saved.panelAdeti).toBeNull()
      expect(saved.suUlasimi).toBeNull()
      expect(saved.metrekare).toBeNull()
    })

    it('m² ile kabul edilir ve kaydedilir', async () => {
      const saved = await postOk({ hizmet: 'ev-temizligi', metrekare: 140 })
      expect(saved.metrekare).toBe(140)
    })

    it('temizlik talebine gönderilen panel/su alanları kaydedilmez', async () => {
      const saved = await postOk({ hizmet: 'ofis-is-yeri-temizligi', panelAdeti: 99, suUlasimi: true })
      expect(saved.panelAdeti).toBeNull()
      expect(saved.suUlasimi).toBeNull()
    })

    it('geçersiz m² (0) 400', async () => {
      await post().send({ ...BASE, hizmet: 'ev-temizligi', metrekare: 0 }).expect(400)
    })
  })

  it('katalogda olmayan hizmet 400', async () => {
    await post().send({ ...BASE, hizmet: 'uzay-temizligi', panelAdeti: 1, suUlasimi: true }).expect(400)
  })

  describe('admin kategori filtresi', () => {
    let cookie: string

    beforeAll(async () => {
      await flushTestRedis(app)
      const login = await request(server)
        .post('/api/auth/login')
        .send({ username: E2E_ADMIN_USERNAME, password: E2E_ADMIN_PASSWORD })
        .expect(201)
      cookie = extractAdminCookie(login.headers['set-cookie'])
    })

    async function listHizmet(query: string): Promise<(string | null)[]> {
      const res = await request(server).get(`/api/quote/admin/all?${query}`).set('Cookie', cookie).expect(200)
      return (res.body.requests as QuoteRequest[]).filter(r => r.adSoyad === NAME).map(r => r.hizmet)
    }

    it('kategori=temizlik yalnızca temizlik taleplerini döndürür', async () => {
      const hizmetler = await listHizmet('kategori=temizlik')
      expect(hizmetler.length).toBeGreaterThan(0)
      expect(hizmetler.every(h => h && ['koltuk-yikama', 'ev-temizligi', 'ofis-is-yeri-temizligi'].includes(h))).toBe(true)
    })

    it('kategori=ges GES taleplerini ve hizmetsiz eski kayıtları döndürür', async () => {
      const hizmetler = await listHizmet('kategori=ges')
      expect(hizmetler).toContain(null)
      expect(hizmetler).toContain('panel-temizlik')
      expect(hizmetler).not.toContain('koltuk-yikama')
    })

    it('geçersiz kategori filtre uygulamaz', async () => {
      const hizmetler = await listHizmet('kategori=xyz')
      expect(hizmetler).toContain(null)
      expect(hizmetler).toContain('koltuk-yikama')
    })
  })
})
