// Tarayıcıdan (client component) backend'e konuşan istekler için taban URL.
// Bu değer her zaman çağıranların path'lerine ("/auth/login" gibi, /api
// önekisiz) doğrudan prepend edilir — boş string DEĞİL, '/api' olmalı.
// Prod'da nginx /api/'yi aynı origin'den backend'e proxy'ler, bu yüzden
// NEXT_PUBLIC_API_URL=/api yeterli. Lokal geliştirmede backend ayrı portta
// (3001) çalıştığı için varsayılan tam origin'dir.
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
