import { Global, Module } from '@nestjs/common'
import { PublicCacheService } from './public-cache.service'
import { RevalidationService } from './revalidation.service'

// RedisModule gibi global: içerik servisleri ve mutasyon yapan her yer
// (media, Instagram importu) modül importu olmadan inject edebilsin
@Global()
@Module({
  providers: [PublicCacheService, RevalidationService],
  exports: [PublicCacheService, RevalidationService],
})
export class PublicCacheModule {}
