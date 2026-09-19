import { NestExpressApplication } from '@nestjs/platform-express'
import request from 'supertest'
import { E2E_ADMIN_PASSWORD, E2E_ADMIN_USERNAME } from './setup-e2e'
import { createE2eApp, extractAdminCookie, flushTestRedis, resetAdminConfig } from './e2e-utils'

// Taslak içerik yalnızca listeden gizlenmekle kalmaz, doğrudan slug URL'inden de
// okunamamalı. Slug blog başlığından deterministik üretildiği için tahmin
// edilebilir; liste gizlemesi tek başına koruma değil.
describe('Unpublished content is not publicly readable (e2e)', () => {
  let app: NestExpressApplication
  let server: ReturnType<NestExpressApplication['getHttpServer']>
  let cookie: string
  let blogId: string

  const BLOG_SLUG = 'e2e-taslak-yazi'

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

    const post = await request(server)
      .post('/api/blog')
      .set('Cookie', cookie)
      .send({ title: 'Taslak yazı', slug: BLOG_SLUG, content: '<p>x</p>', published: false })
      .expect(201)
    blogId = post.body.id
  })

  afterAll(async () => {
    if (blogId) {
      await request(server).delete(`/api/blog/${blogId}`).set('Cookie', cookie)
    }
    await app.close()
  })

  it('hides the draft post from the public list', async () => {
    const res = await request(server).get('/api/blog').expect(200)
    const slugs = (res.body as Array<{ slug: string }>).map(p => p.slug)
    expect(slugs).not.toContain(BLOG_SLUG)
  })

  it('returns 404 for a draft blog post fetched by slug', async () => {
    await request(server).get(`/api/blog/${BLOG_SLUG}`).expect(404)
  })

  it('serves the post by slug once it is published (cache invalidation)', async () => {
    await request(server)
      .patch(`/api/blog/${blogId}`)
      .set('Cookie', cookie)
      .send({ published: true })
      .expect(200)

    const res = await request(server).get(`/api/blog/${BLOG_SLUG}`).expect(200)
    expect(res.body.slug).toBe(BLOG_SLUG)
  })

  it('returns 404 again after the post is unpublished', async () => {
    await request(server)
      .patch(`/api/blog/${blogId}`)
      .set('Cookie', cookie)
      .send({ published: false })
      .expect(200)

    await request(server).get(`/api/blog/${BLOG_SLUG}`).expect(404)
  })
})
