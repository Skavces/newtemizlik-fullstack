import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { fetchWithTimeout } from './fetch-with-timeout'

// PublicCacheService.bust(tableName) prefix'ini Next.js cache tag'ine çevirir.
const TABLE_TO_TAG: Record<string, string> = {
  blog_posts: 'blog',
  faqs: 'faq',
  references: 'references',
}

@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name)

  constructor(private config: ConfigService) {}

  // Fire-and-forget: revalidation webhook'unun başarısız olması admin'in
  // yazma isteğini asla düşürmemeli. Next tarafı zaten kendi 3600sn'lik
  // time-based revalidation'ına düşer, bu sadece "anında" tazelemeyi sağlar.
  notify(tableName: string): void {
    const tag = TABLE_TO_TAG[tableName]
    if (!tag) return

    const url = this.config.get<string>('REVALIDATE_URL')
    const secret = this.config.get<string>('REVALIDATE_SECRET')
    if (!url || !secret) return

    fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags: [tag] }),
    }, 5000)
      .then((res) => {
        if (!res.ok) this.logger.warn(`Revalidation webhook ${res.status} döndü (tag=${tag})`)
      })
      .catch((err) => this.logger.warn(`Revalidation webhook başarısız (tag=${tag}):`, err))
  }
}
