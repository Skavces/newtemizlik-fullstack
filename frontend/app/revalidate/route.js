import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'

// Backend'in yazma anında çağırdığı webhook ucu (bkz. Faz 3 planı,
// backend/src/common/revalidation.service.ts). /api/ altında DEĞİL: prod'da
// nginx /api/'yi backend'e yönlendiriyor (Faz 7), bu yol Next'e ait kalmalı.
const ALLOWED_TAGS = ['blog', 'faq', 'references']

function isAuthorized(request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false

  const provided = request.headers.get('x-revalidate-secret') || ''
  const expected = Buffer.from(secret)
  const actual = Buffer.from(provided)
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

export async function POST(request) {
  if (!process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'REVALIDATE_SECRET yapılandırılmamış' }, { status: 503 })
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Geçersiz JSON gövdesi' }, { status: 400 })
  }

  const requested = Array.isArray(body?.tags) ? body.tags : []
  const tags = requested.includes('all') ? ALLOWED_TAGS : requested

  if (tags.length === 0 || tags.some((t) => !ALLOWED_TAGS.includes(t))) {
    return Response.json(
      { error: `Geçersiz etiket. İzin verilenler: ${ALLOWED_TAGS.join(', ')}, all` },
      { status: 400 },
    )
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }

  return Response.json({ revalidated: true, tags })
}

export async function GET() {
  return Response.json({ error: 'Method Not Allowed' }, { status: 405 })
}
