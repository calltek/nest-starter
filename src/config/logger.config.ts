import { NSRequest } from '@/common/types'

/**
 * Pino options used by `LoggerModule.forRoot(loggerConfig)` in the AppModule.
 * Drives every `Logger` instance injected via `@nestjs/common` inside the app.
 */
export const loggerConfig = {
    pinoHttp: {
        level: process.env.VERBOSE?.toLowerCase() === 'true' ? 'debug' : 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                messageKey: 'message',
            },
        },
        messageKey: 'message',

        customProps: (req: NSRequest) => {
            return {
                correlationId: req.correlationId,
                query: Object.keys(req.query).length > 0 ? req.query : undefined,
            }
        },
        autoLogging: false,
        serializers: {
            req: () => undefined,
            res: () => undefined,
        },
    },
}
