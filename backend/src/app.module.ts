import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { APP_GUARD, APP_FILTER } from '@nestjs/core'
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup'
import { LoggingMiddleware } from './common/logging.middleware'
import { RedisModule } from './redis/redis.module'
import { PublicCacheModule } from './common/public-cache.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { ReferencesModule } from './references/references.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { BlogModule } from './blog/blog.module'
import { FaqModule } from './faq/faq.module'
import { QuoteModule } from './quote/quote.module'
import { LogsModule } from './logs/logs.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      // Şema aynı zamanda env envanteri: uygulamanın okuduğu her değişken burada
      // listelenir. Boş string ".env'de boş bırakıldı = özellik kapalı" demektir,
      // bu yüzden opsiyonel string'lerde allow('') zorunlu.
      validationSchema: Joi.object({
        // ── Zorunlu ──
        JWT_SECRET: Joi.string().required(),
        APP_ENCRYPTION_KEY: Joi.string().pattern(/^[0-9a-f]{64}$/i).required(),
        DB_PASS: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().uri().required(),
        ADMIN_PASSWORD_HASH: Joi.string().required(),
        UMAMI_PASS: Joi.string().required(),
        // ── Default'lu (kodda kullanılan default'larla birebir aynı; empty('') =
        //    boş bırakılan değişken yazılmamış sayılır, default devreye girer) ──
        NODE_ENV: Joi.string().valid('development', 'production').empty('').default('development'),
        PORT: Joi.number().empty('').default(3001),
        DB_HOST: Joi.string().empty('').default('localhost'),
        DB_PORT: Joi.number().empty('').default(5432),
        DB_USER: Joi.string().empty('').default('postgres'),
        DB_NAME: Joi.string().empty('').default('newtemizlik'),
        JWT_EXPIRES_IN: Joi.string().empty('').default('8h'),
        ADMIN_USERNAME: Joi.string().empty('').default('admin'),
        UMAMI_USER: Joi.string().empty('').default('admin'),
        // ── Opsiyonel (boşsa ilgili özellik devre dışı) ──
        // Virgüllü açık CORS origin listesi; boşsa FRONTEND_URL'den www türetilir
        CORS_ORIGINS: Joi.string().allow('').optional().custom((value: string, helpers) => {
          const bad = value
            .split(',')
            .map((origin) => origin.trim())
            .filter((origin) => origin !== '' && !/^https?:\/\/[^\s,/]+$/.test(origin.replace(/\/+$/, '')))
          if (bad.length > 0) {
            return helpers.message({ custom: `CORS_ORIGINS geçersiz origin içeriyor: ${bad.join(', ')}` })
          }
          return value
        }),
        UMAMI_URL: Joi.string().uri().allow('').optional(),
        UMAMI_WEBSITE_ID: Joi.string().allow('').optional(),
        SENTRY_DSN: Joi.string().allow('').optional(),
        // Boşsa Next.js revalidation webhook'u hiç çağrılmaz (bkz. RevalidationService)
        REVALIDATE_URL: Joi.string().uri().allow('').optional(),
        REVALIDATE_SECRET: Joi.string().allow('').optional(),
      }),
      validationOptions: { allowUnknown: true },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [{ ttl: 60000, limit: 60 }],
        getTracker: (req: { ip?: string; connection?: { remoteAddress?: string } }) =>
          req.ip ?? req.connection?.remoteAddress ?? 'unknown',
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get('DB_USER', 'postgres'),
        password: cfg.get('DB_PASS'),
        database: cfg.get('DB_NAME', 'newtemizlik'),
        autoLoadEntities: true,
        // Şema yalnızca migration'larla yönetilir (Baseline dahil); synchronize asla açılmaz
        synchronize: false,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
    TerminusModule,
    RedisModule,
    PublicCacheModule,
    AuthModule,
    UploadModule,
    ReferencesModule,
    AnalyticsModule,
    BlogModule,
    FaqModule,
    QuoteModule,
    LogsModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: SentryGlobalFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('{*splat}')
  }
}
