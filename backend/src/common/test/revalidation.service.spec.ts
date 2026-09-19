import { ConfigService } from '@nestjs/config'
import { RevalidationService } from '../revalidation.service'
import { fetchWithTimeout } from '../fetch-with-timeout'

jest.mock('../fetch-with-timeout')

const mockFetch = fetchWithTimeout as jest.MockedFunction<typeof fetchWithTimeout>

function makeService(config: Record<string, string> = {}): RevalidationService {
  const cfg = { get: (key: string) => config[key] } as unknown as ConfigService
  return new RevalidationService(cfg)
}

function okResponse(): Response {
  return { ok: true, status: 200 } as unknown as Response
}

describe('RevalidationService', () => {
  beforeEach(() => mockFetch.mockReset())

  it('bilinen bir tabloda REVALIDATE_URL/SECRET tanımlıysa webhook\'u doğru gövdeyle çağırır', async () => {
    mockFetch.mockResolvedValue(okResponse())
    const service = makeService({ REVALIDATE_URL: 'http://next:3000/revalidate', REVALIDATE_SECRET: 's3cret' })

    service.notify('blog_posts')
    await Promise.resolve() // fire-and-forget promise'inin flush olması için

    expect(mockFetch).toHaveBeenCalledWith(
      'http://next:3000/revalidate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-revalidate-secret': 's3cret' }),
        body: JSON.stringify({ tags: ['blog'] }),
      }),
      5000,
    )
  })

  it('faqs -> faq, references -> references etiketine eşlenir', async () => {
    mockFetch.mockResolvedValue(okResponse())
    const service = makeService({ REVALIDATE_URL: 'http://next:3000/revalidate', REVALIDATE_SECRET: 's' })

    service.notify('faqs')
    service.notify('references')
    await Promise.resolve()

    expect(mockFetch).toHaveBeenNthCalledWith(1, expect.anything(), expect.objectContaining({ body: JSON.stringify({ tags: ['faq'] }) }), 5000)
    expect(mockFetch).toHaveBeenNthCalledWith(2, expect.anything(), expect.objectContaining({ body: JSON.stringify({ tags: ['references'] }) }), 5000)
  })

  it('bilinmeyen tablo adında webhook çağırmaz', () => {
    const service = makeService({ REVALIDATE_URL: 'http://next:3000/revalidate', REVALIDATE_SECRET: 's' })
    service.notify('unknown_table')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('REVALIDATE_URL veya REVALIDATE_SECRET eksikse webhook çağırmaz', () => {
    makeService({ REVALIDATE_SECRET: 's' }).notify('blog_posts')
    makeService({ REVALIDATE_URL: 'http://next:3000/revalidate' }).notify('blog_posts')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('fetch reddedilirse hata fırlatmaz (fire-and-forget)', async () => {
    mockFetch.mockRejectedValue(new Error('ağ hatası'))
    const service = makeService({ REVALIDATE_URL: 'http://next:3000/revalidate', REVALIDATE_SECRET: 's' })

    expect(() => service.notify('blog_posts')).not.toThrow()
    await Promise.resolve()
    await Promise.resolve()
  })
})
