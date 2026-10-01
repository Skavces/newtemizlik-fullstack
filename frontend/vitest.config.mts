import { defineConfig } from 'vitest/config'

// Next.js kendi derlemesini kullanmaya devam ediyor (next build); bu sadece
// lib/ altındaki saf fonksiyonları (JSX/Next runtime'ı gerektirmeyen) Vitest
// ile test etmek için ayrı, minimal bir yapılandırma.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
})
