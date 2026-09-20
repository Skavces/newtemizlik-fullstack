import { PublicCacheService } from '../public-cache.service'
import { RevalidationService } from '../revalidation.service'

describe('PublicCacheService', () => {
  afterEach(() => jest.restoreAllMocks())

  it('serves the cached value within the TTL without re-running fn', async () => {
    const cache = new PublicCacheService()
    const fn = jest.fn().mockResolvedValue('değer')
    await expect(cache.wrap('blog:list', fn)).resolves.toBe('değer')
    await expect(cache.wrap('blog:list', fn)).resolves.toBe('değer')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('re-runs fn after the TTL expires', async () => {
    let now = 1_000_000
    jest.spyOn(Date, 'now').mockImplementation(() => now)
    const cache = new PublicCacheService()
    const fn = jest.fn().mockResolvedValue('değer')

    await cache.wrap('blog:list', fn)
    now += 59_000
    await cache.wrap('blog:list', fn)
    expect(fn).toHaveBeenCalledTimes(1)

    now += 2_000 // toplam 61sn
    await cache.wrap('blog:list', fn)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('bust removes only keys matching the prefix', async () => {
    const cache = new PublicCacheService()
    const blogFn = jest.fn().mockResolvedValue('blog')
    const faqFn = jest.fn().mockResolvedValue('faq')
    await cache.wrap('blog_posts:list', blogFn)
    await cache.wrap('blog_posts:slug:x', blogFn)
    await cache.wrap('faq:list', faqFn)

    cache.bust('blog_posts')

    await cache.wrap('blog_posts:list', blogFn)
    await cache.wrap('blog_posts:slug:x', blogFn)
    await cache.wrap('faq:list', faqFn)
    expect(blogFn).toHaveBeenCalledTimes(4) // 2 ilk + 2 bust sonrası
    expect(faqFn).toHaveBeenCalledTimes(1) // bust'tan etkilenmedi
  })

  it('bust bir tablonun önek olduğu başka bir tabloyu düşürmez ("blog" vs "blog_posts")', async () => {
    const cache = new PublicCacheService()
    const shortTableFn = jest.fn().mockResolvedValue('kısa')
    await cache.wrap('blog:list', shortTableFn)

    // "blog_posts" tablosunu bust etmek, adı "blog" ile başlayan farklı bir
    // tabloyu (varsayımsal) yanlışlıkla düşürmemeli — sınır ":" ile net olmalı.
    cache.bust('blog_posts')

    await cache.wrap('blog:list', shortTableFn)
    expect(shortTableFn).toHaveBeenCalledTimes(1)
  })

  it('does not cache when fn throws (NotFound anahtarları birikmez)', async () => {
    const cache = new PublicCacheService()
    const fn = jest.fn().mockRejectedValueOnce(new Error('yok')).mockResolvedValue('artık var')
    await expect(cache.wrap('projects:slug:yok', fn)).rejects.toThrow('yok')
    await expect(cache.wrap('projects:slug:yok', fn)).resolves.toBe('artık var')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('bust, RevalidationService.notify\'ı bust edilen prefix ile çağırır', async () => {
    const revalidation = { notify: jest.fn() } as unknown as RevalidationService
    const cache = new PublicCacheService(revalidation)
    cache.bust('blog_posts')
    expect(revalidation.notify).toHaveBeenCalledWith('blog_posts')
  })

  it('RevalidationService verilmeden bust çağrılırsa hata fırlatmaz', () => {
    const cache = new PublicCacheService()
    expect(() => cache.bust('blog_posts')).not.toThrow()
  })
})
