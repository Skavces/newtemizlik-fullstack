// Tarayıcıdan (client component) backend'e konuşan istekler için taban URL.
// Prod'da nginx /api/'yi aynı origin'den backend'e proxy'ler — bu durumda
// NEXT_PUBLIC_API_URL='' set edilir (relative /api yeterli). Lokal
// geliştirmede backend ayrı portta (3001) çalıştığı için varsayılan odur.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
