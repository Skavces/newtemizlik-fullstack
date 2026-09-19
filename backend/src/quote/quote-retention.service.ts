import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron } from '@nestjs/schedule'
import { Repository } from 'typeorm'
import { QuoteRequest } from './entities/quote-request.entity'

// KVKK aydınlatma metninde taahhüt edilen saklama süresi — frontend'deki KVKK
// sayfasıyla senkron tutulmalı
export const RETENTION_INTERVAL = '12 months'

// Satır silinmez, yalnızca kişisel veri (ad/telefon/e-posta) null'lanır;
// böylece durum istatistikleri (new/contacted/won/lost) korunur.
@Injectable()
export class QuoteRetentionService {
  private readonly logger = new Logger(QuoteRetentionService.name)

  constructor(
    @InjectRepository(QuoteRequest)
    private repo: Repository<QuoteRequest>,
  ) {}

  // Log retention 04:30'da çalışıyor; çakışmayı önlemek için 05:00
  @Cron('0 5 * * *')
  async purgeOldRequests(): Promise<void> {
    try {
      const result = await this.repo
        .createQueryBuilder()
        .update()
        .set({ adSoyad: null, telefon: null, ePosta: null })
        .where('"createdAt" < now() - :retention::interval', { retention: RETENTION_INTERVAL })
        .andWhere('"adSoyad" IS NOT NULL')
        .execute()
      const affected = result.affected ?? 0
      if (affected > 0) {
        this.logger.log(`KVKK temizliği: ${affected} teklif talebi anonimleştirildi`)
      }
    } catch (err) {
      this.logger.error(`KVKK temizliği başarısız: ${err instanceof Error ? err.message : err}`)
    }
  }
}
