import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron } from '@nestjs/schedule'
import { IsNull, Not, Repository } from 'typeorm'
import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { BlogPost } from '../blog/entities/blog-post.entity'
import { Reference } from '../references/entities/reference.entity'
import { UPLOADS_DIR } from './uploaded-files'

// Yükleme sırasında henüz DB'ye bağlanmamış taze dosyaları yanlışlıkla silmemek için pay
const MIN_AGE_MS = 24 * 60 * 60 * 1000

@Injectable()
export class UploadsCleanupService {
  private readonly logger = new Logger(UploadsCleanupService.name)

  constructor(
    @InjectRepository(BlogPost)
    private blogRepo: Repository<BlogPost>,
    @InjectRepository(Reference)
    private referenceRepo: Repository<Reference>,
  ) {}

  // Her Pazar 05:00 — DB'de referansı kalmamış upload dosyalarını temizler
  // (silme akışlarından önce birikmiş eski orphan'lar dahil)
  @Cron('0 5 * * 0')
  async purgeOrphanFiles(): Promise<void> {
    try {
      const deleted = await this.run()
      if (deleted > 0) {
        this.logger.log(`Orphan temizliği: ${deleted} referanssız dosya silindi`)
      }
    } catch (err) {
      this.logger.error(`Orphan temizliği başarısız: ${err instanceof Error ? err.message : err}`)
    }
  }

  async run(now = Date.now()): Promise<number> {
    const referenced = await this.collectReferencedFilenames()
    const entries = await readdir(UPLOADS_DIR)
    let deleted = 0

    for (const name of entries) {
      if (name === '.gitkeep' || referenced.has(name)) continue
      const path = join(UPLOADS_DIR, name)
      try {
        const info = await stat(path)
        if (!info.isFile() || now - info.mtimeMs < MIN_AGE_MS) continue
        await unlink(path)
        deleted++
      } catch {
        // Yarış durumunda (dosya bu arada silindi vb.) sessizce geç
      }
    }
    return deleted
  }

  // NOT: blog içeriğine (Tiptap) gömülü resimler henüz taranmıyor — sadece
  // coverImage/logo kolonları. Editöre görsel ekleme desteği eklenince
  // (bkz. plan Faz 4) content HTML'inden /uploads/ referansları da buraya eklenmeli.
  private async collectReferencedFilenames(): Promise<Set<string>> {
    const [posts, references] = await Promise.all([
      this.blogRepo.find({ select: ['coverImage'], where: { coverImage: Not(IsNull()) } }),
      this.referenceRepo.find({ select: ['logo'], where: { logo: Not(IsNull()) } }),
    ])

    const referenced = new Set<string>()
    const add = (src: string | null) => {
      const match = src && /^\/uploads\/(.+)$/.exec(src)
      if (match) referenced.add(match[1])
    }
    posts.forEach(p => add(p.coverImage))
    references.forEach(r => add(r.logo))
    return referenced
  }
}
