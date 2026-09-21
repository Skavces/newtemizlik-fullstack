// Backend'in kendisi, /api soneki olmadan — lib/api.ts'teki API_URL ile aynı
// kaynağı paylaşır. Prod'da nginx /uploads/'i zaten aynı origin'den backend'e
// proxy'ler (bkz. Faz 7 planı); bu rewrite sadece lokal geliştirmede Next'in
// next/image loader'ının backend'e (ayrı port) ulaşabilmesi için var.
const BACKEND_ORIGIN = (process.env.API_URL || 'http://localhost:3001/api').replace(/\/api$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: `${BACKEND_ORIGIN}/uploads/:path*` }]
  },
}

export default nextConfig
