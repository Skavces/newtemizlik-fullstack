// Next'in derlenmiş path-to-regexp kopyası tip dosyası taşımıyor; redirects.test.ts
// yalnızca pathToRegexp'i kullanıyor.
declare module 'next/dist/compiled/path-to-regexp' {
  export function pathToRegexp(path: string, keys?: unknown[], options?: object): RegExp
}
