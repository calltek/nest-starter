import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { LoggerModule } from 'nestjs-pino'
import { SentryModule } from '@sentry/nestjs/setup'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { ScheduleModule } from '@nestjs/schedule'

import { cacheConfig, loggerConfig, settingsConfig } from '@/config'

// Controllers
import { AppController } from './app.controller'

// Providers
import { PrismaModule } from '@/providers/prisma'
import { JwtModule } from '@/providers/jwt'

// Auth
import { PermissionGuard } from '@/common/guards'

// Middleware
import { RequestMiddleware } from '@/common/middlewares'

@Module({
    imports: [
        ConfigModule.forRoot(settingsConfig),
        ScheduleModule.forRoot(),
        LoggerModule.forRoot(loggerConfig),

        // VENDOR
        CacheModule.registerAsync(cacheConfig),
        SentryModule.forRoot(),
        JwtModule,
        PrismaModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestMiddleware).forRoutes('*')
    }
}
