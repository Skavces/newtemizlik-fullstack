import { ConfigService } from '@nestjs/config'
import { AnalyticsService } from '../analytics.service'
import { fetchWithTimeout } from '../../common/fetch-with-timeout'

jest.mock('../../common/fetch-with-timeout')

const mockFetch = fetchWithTimeout as jest.MockedFunction<typeof fetchWithTimeout>

const CONFIG_VALUES: Record<string, string> = {
  UMAMI_URL: 'http://umami:3000',
  UMAMI_WEBSITE_ID: 'site-1',
  UMAMI_USER: 'admin',
  UMAMI_PASS: 'pass',
}

function makeService(): AnalyticsService {
  const config = {
    get: (key: string, def?: string) => CONFIG_VALUES[key] ?? def,
  } as unknown as ConfigService
  return new AnalyticsService(config)
}

function jsonResponse(status: number, body: unknown = {}): Response {
  return { ok: status < 400, status, json: async () => body } as unknown as Response
}

function isLogin(call: [string | URL | Request, ...unknown[]]): boolean {
  return String(call[0]).includes('/api/auth/login')
}

describe('AnalyticsService — Umami token yenileme', () => {
  beforeEach(() => mockFetch.mockReset())

  // Umami 3.1.0'ın gerçek /stats şekli: düz sayılar + comparison — bkz.
  // UmamiRawStats yorumu (Faz 5, canlı doğrulama).
  const RAW_STATS = { pageviews: 1, visitors: 1, visits: 1, bounces: 0, totaltime: 0 }

  it('caches the token across calls', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(200, { token: 't1' })) // login
      .mockResolvedValue(jsonResponse(200, RAW_STATS))

    const service = makeService()
    await service.getStats(0, 1)
    await service.getStats(0, 1)

    expect(mockFetch.mock.calls.filter(isLogin)).toHaveLength(1)
  })

  it('drops the cached token on 401 and retries once with a fresh one', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(200, { token: 'eski' })) // ilk login
      .mockResolvedValueOnce(jsonResponse(401)) // Umami restart: token geçersiz
      .mockResolvedValueOnce(jsonResponse(200, { token: 'yeni' })) // yeniden login
      .mockResolvedValueOnce(jsonResponse(200, { ...RAW_STATS, pageviews: 5 }))

    const service = makeService()
    const stats = await service.getStats(0, 1)

    expect(stats?.pageviews).toEqual({ value: 5, change: 100 })
    expect(mockFetch.mock.calls.filter(isLogin)).toHaveLength(2)
    const lastCall = mockFetch.mock.calls[3]
    expect((lastCall[1]?.headers as Record<string, string>).Authorization).toBe('Bearer yeni')
  })

  it('single-flights concurrent calls into one login request', async () => {
    let resolveLogin!: (r: Response) => void
    mockFetch
      .mockImplementationOnce(() => new Promise<Response>(res => { resolveLogin = res }))
      .mockResolvedValue(jsonResponse(200, RAW_STATS))

    const service = makeService()
    // İki istek login henüz sonuçlanmadan başlar; tek login atılmalı
    const both = Promise.all([service.getStats(0, 1), service.getStats(0, 1)])
    await new Promise(r => setImmediate(r))
    resolveLogin(jsonResponse(200, { token: 't1' }))
    await both

    expect(mockFetch.mock.calls.filter(isLogin)).toHaveLength(1)
  })

  it('does not keep a failed login stuck in the single-flight cache', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('umami down')) // ilk login patlar
      .mockResolvedValueOnce(jsonResponse(200, { token: 't1' })) // ikinci login
      .mockResolvedValue(jsonResponse(200, RAW_STATS))

    const service = makeService()
    await expect(service.getStats(0, 1)).resolves.toBeNull() // hata yutulur
    await expect(service.getStats(0, 1)).resolves.not.toBeNull() // yeni login denenir

    expect(mockFetch.mock.calls.filter(isLogin)).toHaveLength(2)
  })

  it('gives up after one retry when the API keeps returning 401', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(200, { token: 't1' }))
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(jsonResponse(200, { token: 't2' }))
      .mockResolvedValueOnce(jsonResponse(401))

    const service = makeService()
    // getStats hatayı yutup null döner; sonsuz retry döngüsü olmamalı
    await expect(service.getStats(0, 1)).resolves.toBeNull()
    expect(mockFetch).toHaveBeenCalledTimes(4)
  })
})

// Faz 5: canlı Umami 3.1.0'a karşı doğrulanırken /stats'ın gerçek şeklinin
// {value,change} değil, düz sayılar + comparison olduğu ortaya çıktı (bkz.
// analytics.service.ts'teki UmamiRawStats yorumu). Bu blok normalizasyonun
// (getStats → toStat) doğruluğunu test eder.
describe('AnalyticsService — stats normalizasyonu', () => {
  beforeEach(() => mockFetch.mockReset())

  function mockRawStats(overrides: Record<string, number> = {}, comparison?: Record<string, number>): void {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(200, { token: 't1' }))
      .mockResolvedValueOnce(
        jsonResponse(200, {
          pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0,
          ...overrides,
          ...(comparison !== undefined ? { comparison } : {}),
        }),
      )
  }

  it('computes a percentage change against the comparison period', async () => {
    mockRawStats({ pageviews: 150 }, { pageviews: 100, visitors: 0, visits: 0, bounces: 0, totaltime: 0 })
    const stats = await makeService().getStats(0, 1)
    expect(stats?.pageviews).toEqual({ value: 150, change: 50 })
  })

  it('reports +100% when the previous period had zero and now there is traffic', async () => {
    mockRawStats({ pageviews: 10 }, { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 })
    const stats = await makeService().getStats(0, 1)
    expect(stats?.pageviews).toEqual({ value: 10, change: 100 })
  })

  it('reports 0% when both periods have zero traffic', async () => {
    mockRawStats({ pageviews: 0 }, { pageviews: 0, visitors: 0, visits: 0, bounces: 0, totaltime: 0 })
    const stats = await makeService().getStats(0, 1)
    expect(stats?.pageviews).toEqual({ value: 0, change: 0 })
  })

  it('treats a missing comparison object as an all-zero previous period', async () => {
    mockRawStats({ pageviews: 5 }) // comparison hiç yok
    const stats = await makeService().getStats(0, 1)
    expect(stats?.pageviews).toEqual({ value: 5, change: 100 })
  })
})
