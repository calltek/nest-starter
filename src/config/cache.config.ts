import { CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createKeyv } from '@keyv/redis'

/**
 * cache-manager v7 + Keyv adapter.
 * `cache-manager-redis-store` was removed in v3 of `@nestjs/cache-manager`;
 * Redis is now wired up via `@keyv/redis` as a Keyv store.
 */
export const cacheConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const redis = configService.get<{ host: string; port: number }>('redis')
        const url = `redis://${redis?.host}:${redis?.port}`

        return {
            stores: [createKeyv(url)],
        }
    },
}
