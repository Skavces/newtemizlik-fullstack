declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    // Umami script.js window'a bunu ekler; script hiç yüklenmediyse (env eksikse)
    // undefined kalır.
    umami?: { track: (name: string, data?: Record<string, unknown>) => void }
  }
}

// Faz 5: tek çağrı noktası hem GA4'e hem Umami'ye gönderir — çağıran 7 yer
// (WhatsAppButton, Contact, Hero, Footer, TrackedLink) bundan habersiz kalır.
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
  if (typeof window !== 'undefined' && typeof window.umami?.track === 'function') {
    window.umami.track(name, params)
  }
}
