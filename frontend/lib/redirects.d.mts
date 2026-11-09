// redirects.mjs için tipler (next.config.mjs düz JS olduğu için veri .mjs'de duruyor).
export interface LegacyRedirect {
  source: string
  destination: string
  statusCode: 301
}
export declare const LEGACY_SERVICE_IDS: Record<number, string>
export declare const LEGACY_BLOG_IDS: Record<number, string>
export declare const MIGRATED_BLOG_SLUGS: string[]
export declare const STATIC_REDIRECTS: [string, string][]
export declare function legacyRedirects(): LegacyRedirect[]
