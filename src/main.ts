import 'dotenv/config'
import '@/config/sentry.config'

import { NSExceptionFilter } from '@/common/exceptions'
import { INestApplication, Logger as NestLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import figlet from 'figlet'
import { AppModule } from './app.module'
import { initSwagger } from './app.swagger'
import { Logger } from 'nestjs-pino'
import cors from 'cors'
import { urlencoded, json, static as st } from 'express'
import * as path from 'path'

let app: INestApplication

async function bootstrap() {
    app = await NestFactory.create(AppModule, { bufferLogs: true })

    const port = process.env.PORT || 5050

    app.use(json())
    app.use(urlencoded({ extended: true }))

    // Logger
    app.useLogger(app.get(Logger))

    // Setup swagger
    initSwagger(app)

    // Validations
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

    // Exceptions
    app.useGlobalFilters(new NSExceptionFilter())

    // Use app with class-validator
    useContainer(app.select(AppModule), { fallbackOnErrors: true })

    // Graceful shutdown — fires OnModuleDestroy on every provider (e.g. PrismaService.$disconnect())
    app.enableShutdownHooks()

    // CORS — allow FRONTEND_URL plus any localhost port for dev
    const frontendUrl = process.env.FRONTEND_URL
    app.use(
        cors({
            credentials: true,
            origin: [
                ...(frontendUrl ? [frontendUrl] : []),
                /^http:\/\/localhost(:\d+)?$/,
            ],
        })
    )

    app.use('/swagger', st(path.join(__dirname, '../swagger.json')))

    await app
        .listen(port)
        .then(() => {
            const logger = new NestLogger('🚀 EXPRESS')
            logger.log(`Server is running at port ${port}`)
        })
        .catch((err) => {
            console.error(err)
        })
}

figlet(`NEST STARTER ${process.env.npm_package_version}`, (err, data) => {
    if (err) {
        console.error('An error ocurred trying to make figlet', err)
        process.exit()
    }

    console.log(data)

    bootstrap()
})

export const getInstance = () => {
    return app
}
