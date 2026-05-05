import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule as NestJWTModule } from '@nestjs/jwt'

@Global()
@Module({
    imports: [
        NestJWTModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get('auth.jwtSecretKey')

                return {
                    secret,
                    signOptions: { expiresIn: '7d' },
                }
            },
            inject: [ConfigService],
        }),
    ],
    exports: [NestJWTModule],
})
export class JwtModule {}
