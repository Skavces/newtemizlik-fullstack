// redirects.mjs için tipler (next.config.mjs düz JS olduğu için veri .mjs'de duruyor).
export interface LegacyRedirect {
  source: string
  destination: string
  statusCode: 301
}
export const LEGACY_SERVICE_IDS: Record<number, string>
export const LEGACY_BLOG_IDS: Record<number, string>
export const MIGRATED_BLOG_SLUGS: string[]
export const STATIC_REDIRECTS: [string, string][]
export function legacyRedirects(): LegacyRedirect[]
