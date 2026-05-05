import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserSession, UserRole } from '@/common/schema'
import { NSRequest } from '@/common/types'
import { randomUUID } from 'crypto'
import { Response, NextFunction } from 'express'
import Sentry from '@/config/sentry.config'

export const CORRELATION_ID_HEADER = 'X-Correlation-Id'

type JWTPayload = {
    id: number
    role: UserRole
    username: string
    name: string
    org_id?: number
    org_role?: UserRole
}

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    private readonly $logger = new Logger(RequestMiddleware.name)

    constructor(
        private readonly $envConfig: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async use(request: NSRequest, response: Response, next: NextFunction) {
        const correlationId = request.header(CORRELATION_ID_HEADER) || randomUUID()

        request.startTime = Date.now()
        request.correlationId = correlationId

        const bearerToken = request.headers.authorization || ''
        const token = bearerToken.split(' ')[1]

        if (token?.startsWith('kujtk_')) {
            // TODO: resolver service token cuando exista el módulo
            request.user = null
        } else if (token) {
            request.user = await this.setJWTSession(token)
            if (request.user) Sentry.setContext('user', request.user)
        } else {
            request.user = null
        }

        response.set(CORRELATION_ID_HEADER, correlationId)
        Sentry.setExtra('CorrelationID', correlationId)

        next()
    }

    private async setJWTSession(token: string): Promise<UserSession | null> {
        try {
            const secretJWTToken = this.$envConfig.get('auth.jwtSecretKey')

            const user: JWTPayload = await this.jwtService.verifyAsync(token, {
                secret: secretJWTToken,
            })

            if (user) {
                return {
                    id: user.id,
                    type: 'jwt',
                    role: user.role,
                    username: user.username,
                    name: user.name,
                    org_id: user.org_id,
                    org_role: user.org_role,
                }
            }

            return null
        } catch (error) {
            this.$logger.error('Error verifying JWT Session', error)
            return null
        }
    }
}
