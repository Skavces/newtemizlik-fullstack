// Backend'in kendisi, /api soneki olmadan — lib/api.ts'teki API_URL ile aynı
// kaynağı paylaşır. Prod'da nginx /uploads/'i zaten aynı origin'den backend'e
// proxy'ler (bkz. Faz 7 planı); bu rewrite sadece lokal geliştirmede Next'in
// next/image loader'ının backend'e (ayrı port) ulaşabilmesi için var.
const BACKEND_ORIGIN = (process.env.API_URL || 'http://localhost:3001/api').replace(/\/api$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker için minimal, self-contained bir runtime üretir (frontend/Dockerfile
  // bunu .next/standalone + .next/static + public olarak kopyalar).
  output: 'standalone',
  images: {
    // AVIF kaldırıldı: VPS'te sharp'ın AVIF encode'u görsel başına 3-4+ saniye
    // sürüyor (WebP'nin ~7 katı); bir sayfada çok sayıda görsel eşzamanlı istendiğinde
    // (ör. Referanslarımız'daki logo grid'i) kuyruklama nginx'in proxy_read_timeout'unu
    // aşıp 504'e düşüyor ve görsel kalıcı olarak boş kalıyordu (bkz. next_cache volume
    // commit'i). WebP tek başına hem hızlı hem de hâlâ iyi bir sıkıştırma sağlıyor.
    formats: ['image/webp'],
  },
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: `${BACKEND_ORIGIN}/uploads/:path*` }]
  },
}

export default nextConfig
