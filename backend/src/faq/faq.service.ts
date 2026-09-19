import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { Faq, FaqScope } from './entities/faq.entity'
import { BaseContentService } from '../common/base-content.service'
import { PublicCacheService } from '../common/public-cache.service'

@Injectable()
export class FaqService extends BaseContentService<Faq> {
  protected readonly entityClass = Faq
  protected readonly notFoundMessage = 'SSS bulunamadı'

  constructor(@InjectRepository(Faq) repo: Repository<Faq>, cache: PublicCacheService) {
    super(repo, cache)
  }

  // SSS eklenme sırasıyla okunur (en eski üstte)
  protected defaultOrder(): FindManyOptions<Faq>['order'] {
    return { sortOrder: 'ASC', createdAt: 'ASC' }
  }

  // scope verilmezse tüm yayındaki S.S.S.'ler döner (ör. /sss sayfası); verilirse
  // yalnızca o hizmet sayfasına ait olanlar — cache anahtarı scope'a göre ayrılır.
  findAllPublicByScope(scope?: FaqScope): Promise<Faq[]> {
    return this.cache.wrap(this.cacheKey(`list:${scope ?? 'all'}`), () =>
      this.repo.find({
        where: scope ? { published: true, scope } : { published: true },
        order: this.defaultOrder(),
      }),
    )
  }
}
